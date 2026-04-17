/**
 * НАЗНАЧЕНИЕ: Глобальное состояние процесса синхронизации
 * ЗАВИСИМОСТИ: zustand
 * ОСОБЕННОСТИ: Не сохраняется в localStorage, так как отражает текущий рантайм процесс
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: number; // Локальное время последней попытки
  lastSyncTimestamp: string | null; // Время сервера последнего успешного PULL
  setSyncing: (status: boolean) => void;
  updateLastSyncTime: () => void;
  setLastSyncTimestamp: (timestamp: string) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      isSyncing: false,
      lastSyncTime: 0,
      lastSyncTimestamp: null,
      setSyncing: (status) => set({ isSyncing: status }),
      updateLastSyncTime: () => set({ lastSyncTime: Date.now() }),
      setLastSyncTimestamp: (timestamp) => set({ lastSyncTimestamp: timestamp }),
    }),
    {
      name: 'vinoflow-sync-meta-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
