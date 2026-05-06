/**
 * НАЗНАЧЕНИЕ: Хук для оркестрации синхронизации данных между локальным стором и Turso
 * ЗАВИСИМОСТИ: @/lib/store/useFermentationStore, @/lib/store/useHistoryStore, @/lib/store/useSyncStore, @/trpc/react, @/lib/sync/mapping
 * ОСОБЕННОСТИ: Реализует стратегию Last Write Wins, использует чистые функции маппинга
 */

import { useCallback } from "react";
import { useFermentationStore } from "@/lib/store/useFermentationStore";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { useSyncStore } from "@/lib/store/useSyncStore";
import { api } from "@/trpc/react";
import { 
  mapBarrelToSync, 
  mapReadingToSync, 
  mapAdditionToSync, 
  mapHistoryToSync 
} from "@/lib/sync/mapping";
import { CalculationRecord } from "@/types/calculations";

const MIN_SYNC_INTERVAL = 30000; // 30 секунд между проверками облака для экономии батареи

export function useSyncEngine() {
  const isSyncing = useSyncStore(s => s.isSyncing);
  const lastSyncTime = useSyncStore(s => s.lastSyncTime);
  const lastSyncTimestamp = useSyncStore(s => s.lastSyncTimestamp);
  const setSyncing = useSyncStore(s => s.setSyncing);
  const updateLastSyncTime = useSyncStore(s => s.updateLastSyncTime);
  const setLastSyncTimestamp = useSyncStore(s => s.setLastSyncTimestamp);

  const markBarrelsSynced = useFermentationStore(s => s.markBarrelsSynced);
  const markReadingsSynced = useFermentationStore(s => s.markReadingsSynced);
  const markAdditionsSynced = useFermentationStore(s => s.markAdditionsSynced);
  const hydrateFermentation = useFermentationStore(s => s.hydrateFromServer);
  
  const markHistorySynced = useHistoryStore(s => s.markHistorySynced);
  const hydrateHistory = useHistoryStore(s => s.hydrateFromServer);

  const pushBatch = api.sync.pushBatch.useMutation();

  const pushLocalData = useCallback(async () => {
    try {
      const barrels = useFermentationStore.getState().barrels;
      const records = useHistoryStore.getState().records;

      const unsyncedBarrels = barrels
        .filter(b => b.synced === false && !b.isDeleted)
        .map(mapBarrelToSync);

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

      // Выполняем синхронизацию батчем
      if (allBarrelsToSync.length > 0 || unsyncedReadings.length > 0 || unsyncedAdditions.length > 0 || unsyncedHistory.length > 0) {
        console.log(`SyncEngine: Pushing batch... Barrels: ${allBarrelsToSync.length}, Readings: ${unsyncedReadings.length}, Additions: ${unsyncedAdditions.length}, History: ${unsyncedHistory.length}`);
        
        const res = await pushBatch.mutateAsync({
          barrels: allBarrelsToSync.length > 0 ? allBarrelsToSync : undefined,
          readings: unsyncedReadings.length > 0 ? unsyncedReadings : undefined,
          additions: unsyncedAdditions.length > 0 ? unsyncedAdditions : undefined,
          history: unsyncedHistory.length > 0 ? unsyncedHistory : undefined,
        });

        if (res.barrels.length > 0) markBarrelsSynced(res.barrels);
        if (res.readings.length > 0) markReadingsSynced(res.readings);
        if (res.additions.length > 0) markAdditionsSynced(res.additions);
        if (res.history.length > 0) markHistorySynced(res.history);
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка выгрузки:", e);
    }
  }, [
    pushBatch,
    markBarrelsSynced,
    markReadingsSynced,
    markAdditionsSynced,
    markHistorySynced
  ]);

  const pullQuery = api.sync.pullAll.useQuery({ since: lastSyncTimestamp || undefined }, { 
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false
  });

  const pullData = useCallback(async () => {
    try {
      const { data } = await pullQuery.refetch();
      if (data) {
        console.log("SyncEngine: Pull results:", {
          barrels: data.barrels.length,
          readings: data.readings.length,
          additions: data.additions.length,
          deletedAdditions: data.additions.filter(a => a.isDeleted).length
        });

        hydrateFermentation({
          barrels: data.barrels,
          readings: data.readings,
          additions: data.additions
        });
        hydrateHistory(data.history as CalculationRecord[]);
        
        if (data.serverTime) {
          setLastSyncTimestamp(data.serverTime);
        }
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка скачивания:", e);
    }
  }, [pullQuery, hydrateFermentation, hydrateHistory, setLastSyncTimestamp]);

  const syncAll = useCallback(async () => {
    if (isSyncing) return;
    
    const now = Date.now();
    if (now - lastSyncTime < MIN_SYNC_INTERVAL) return;

    try {
      setSyncing(true);
      updateLastSyncTime();
      
      await pushLocalData();
      await pullData();
    } finally {
      setSyncing(false);
    }
  }, [isSyncing, lastSyncTime, setSyncing, updateLastSyncTime, pushLocalData, pullData]);

  return { 
    pushLocalData, 
    pullData,
    syncAll,
    isSyncing: isSyncing || pushBatch.isPending || pullQuery.isFetching
  };
}
