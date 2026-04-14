/**
 * НАЗНАЧЕНИЕ: Глобальное состояние истории расчетов
 * ЗАВИСИМОСТИ: zustand, zustand/middleware
 * ОСОБЕННОСТИ: Автоматическое сохранение в LocalStorage (persist), хранение последних 6 записей
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CalculationType, CalculationRecord } from '@/types/calculations';

interface HistoryState {
    records: CalculationRecord[];
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    addRecord: (record: Omit<CalculationRecord, 'id' | 'date' | 'updatedAt' | 'synced' | 'isDeleted'>) => void;
    deleteRecord: (id: string) => void;
    clearHistory: () => void;
    markHistorySynced: (ids: string[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            records: [],
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            addRecord: (record) => set((state) => ({
                records: [
                    {
                        ...record,
                        id: crypto.randomUUID(),
                        date: Date.now(),
                        updatedAt: new Date().toISOString(),
                        isDeleted: false,
                        synced: false
                    },
                    ...state.records
                ].slice(0, 6)
            })),
            deleteRecord: (id) => set((state) => ({
                records: state.records.map(r => 
                    r.id === id ? { ...r, isDeleted: true, updatedAt: new Date().toISOString(), synced: false } : r
                )
            })),
            clearHistory: () => set({ records: [] }),
            markHistorySynced: (ids: string[]) => set((state) => ({
                records: state.records.map(r => ids.includes(r.id) ? { ...r, synced: true } : r)
            })),
        }),
        {
            name: 'vinoflow-history-storage',
            version: 1,
            migrate: (persistedState: unknown, version: number) => {
                const state = persistedState as HistoryState;
                if (version === 0) {
                    // Структура готова для будущих миграций данных
                    return state;
                }
                return state;
            },
            onRehydrateStorage: (state) => {
                return (rehydratedState, error) => {
                    if (!error && rehydratedState) {
                        rehydratedState.setHasHydrated(true);
                    }
                };
            },
        }
    )
);
