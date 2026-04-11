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
    addRecord: (record: Omit<CalculationRecord, 'id' | 'date'>) => void;
    deleteRecord: (id: string) => void;
    clearHistory: () => void;
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
                        date: Date.now()
                    },
                    ...state.records
                ].slice(0, 6)
            })),
            deleteRecord: (id) => set((state) => ({
                records: state.records.filter(r => r.id !== id)
            })),
            clearHistory: () => set({ records: [] }),
        }),
        {
            name: 'vinoflow-history-storage',
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Например, если раньше records был чем-то другим, или нужно добавить поля
                    // Сейчас просто возвращаем как есть, но структура готова для миграций.
                    return persistedState as HistoryState;
                }
                return persistedState as HistoryState;
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
