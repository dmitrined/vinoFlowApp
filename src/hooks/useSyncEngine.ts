/**
 * НАЗНАЧЕНИЕ: Хук для оркестрации синхронизации данных между локальным стором и Turso
 * ЗАВИСИМОСТИ: @/lib/store/useFermentationStore, @/lib/store/useHistoryStore, @/trpc/react, @/lib/sync/mapping
 * ОСОБЕННОСТИ: Реализует стратегию Last Write Wins, использует чистые функции маппинга
 */

import { useCallback, useRef } from "react";
import { useFermentationStore } from "@/lib/store/useFermentationStore";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { api } from "@/trpc/react";
import { 
  mapBarrelToSync, 
  mapReadingToSync, 
  mapAdditionToSync, 
  mapHistoryToSync 
} from "@/lib/sync/mapping";

// Глобальный флаг за пределами хука, чтобы он был общим для всех экземпляров
let isGlobalSyncing = false;
let lastSyncTime = 0;
const MIN_SYNC_INTERVAL = 2000; // Минимум 2 секунды между полными циклами

export function useSyncEngine() {
  const markBarrelsSynced = useFermentationStore(s => s.markBarrelsSynced);
  const markReadingsSynced = useFermentationStore(s => s.markReadingsSynced);
  const markAdditionsSynced = useFermentationStore(s => s.markAdditionsSynced);
  const hydrateFermentation = useFermentationStore(s => s.hydrateFromServer);
  
  const markHistorySynced = useHistoryStore(s => s.markHistorySynced);
  const hydrateHistory = useHistoryStore(s => s.hydrateFromServer);

  const pushBarrels = api.sync.pushBarrels.useMutation();
  const pushReadings = api.sync.pushReadings.useMutation();
  const pushAdditions = api.sync.pushAdditions.useMutation();
  const pushHistory = api.sync.pushHistory.useMutation();

  const pushLocalData = useCallback(async () => {
    // Внутренняя функция пуша не использует глобальный замок, 
    // так как она вызывается из syncAll, который уже защищен.
    try {
      // Актуальные данные из сторов без подписки на изменения
      const barrels = useFermentationStore.getState().barrels;
      const records = useHistoryStore.getState().records;

      const unsyncedBarrels = barrels
        .filter(b => b.synced === false && !b.isDeleted)
        .map(mapBarrelToSync);

      // Обработка удаленных бочек
      const deletedBarrels = barrels
        .filter(b => b.synced === false && b.isDeleted)
        .map(mapBarrelToSync);

      const allBarrelsToSync = [...unsyncedBarrels, ...deletedBarrels];

      const unsyncedReadings = barrels.flatMap(b => 
        (b.readings || [])
          .filter(r => r.synced === false)
          .map(r => mapReadingToSync(r, b.id))
      );

      const unsyncedAdditions = barrels.flatMap(b => 
        (b.additions || [])
          .filter(a => a.synced === false)
          .map(a => mapAdditionToSync(a, b.id))
      );

      const unsyncedHistory = records
        .filter(r => r.synced === false)
        .map(mapHistoryToSync);

      const syncPromises = [];

      if (allBarrelsToSync.length > 0) {
        syncPromises.push(
          pushBarrels.mutateAsync(allBarrelsToSync as any).then((res) => {
            markBarrelsSynced(res.syncedIds);
          })
        );
      }

      if (unsyncedReadings.length > 0) {
        syncPromises.push(
          pushReadings.mutateAsync(unsyncedReadings).then((res) => {
            markReadingsSynced(res.syncedIds);
          })
        );
      }

      if (unsyncedAdditions.length > 0) {
        syncPromises.push(
          pushAdditions.mutateAsync(unsyncedAdditions).then((res) => {
            markAdditionsSynced(res.syncedIds);
          })
        );
      }

      if (unsyncedHistory.length > 0) {
        syncPromises.push(
          pushHistory.mutateAsync(unsyncedHistory).then((res) => {
            markHistorySynced(res.syncedIds);
          })
        );
      }

      if (syncPromises.length > 0) {
        await Promise.all(syncPromises);
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка выгрузки:", e);
    }
  }, [
    pushBarrels, 
    pushReadings, 
    pushAdditions, 
    pushHistory,
    markBarrelsSynced,
    markReadingsSynced,
    markAdditionsSynced,
    markHistorySynced
  ]);

  const pullQuery = api.sync.pullAll.useQuery(undefined, { 
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false
  });

  const pullData = useCallback(async () => {
    try {
      const { data } = await pullQuery.refetch();
      if (data) {
        // Проверяем, есть ли реально новые данные, чтобы не дергать стор зря
        // (упрощенно - просто прокидываем в гидратацию)
        hydrateFermentation({
          barrels: data.barrels as any[],
          readings: data.readings,
          additions: data.additions
        });
        hydrateHistory(data.history as any[]);
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка скачивания:", e);
    }
  }, [pullQuery, hydrateFermentation, hydrateHistory]);

  const syncAll = useCallback(async () => {
    // Глобальная блокировка для всех экземпляров хука
    if (isGlobalSyncing) return;
    
    // Защита от слишком частых вызовов (debounce/throttle)
    const now = Date.now();
    if (now - lastSyncTime < MIN_SYNC_INTERVAL) return;

    try {
      isGlobalSyncing = true;
      lastSyncTime = now;
      
      await pushLocalData();
      await pullData();
    } finally {
      isGlobalSyncing = false;
    }
  }, [pushLocalData, pullData]);

  return { 
    pushLocalData, 
    pullData,
    syncAll,
    isSyncing: isGlobalSyncing || pushBarrels.isPending || pullQuery.isFetching
  };
}


