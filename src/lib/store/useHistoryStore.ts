/**
 * НАЗНАЧЕНИЕ: Глобальное состояние истории расчетов
 * ЗАВИСИМОСТИ: zustand, zustand/middleware
 * ОСОБЕННОСТИ: Автоматическое сохранение в LocalStorage (persist), хранение последних 6 записей
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CalculationRecord } from '@/types/calculations';

import { mergeEntities } from '@/lib/sync/mergeUtils';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
    records: CalculationRecord[];
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    addRecord: (record: Omit<CalculationRecord, 'id' | 'date' | 'updatedAt' | 'synced' | 'isDeleted'>) => void;
    deleteRecord: (id: string) => void;
    clearHistory: () => void;
    markHistorySynced: (ids: string[]) => void;
    hydrateFromServer: (serverHistory: CalculationRecord[]) => void;
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
                        id: uuidv4(),
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
            clearHistory: () => set((state) => ({
                records: state.records.map(r => ({ 
                    ...r, 
                    isDeleted: true, 
                    updatedAt: new Date().toISOString(), 
                    synced: false 
                }))
            })),
            markHistorySynced: (ids: string[]) => set((state) => ({
                records: state.records.map(r => ids.includes(r.id) ? { ...r, synced: true } : r)
            })),
            hydrateFromServer: (serverHistory) => set((state) => {
                const merged = mergeEntities(state.records, serverHistory);
                
                // Keep only top 6 and sort by date descending
                const sorted = merged
                    .filter(r => !r.isDeleted)
                    .sort((a, b) => Number(b.date) - Number(a.date));
                    
                return { records: sorted.slice(0, 6) };
            }),
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
            onRehydrateStorage: () => {
                return (rehydratedState, error) => {
                    if (!error && rehydratedState) {
                        rehydratedState.setHasHydrated(true);
                    }
                };
            },
        }
    )
);
