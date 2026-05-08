import { describe, it, expect } from 'vitest';
import { getTroostData } from '../lib/calculations';
import { TROOST_TABLE } from '../lib/troostData';

describe('Enological Calculations Stress Test', () => {
    describe('getTroostData Edge Cases', () => {
        it('should handle minimum Oechsle', () => {
            const minOe = TROOST_TABLE[0].oe;
            const result = getTroostData(minOe, 'oe');
            expect(result.oe).toBe(minOe);
            expect(result.sugar).toBe(TROOST_TABLE[0].sugar);
        });

        it('should handle maximum Oechsle', () => {
            const maxOe = TROOST_TABLE[TROOST_TABLE.length - 1].oe;
            const result = getTroostData(maxOe, 'oe');
            expect(result.oe).toBe(maxOe);
            expect(result.sugar).toBe(TROOST_TABLE[TROOST_TABLE.length - 1].sugar);
        });

        it('should handle values below range', () => {
            const result = getTroostData(-10, 'oe');
            expect(result.oe).toBe(0);
            expect(result.sugar).toBe(0);
        });

        it('should handle values above range', () => {
            const maxOe = TROOST_TABLE[TROOST_TABLE.length - 1].oe;
            const result = getTroostData(1000, 'oe');
            expect(result.oe).toBe(maxOe);
        });

        it('should handle reverse lookup (alcVol) at limits', () => {
            const minAlc = TROOST_TABLE[0].alcVol;
            const maxAlc = TROOST_TABLE[TROOST_TABLE.length - 1].alcVol;
            
            expect(getTroostData(minAlc, 'alcVol').oe).toBe(TROOST_TABLE[0].oe);
            expect(getTroostData(maxAlc, 'alcVol').oe).toBe(TROOST_TABLE[TROOST_TABLE.length - 1].oe);
        });

        it('should handle NaN and non-numeric inputs gracefully', () => {
            const result = getTroostData(NaN, 'oe');
            expect(result.oe).toBe(0);
            expect(result.sugar).toBe(0);
        });
    });

    describe('Interpolation Accuracy', () => {
        it('should return linear interpolation for midpoint Oechsle', () => {
            // Pick two adjacent rows
            const r1 = TROOST_TABLE[5];
            const r2 = TROOST_TABLE[6];
            const midOe = (r1.oe + r2.oe) / 2;
            
            const result = getTroostData(midOe, 'oe');
            expect(result.oe).toBe(midOe);
            expect(result.sugar).toBeCloseTo((r1.sugar + r2.sugar) / 2, 5);
        });
    });

    describe('Performance', () => {
        it('should perform 10000 lookups within reasonable time', () => {
            const start = performance.now();
            for (let i = 0; i < 10000; i++) {
                getTroostData(40 + (i % 80), 'oe');
            }
            const end = performance.now();
            const duration = end - start;
            console.log(`10000 lookups took ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(100); // Should be very fast
        });
    });
});
