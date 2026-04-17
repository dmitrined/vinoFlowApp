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
    volume: b.volume || 0,
    status: b.status,
    notes: b.notes || null,
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
