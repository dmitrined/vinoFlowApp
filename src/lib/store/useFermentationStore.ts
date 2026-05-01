/**
 * НАЗНАЧЕНИЕ: Глобальное состояние для отслеживания процессов брожения
 * ЗАВИСИМОСТИ: zustand, @/types/fermentation, @/lib/sync/idb-storage
 * ОСОБЕННОСТИ: IndexedDB persistence (idb-keyval), автоматическое слияние LWW, поддержка оффлайн-режима
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Barrel, Reading, Addition, BarrelStatus } from '@/types/fermentation';
import { mergeEntities } from '@/lib/sync/mergeUtils';
import { idbStorage } from './idb-storage';

interface FermentationState {
    barrels: Barrel[];
    
    // Действия с бочками
    addBarrel: (number: string) => void;
    deleteBarrel: (id: string) => void;
    changeStatus: (id: string, status: BarrelStatus) => void;
    updateBarrel: (id: string, data: Partial<Barrel>) => void;
    
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
    
    // Гидратация с сервера (для скачивания изменений от других устройств)
    hydrateFromServer: (serverData: { 
        barrels: { 
            id: string; 
            name: string; 
            status: string; 
            volume: number | null; 
            notes: string | null; 
            updatedAt: string; 
            isDeleted: boolean; 
        }[]; 
        readings: { 
            id: string; 
            barrelId: string; 
            date: string; 
            oechsle: number | null; 
            temperature: number | null; 
            updatedAt: string; 
            isDeleted: boolean; 
        }[]; 
        additions: { 
            id: string; 
            barrelId: string; 
            date: string; 
            name: string; 
            dosage: string; 
            unit: string; 
            updatedAt: string; 
            isDeleted: boolean; 
        }[] 
    }) => void;
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
                        notes: '',
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

            changeStatus: (id, newStatus) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { 
                        ...b, 
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                        synced: false
                    } : b
                )
            })),

            updateBarrel: (id, data) => set((state) => ({
                barrels: state.barrels.map(b => 
                    b.id === id ? { 
                        ...b, 
                        ...data,
                        updatedAt: new Date().toISOString(),
                        synced: false 
                    } : b
                )
            })),

            addReading: (barrelId, oechsle, temperature, date) => set((state) => ({
                barrels: state.barrels.map(b => {
                    if (b.id === barrelId) {
                        return {
                            ...b,
                            updatedAt: new Date().toISOString(),
                            synced: false,
                            readings: [
                                ...(b.readings || []),
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
                            readings: (b.readings || []).map(r => 
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
                            readings: (b.readings || []).map(r => 
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
                    readings: (b.readings || []).map(r => ids.includes(r.id) ? { ...r, synced: true } : r)
                }))
            })),

            markAdditionsSynced: (ids) => set((state) => ({
                barrels: state.barrels.map(b => ({
                    ...b,
                    additions: (b.additions || []).map(a => ids.includes(a.id) ? { ...a, synced: true } : a)
                }))
            })),
            
            hydrateFromServer: (serverData) => set((state) => {
                // 1. Группируем входящие серверные данные по ID бочки
                const serverReadingsByBarrel: Record<string, Reading[]> = {};
                serverData.readings.forEach(sr => {
                    if (!serverReadingsByBarrel[sr.barrelId]) serverReadingsByBarrel[sr.barrelId] = [];
                    serverReadingsByBarrel[sr.barrelId].push({
                        id: sr.id,
                        date: sr.date,
                        oechsle: sr.oechsle ?? 0,
                        temperature: sr.temperature ?? 0,
                        updatedAt: sr.updatedAt,
                        isDeleted: sr.isDeleted,
                        synced: true
                    });
                });

                const serverAdditionsByBarrel: Record<string, Addition[]> = {};
                serverData.additions.forEach(sa => {
                    if (!serverAdditionsByBarrel[sa.barrelId]) serverAdditionsByBarrel[sa.barrelId] = [];
                    serverAdditionsByBarrel[sa.barrelId].push({
                        id: sa.id,
                        date: sa.date,
                        name: sa.name,
                        dosage: parseFloat(sa.dosage) || 0,
                        unit: sa.unit,
                        updatedAt: sa.updatedAt,
                        isDeleted: sa.isDeleted,
                        synced: true
                    });
                });

                const serverBarrels = serverData.barrels.map(sb => ({
                    id: sb.id,
                    number: sb.name || '',
                    status: sb.status as BarrelStatus,
                    volume: sb.volume || 0,
                    notes: sb.notes || '',
                    updatedAt: sb.updatedAt,
                    isDeleted: sb.isDeleted,
                    synced: true
                }));

                // 3. Мержим метаданные бочек (имена, статусы, объем)
                const mergedBarrelsMetadata = mergeEntities(state.barrels, serverBarrels as Barrel[]);

                // 4. Финальный проход: восстанавливаем и мержим вложенные сущности
                const finalBarrels = mergedBarrelsMetadata.map(b => {
                    // Ищем локальную версию этой бочки, чтобы достать из нее исторические данные
                    const localVersion = state.barrels.find(lb => lb.id === b.id);
                    const localReadings = localVersion?.readings || [];
                    const localAdditions = localVersion?.additions || [];
                    
                    // Берем новые данные из текущего пакета синхронизации
                    const incomingReadings = serverReadingsByBarrel[b.id] || [];
                    const incomingAdditions = serverAdditionsByBarrel[b.id] || [];

                    return {
                        ...b,
                        // Самое важное: мержим локальную историю с новыми данными
                        readings: mergeEntities(localReadings, incomingReadings),
                        additions: mergeEntities(localAdditions, incomingAdditions)
                    } as Barrel;
                });

                return { barrels: finalBarrels };
            }),
        }),
        {
            name: 'vinoflow-fermentation-storage',
            storage: createJSONStorage(() => idbStorage),
        }
    )
);
