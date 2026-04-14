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

export function useSyncEngine() {
  const { barrels, markBarrelsSynced, markReadingsSynced, markAdditionsSynced } = useFermentationStore();
  const { records, markHistorySynced } = useHistoryStore();

  const pushBarrels = api.sync.pushBarrels.useMutation();
  const pushReadings = api.sync.pushReadings.useMutation();
  const pushAdditions = api.sync.pushAdditions.useMutation();
  const pushHistory = api.sync.pushHistory.useMutation();

  const isExecuting = useRef(false);

  const pushLocalData = useCallback(async () => {
    if (isExecuting.current) {
        console.log("SyncEngine: Синхронизация уже запущена, пропуск...");
        return;
    }

    try {
      isExecuting.current = true;
      const unsyncedBarrels = barrels
        .filter(b => b.synced === false)
        .map(mapBarrelToSync);

      const unsyncedReadings = barrels
        .flatMap(b => b.readings.map(r => mapReadingToSync(r, b.id)))
        .filter(r => r.synced === false);

      const unsyncedAdditions = barrels
        .flatMap(b => (b.additions || []).map(a => mapAdditionToSync(a, b.id)))
        .filter(a => a.synced === false);

      const unsyncedHistory = records
        .filter(h => h.synced === false)
        .map(mapHistoryToSync);

      const syncPromises = [];

      if (unsyncedBarrels.length > 0) {
        syncPromises.push(
          pushBarrels.mutateAsync(unsyncedBarrels)
            .then(res => markBarrelsSynced(res.syncedIds))
        );
      }
      
      if (unsyncedReadings.length > 0) {
        syncPromises.push(
          pushReadings.mutateAsync(unsyncedReadings)
            .then(res => markReadingsSynced(res.syncedIds))
        );
      }

      if (unsyncedAdditions.length > 0) {
        syncPromises.push(
          pushAdditions.mutateAsync(unsyncedAdditions)
            .then(res => markAdditionsSynced(res.syncedIds))
        );
      }

      if (unsyncedHistory.length > 0) {
        syncPromises.push(
          pushHistory.mutateAsync(unsyncedHistory)
            .then(res => markHistorySynced(res.syncedIds))
        );
      }

      if (syncPromises.length > 0) {
        await Promise.all(syncPromises);
        console.log("SyncEngine: Данные успешно синхронизированы");
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка синхронизации:", e);
    } finally {
      isExecuting.current = false;
    }
  }, [
    barrels, 
    records, 
    pushBarrels, 
    pushReadings, 
    pushAdditions, 
    pushHistory,
    markBarrelsSynced,
    markReadingsSynced,
    markAdditionsSynced,
    markHistorySynced
  ]);

  const { hydrateFromServer: hydrateFermentation } = useFermentationStore();
  const { hydrateFromServer: hydrateHistory } = useHistoryStore();
  
  const pullQuery = api.sync.pullAll.useQuery(undefined, { enabled: false });

  const pullData = useCallback(async () => {
    try {
      const { data } = await pullQuery.refetch();
      if (data) {
        hydrateFermentation({
          barrels: data.barrels as any[], // type assertion due to generic Date/string conversions
          readings: data.readings,
          additions: data.additions
        });
        hydrateHistory(data.history as any[]);
        console.log("SyncEngine: Успешно получены новые данные");
      }
    } catch (e) {
      console.error("SyncEngine: Ошибка при скачивании данных", e);
    }
  }, [pullQuery, hydrateFermentation, hydrateHistory]);

  const syncAll = useCallback(async () => {
    await pushLocalData();
    await pullData();
  }, [pushLocalData, pullData]);

  return { 
    pushLocalData, 
    pullData,
    syncAll,
    isSyncing: pushBarrels.isPending || pushReadings.isPending || pushAdditions.isPending || pushHistory.isPending || pullQuery.isFetching
  };
}
