/**
 * НАЗНАЧЕНИЕ: Типы данных для синхронизации между клиентом и сервером
 * ЗАВИСИМОСТИ: Нет
 * ОСОБЕННОСТИ: Соответствуют Zod-схемам в syncRouter
 */

export interface SyncBarrel {
  id: string;
  name: string;
  volume?: number | null;
  status: 'empty' | 'fermenting' | 'aging' | 'bottled' | 'sold' | 'archived' | 'active' | 'finished';
  notes?: string | null;
  updatedAt: string;
  isDeleted: boolean;
  synced?: boolean;
}

export interface SyncReading {
  id: string;
  barrelId: string;
  date: string;
  oechsle?: number | null;
  temperature?: number | null;
  updatedAt: string;
  isDeleted: boolean;
  synced?: boolean;
}

export interface SyncAddition {
  id: string;
  barrelId: string;
  date: string;
  name: string;
  dosage: string;
  unit: string;
  updatedAt: string;
  isDeleted: boolean;
  synced?: boolean;
}

export interface SyncHistoryRecord {
  id: string;
  type: string;
  date: number;
  result: string;
  unit?: string | null;
  updatedAt: string;
  isDeleted: boolean;
  synced?: boolean;
}
