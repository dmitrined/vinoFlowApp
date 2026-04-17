/**
 * НАЗНАЧЕНИЕ: Типы данных для модуля отслеживания брожения
 * ЗАВИСИМОСТИ: Нет
 * ОСОБЕННОСТИ: Ограничение в 20 записей на бочку
 */

export interface Reading {
    id: string;
    date: string; // Формат ISO YYYY-MM-DD
    oechsle: number;
    temperature: number;
    updatedAt: string;
    isDeleted?: boolean;
    synced: boolean;
}

export interface Addition {
    id: string;
    date: string;
    name: string;
    dosage: number;
    unit: string;
    updatedAt: string;
    isDeleted?: boolean;
    synced: boolean;
}

export type BarrelStatus = 'active' | 'finished';

export interface Barrel {
    id: string;
    number: string; // Номер бочки (например "Barrel #42")
    status: BarrelStatus;
    startDate: string;
    volume?: number;
    readings: Reading[];
    additions: Addition[];
    updatedAt: string;
    isDeleted?: boolean;
    synced: boolean;
}
