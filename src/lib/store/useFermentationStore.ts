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
    
    // Гидратация с сервера (для скачивания изменений от других устройств)
    hydrateFromServer: (serverData: { barrels: any[]; readings: any[]; additions: any[] }) => void;
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
            
            hydrateFromServer: (serverData) => set((state) => {
                const localBarrelsMap = new Map(state.barrels.map(b => [b.id, b]));
                const mergedBarrels: Barrel[] = [];

                for (const sb of serverData.barrels) {
                    const lb = localBarrelsMap.get(sb.id);
                    if (!lb) {
                        // Create shell barrel, then we populate readings/additions
                        mergedBarrels.push({
                            id: sb.id,
                            number: sb.name || '',
                            status: sb.status as any,
                            startDate: sb.updatedAt.split('T')[0], // Approximation
                            updatedAt: sb.updatedAt,
                            isDeleted: sb.isDeleted,
                            synced: true,
                            readings: [],
                            additions: []
                        });
                    } else {
                        const sTime = new Date(sb.updatedAt).getTime();
                        const lTime = new Date(lb.updatedAt).getTime();
                        if (sTime > lTime) {
                            mergedBarrels.push({
                                ...lb,
                                number: sb.name || lb.number,
                                status: sb.status as any,
                                updatedAt: sb.updatedAt,
                                isDeleted: sb.isDeleted,
                                synced: true
                            });
                        } else {
                            mergedBarrels.push(lb); // Keep local if it's newer
                        }
                        localBarrelsMap.delete(sb.id);
                    }
                }
                
                // Add any local-only barrels that aren't on server yet
                for (const lb of localBarrelsMap.values()) {
                    mergedBarrels.push(lb);
                }

                // Process readings
                const readingsByBarrelId: Record<string, Reading[]> = {};
                for (const sr of serverData.readings) {
                    if (!readingsByBarrelId[sr.barrelId]) readingsByBarrelId[sr.barrelId] = [];
                    readingsByBarrelId[sr.barrelId].push({
                        id: sr.id,
                        date: sr.date,
                        oechsle: sr.oechsle || 0,
                        temperature: sr.temperature || 0,
                        updatedAt: sr.updatedAt,
                        isDeleted: sr.isDeleted,
                        synced: true
                    });
                }

                // Process additions
                const additionsByBarrelId: Record<string, Addition[]> = {};
                for (const sa of serverData.additions) {
                    if (!additionsByBarrelId[sa.barrelId]) additionsByBarrelId[sa.barrelId] = [];
                    additionsByBarrelId[sa.barrelId].push({
                        id: sa.id,
                        date: sa.date,
                        name: sa.name,
                        dosage: parseFloat(sa.dosage) || 0,
                        unit: sa.unit,
                        updatedAt: sa.updatedAt,
                        isDeleted: sa.isDeleted,
                        synced: true
                    });
                }

                // Merge readings and additions into barrels
                const finalBarrels = mergedBarrels.map(b => {
                    // Update readings
                    const localReadingsMap = new Map(b.readings?.map(r => [r.id, r]) || []);
                    const mergedReadings: Reading[] = [];
                    const serverReadings = readingsByBarrelId[b.id] || [];

                    for (const sr of serverReadings) {
                        const lr = localReadingsMap.get(sr.id);
                        if (!lr) {
                            mergedReadings.push(sr);
                        } else {
                            const sTime = new Date(sr.updatedAt).getTime();
                            const lTime = new Date(lr.updatedAt).getTime();
                            if (sTime > lTime) {
                                mergedReadings.push(sr);
                            } else {
                                mergedReadings.push(lr);
                            }
                            localReadingsMap.delete(sr.id);
                        }
                    }
                    for (const lr of localReadingsMap.values()) {
                        mergedReadings.push(lr);
                    }

                    // Update additions
                    const localAdditionsMap = new Map(b.additions?.map(a => [a.id, a]) || []);
                    const mergedAdditions: Addition[] = [];
                    const serverAdditions = additionsByBarrelId[b.id] || [];

                    for (const sa of serverAdditions) {
                        const la = localAdditionsMap.get(sa.id);
                        if (!la) {
                            mergedAdditions.push(sa);
                        } else {
                            const sTime = new Date(sa.updatedAt).getTime();
                            const lTime = new Date(la.updatedAt).getTime();
                            if (sTime > lTime) {
                                mergedAdditions.push(sa);
                            } else {
                                mergedAdditions.push(la);
                            }
                            localAdditionsMap.delete(sa.id);
                        }
                    }
                    for (const la of localAdditionsMap.values()) {
                        mergedAdditions.push(la);
                    }

                    return { ...b, readings: mergedReadings, additions: mergedAdditions };
                });

                return { barrels: finalBarrels };
            }),
        }),
        {
            name: 'vinoflow-fermentation-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
