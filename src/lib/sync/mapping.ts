/**
 * НАЗНАЧЕНИЕ: Чистые функции маппинга данных между фронтенд-сторами и бэкенд-схемой
 * ЗАВИСИМОСТИ: @/types/sync, @/types/fermentation, @/types/calculations
 * ОСОБЕННОСТИ: Используются SyncEngine для подготовки данных к отправке в облако
 */

import { Barrel } from "@/types/fermentation";
import { CalculationRecord } from "@/types/calculations";
import { SyncBarrel, SyncReading, SyncAddition, SyncHistoryRecord } from "@/types/sync";

/**
 * Преобразование локальной модели бочки в формат для синхронизации
 */
export function mapBarrelToSync(b: Barrel): SyncBarrel {
  return {
    id: b.id,
    name: b.number || "Unknown",
    type: "wine",
    variant: null,
    year: b.startDate?.split("-")[0] || new Date().getFullYear().toString(),
    volume: b.volume || 0,
    status: b.status,
    updatedAt: b.updatedAt,
    isDeleted: b.isDeleted || false,
    synced: b.synced
  };
}

/**
 * Преобразование локального замера в формат для синхронизации
 */
export function mapReadingToSync(r: any, barrelId: string): SyncReading {
  return {
    id: r.id,
    barrelId: barrelId,
    date: r.date,
    oechsle: r.oechsle,
    temperature: r.temperature,
    density: r.density,
    ph: r.ph,
    notes: r.notes,
    updatedAt: r.updatedAt,
    isDeleted: r.isDeleted || false
  };
}

/**
 * Преобразование локальной добавки в формат для синхронизации
 */
export function mapAdditionToSync(a: any, barrelId: string): SyncAddition {
  return {
    id: a.id,
    barrelId: barrelId,
    date: a.date,
    name: a.name,
    dosage: a.dosage.toString(),
    unit: a.unit,
    updatedAt: a.updatedAt,
    isDeleted: a.isDeleted || false
  };
}

/**
 * Преобразование записи истории калькулятора в формат для синхронизации
 */
export function mapHistoryToSync(h: CalculationRecord): SyncHistoryRecord {
  return {
    id: h.id,
    type: h.type,
    date: h.date,
    result: h.result,
    unit: h.unit || null,
    updatedAt: h.updatedAt,
    isDeleted: h.isDeleted || false
  };
}
