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

  const pushBarrels = api.sync.pushBarrels.useMutation();
  const pushReadings = api.sync.pushReadings.useMutation();
  const pushAdditions = api.sync.pushAdditions.useMutation();
  const pushHistory = api.sync.pushHistory.useMutation();

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

  const pullQuery = api.sync.pullAll.useQuery({ since: lastSyncTimestamp || undefined }, { 
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false
  });

  const pullData = useCallback(async () => {
    try {
      const { data } = await pullQuery.refetch();
      if (data) {
        hydrateFermentation({
          barrels: data.barrels as any[],
          readings: data.readings,
          additions: data.additions
        });
        hydrateHistory(data.history as any[]);
        
        if (data.serverTime) {
          setLastSyncTimestamp(data.serverTime);
        }
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка скачивания:", e);
    }
  }, [pullQuery, hydrateFermentation, hydrateHistory]);

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
    isSyncing: isSyncing || pushBarrels.isPending || pullQuery.isFetching
  };
}
