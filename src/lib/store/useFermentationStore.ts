/**
 * НАЗНАЧЕНИЕ: Глобальное состояние для отслеживания брожения
 * ЗАВИСИМОСТИ: zustand, fermentation.ts
 * ОСОБЕННОСТИ: LocalStorage persistence, лимит 20 записей на бочку
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Barrel, Reading, Addition } from '@/types/fermentation';

interface FermentationState {
    barrels: Barrel[];
    
    // Действия с бочками
    addBarrel: (number: string) => void;
    deleteBarrel: (id: string) => void;
    toggleStatus: (id: string) => void;
    updateBarrel: (id: string, number: string) => void;
    
    // Действия с записями
    addReading: (barrelId: string, oechsle: number, temperature: number, date?: string) => void;
    updateReading: (barrelId: string, readingId: string, data: Partial<Reading>) => void;
    deleteReading: (barrelId: string, readingId: string) => void;
    
    // Действия с добавками
    addAddition: (barrelId: string, name: string, dosage: number, unit: string, date: string) => void;
    updateAddition: (barrelId: string, additionId: string, data: Partial<Addition>) => void;
    deleteAddition: (barrelId: string, additionId: string) => void;
}

export const useFermentationStore = create<FermentationState>()(
    persist(
        (set) => ({
            barrels: [],

            addBarrel: (number) => set((state) => ({
                barrels: [
                    ...state.barrels,
                    {
                        id: Math.random().toString(36).substring(2, 9),
                        number,
                        status: 'active',
                        startDate: new Date().toISOString().split('T')[0],
                        readings: [],
                        additions: []
                    }
                ]
            })),

            deleteBarrel: (id) => set((state) => ({
                barrels: state.barrels.filter(b => b.id !== id)
            })),

            toggleStatus: (id) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { ...b, status: b.status === 'active' ? 'finished' : 'active' } : b
                )
            })),

            updateBarrel: (id, number) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { ...b, number } : b
                )
            })),

            addReading: (barrelId, oechsle, temperature, date) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        if (b.readings.length >= 20) return b; // Лимит 20 записей
                        return {
                            ...b,
                            readings: [
                                ...b.readings,
                                {
                                    id: Math.random().toString(36).substring(2, 9),
                                    date: date || new Date().toISOString().split('T')[0],
                                    oechsle,
                                    temperature
                                }
                            ]
                        };
                    }
                    return b;
                })
            })),

            updateReading: (barrelId, readingId, data) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        return {
                            ...b,
                            readings: b.readings.map(r => 
                                r.id === readingId ? { ...r, ...data } : r
                            )
                        };
                    }
                    return b;
                })
            })),

            deleteReading: (barrelId, readingId) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        return {
                            ...b,
                            readings: b.readings.filter(r => r.id !== readingId)
                        };
                    }
                    return b;
                })
            })),

            addAddition: (barrelId, name, dosage, unit, date) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        return {
                            ...b,
                            additions: [
                                ...(b.additions || []),
                                {
                                    id: Math.random().toString(36).substring(2, 9),
                                    date,
                                    name,
                                    dosage,
                                    unit
                                }
                            ]
                        };
                    }
                    return b;
                })
            })),

            deleteAddition: (barrelId, additionId) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        return {
                            ...b,
                            additions: (b.additions || []).filter(a => a.id !== additionId)
                        };
                    }
                    return b;
                })
            })),

            updateAddition: (barrelId, additionId, data) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        return {
                            ...b,
                            additions: (b.additions || []).map(a => 
                                a.id === additionId ? { ...a, ...data } : a
                            )
                        };
                    }
                    return b;
                })
            })),
        }),
        {
            name: 'vinoflow-fermentation-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
