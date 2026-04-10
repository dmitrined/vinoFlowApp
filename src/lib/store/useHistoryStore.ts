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
    addRecord: (record: Omit<CalculationRecord, 'id' | 'date'>) => void;
    deleteRecord: (id: string) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            records: [],
            addRecord: (record) => set((state) => ({
                records: [
                    {
                        ...record,
                        id: crypto.randomUUID(),
                        date: Date.now()
                    },
                    ...state.records
                ].slice(0, 6) // Ограничиваем 6 записями
            })),
            deleteRecord: (id) => set((state) => ({
                records: state.records.filter(r => r.id !== id)
            })),
            clearHistory: () => set({ records: [] }),
        }),
        {
            name: 'vinoflow-history-storage',
        }
    )
);
