/**
 * НАЗНАЧЕНИЕ: Типы данных для модуля отслеживания брожения
 * ЗАВИСИМОСТИ: Нет
 * ОСОБЕННОСТИ: Ограничение в 20 записей на бочку
 */

export interface Reading {
    id: string;
    date: string; // ISO YYYY-MM-DD
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

export type BarrelStatus = 'active' | 'finished' | 'empty' | 'fermenting' | 'aging' | 'bottled' | 'sold' | 'archived';

export interface Barrel {
    id: string;
    number: string;
    status: BarrelStatus;
    volume?: number;
    notes?: string;
    readings: Reading[];
    additions: Addition[];
    updatedAt: string;
    isDeleted?: boolean;
    synced: boolean;
}
