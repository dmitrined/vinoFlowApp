/**
 * НАЗНАЧЕНИЕ: Тестирование функций маппинга для синхронизации
 * ЗАВИСИМОСТИ: vitest, @/lib/sync/mapping
 */

import { describe, it, expect } from 'vitest';
import { 
    mapBarrelToSync, 
    mapReadingToSync, 
    mapAdditionToSync, 
    mapHistoryToSync 
} from '../lib/sync/mapping';
import { Barrel } from '../types/fermentation';
import { CalculationRecord } from '../types/calculations';

describe('Sync Mapping Functions', () => {
    it('should correctly map a Barrel to SyncBarrel', () => {
        const barrel: Barrel = {
            id: 'uuid-1',
            number: 'A-101',
            status: 'active',
            startDate: '2024-03-01',
            readings: [],
            additions: [],
            updatedAt: '2024-03-01T10:00:00Z',
            synced: false
        };

        const result = mapBarrelToSync(barrel);
        
        expect(result.id).toBe('uuid-1');
        expect(result.name).toBe('A-101');
        expect(result.year).toBe('2024');
        expect(result.updatedAt).toBe('2024-03-01T10:00:00Z');
        expect(result.isDeleted).toBe(false);
    });

    it('should handle missing barrel number with default name', () => {
        const barrel: Barrel = {
            id: 'uuid-2',
            number: '',
            status: 'active',
            startDate: '2023-10-01',
            readings: [],
            additions: [],
            updatedAt: '2023-10-01T12:00:00Z',
            synced: false
        };

        const result = mapBarrelToSync(barrel);
        expect(result.name).toBe('Unknown');
        expect(result.year).toBe('2023');
    });

    it('should correctly map a Reading to SyncReading', () => {
        const reading = {
            id: 'r-1',
            date: '2024-03-05',
            oechsle: 85,
            temperature: 18,
            updatedAt: '2024-03-05T08:00:00Z',
            synced: false
        };

        const result = mapReadingToSync(reading, 'barrel-1');
        
        expect(result.barrelId).toBe('barrel-1');
        expect(result.oechsle).toBe(85);
        expect(result.temperature).toBe(18);
        expect(result.isDeleted).toBe(false);
    });

    it('should correctly map an Addition to SyncAddition (dosage as string)', () => {
        const addition = {
            id: 'a-1',
            date: '2024-03-06',
            name: 'Sugar',
            dosage: 5.5,
            unit: 'kg',
            updatedAt: '2024-03-06T09:00:00Z',
            synced: false
        };

        const result = mapAdditionToSync(addition, 'barrel-1');
        
        expect(result.dosage).toBe('5.5');
        expect(result.name).toBe('Sugar');
        expect(result.unit).toBe('kg');
    });

    it('should correctly map a HistoryRecord to SyncHistoryRecord', () => {
        const record: CalculationRecord = {
            id: 'h-1',
            type: 'chaptalization',
            date: 1710332400000,
            result: '5.2',
            unit: 'kg',
            updatedAt: '2024-03-13T12:00:00Z',
            synced: false,
            isDeleted: false
        };

        const result = mapHistoryToSync(record);
        
        expect(result.id).toBe('h-1');
        expect(result.type).toBe('chaptalization');
        expect(result.result).toBe('5.2');
        expect(result.unit).toBe('kg');
    });
});
