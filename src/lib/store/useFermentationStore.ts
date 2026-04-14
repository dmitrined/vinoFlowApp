/**
 * НАЗНАЧЕНИЕ: Глобальное состояние для отслеживания процессов брожения
 * ЗАВИСИМОСТИ: zustand, @/types/fermentation
 * ОСОБЕННОСТИ: LocalStorage persistence, лимит 20 записей на бочку, поддержка оффлайн-флагов синхронизации
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
    
    // Действия с замерами параметров (плотность, температура и т.д.)
    addReading: (barrelId: string, oechsle: number, temperature: number, date?: string) => void;
    updateReading: (barrelId: string, readingId: string, data: Partial<Reading>) => void;
    deleteReading: (barrelId: string, readingId: string) => void;
    
    // Действия с добавками ингредиентов
    addAddition: (barrelId: string, name: string, dosage: number, unit: string, date: string) => void;
    updateAddition: (barrelId: string, additionId: string, data: Partial<Addition>) => void;
    deleteAddition: (barrelId: string, additionId: string) => void;

    // Методы для работы SyncEngine (установка флагов успешной синхронизации)
    markBarrelsSynced: (ids: string[]) => void;
    markReadingsSynced: (ids: string[]) => void;
    markAdditionsSynced: (ids: string[]) => void;
}

export const useFermentationStore = create<FermentationState>()(
    persist(
        (set) => ({
            barrels: [],

            addBarrel: (number) => set((state) => ({
                barrels: [
                    ...state.barrels,
                    {
                        id: crypto.randomUUID(),
                        number,
                        status: 'active',
                        startDate: new Date().toISOString().split('T')[0],
                        readings: [],
                        additions: [],
                        updatedAt: new Date().toISOString(),
                        synced: false
                    }
                ]
            })),

            deleteBarrel: (id) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { ...b, isDeleted: true, updatedAt: new Date().toISOString(), synced: false } : b
                )
            })),

            toggleStatus: (id) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { 
                        ...b, 
                        status: b.status === 'active' ? 'finished' : 'active',
                        updatedAt: new Date().toISOString(),
                        synced: false
                    } : b
                )
            })),

            updateBarrel: (id, number) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { 
                        ...b, 
                        number,
                        updatedAt: new Date().toISOString(),
                        synced: false 
                    } : b
                )
            })),

            addReading: (barrelId, oechsle, temperature, date) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        if (b.readings.length >= 20) return b; // Ограничение для оптимизации стора
                        return {
                            ...b,
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            readings: [
                                ...b.readings,
                                {
                                    id: crypto.randomUUID(),
                                    date: date || new Date().toISOString().split('T')[0],
                                    oechsle,
                                    temperature,
                                    updatedAt: new Date().toISOString(),
                                    synced: false
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
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            readings: b.readings.map(r => 
                                r.id === readingId ? { 
                                    ...r, 
                                    ...data,
                                    updatedAt: new Date().toISOString(),
                                    synced: false
                                } : r
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
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            readings: b.readings.map(r => 
                                r.id === readingId ? { ...r, isDeleted: true, updatedAt: new Date().toISOString(), synced: false } : r
                            )
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
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            additions: [
                                ...(b.additions || []),
                                {
                                    id: crypto.randomUUID(),
                                    date,
                                    name,
                                    dosage,
                                    unit,
                                    updatedAt: new Date().toISOString(),
                                    synced: false
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
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            additions: (b.additions || []).map(a => 
                                a.id === additionId ? { ...a, isDeleted: true, updatedAt: new Date().toISOString(), synced: false } : a
                            )
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
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            additions: (b.additions || []).map(a => 
                                a.id === additionId ? { 
                                    ...a, 
                                    ...data,
                                    updatedAt: new Date().toISOString(),
                                    synced: false
                                } : a
                            )
                        };
                    }
                    return b;
                })
            })),

            markBarrelsSynced: (ids) => set((state) => ({
                barrels: state.barrels.map(b => ids.includes(b.id) ? { ...b, synced: true } : b)
            })),

            markReadingsSynced: (ids) => set((state) => ({
                barrels: state.barrels.map(b => ({
                    ...b,
                    readings: b.readings.map(r => ids.includes(r.id) ? { ...r, synced: true } : r)
                }))
            })),

            markAdditionsSynced: (ids) => set((state) => ({
                barrels: state.barrels.map(b => ({
                    ...b,
                    additions: (b.additions || []).map(a => ids.includes(a.id) ? { ...a, synced: true } : a)
                }))
            })),
        }),
        {
            name: 'vinoflow-fermentation-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
