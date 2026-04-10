/**
 * НАЗНАЧЕНИЕ: Модульные тесты для энологических расчетов
 * ЗАВИСИМОСТИ: vitest, @/lib/calculations
 * ОСОБЕННОСТИ: Тестирование конвертации алкоголя, добавки SR и расчетов SO2
 */

import { describe, it, expect } from 'vitest';
import {
    convertGLToVol,
    convertVolToGL,
    calcSR_Auf,
    calcSR_In,
    calcSRVerschnitt,
    calcMultiBlended,
    calcSO2Addition
} from '../lib/calculations';

describe('Enological Calculations', () => {

    describe('Alcohol Conversion', () => {
        it('should convert g/l to % Vol correctly', () => {
            expect(convertGLToVol(100)).toBeCloseTo(12.67, 2);
        });

        it('should convert % Vol to g/l correctly', () => {
            expect(convertVolToGL(12.67)).toBeCloseTo(100, 2);
        });

        it('should return 0 for negative inputs', () => {
            expect(convertGLToVol(-10)).toBe(0);
            expect(convertVolToGL(-10)).toBe(0);
        });

        it('should handle zero input correctly', () => {
            expect(convertGLToVol(0)).toBe(0);
            expect(convertVolToGL(0)).toBe(0);
        });

        it('should handle extremely high values', () => {
            // Unrealistic but should not crash or return NaN
            expect(convertGLToVol(1000000)).toBeGreaterThan(0);
        });
    });

    describe('Süßreserve (SR) Basic Calculation', () => {
        it('should calculate SR Auf correctly', () => {
            // 10% of 100L = 10L
            expect(calcSR_Auf(10, 100)).toBe(10);
        });

        it('should calculate SR In correctly', () => {
            // 10% inside 100L base: (10 / 90) * 100 = 11.11L
            expect(calcSR_In(10, 90)).toBe(10);
        });

        it('should handle edge cases for SR', () => {
            expect(calcSR_Auf(100, 100)).toBe(0); // Max 100%
            expect(calcSR_In(50, 50)).toBe(50); // 50% SR in 100L total = 50L base + 50L SR
        });

        it('should return 0 for negative or invalid inputs', () => {
            expect(calcSR_Auf(-10, 100)).toBe(0);
            expect(calcSR_Auf(10, -100)).toBe(0);
            expect(calcSR_In(110, 100)).toBe(0); // Above 100%
        });
    });

    describe('SR Blending (Mixing Rule)', () => {
        it('should calculate required SR based on sugar', () => {
            // SR: 800g/l, Wein: 10g/l, Liter: 1000L, Ziel: 50g/l
            // (1000 * (50-10)) / (800-50) = 40000 / 750 = 53.33
            expect(calcSRVerschnitt(800, 10, 1000, 50)).toBeCloseTo(53.33, 2);
        });

        it('should return 0 if targets are unreachable or invalid', () => {
            // Division by zero case: target sugar same as SR sugar
            expect(calcSRVerschnitt(50, 10, 1000, 50)).toBe(0);
            // Target lower than base wine sugar (negative result logic)
            expect(calcSRVerschnitt(800, 50, 1000, 10)).toBe(0);
        });

        it('should handle zero volume gracefully', () => {
            expect(calcSRVerschnitt(800, 10, 0, 50)).toBe(0);
        });
    });

    describe('Multi-Wine Assemblage', () => {
        it('should calculate weighted average correctly', () => {
            const wines = [
                { liter: 100, parameter: 10 }, // 1000 mass
                { liter: 200, parameter: 20 }, // 4000 mass
            ];
            // total: 300L, mass: 5000. avg: 5000 / 300 = 16.67
            expect(calcMultiBlended(wines)).toBeCloseTo(16.67, 2);
        });

        it('should handle empty or zero lists', () => {
            expect(calcMultiBlended([])).toBe(0);
            expect(calcMultiBlended([{ liter: 0, parameter: 100 }])).toBe(0);
        });

        it('should ignore negative volumes', () => {
            const wines = [
                { liter: 100, parameter: 10 },
                { liter: -50, parameter: 20 }
            ];
            expect(calcMultiBlended(wines)).toBe(10);
        });

        describe('SO2 Addition Calculation', () => {
            it('should calculate gas (100%) addition correctly', () => {
                // 1000L, +30mg/L, 100% -> (1000 * 30) / (10 * 100) = 30000 / 1000 = 30g
                expect(calcSO2Addition(1000, 30, 'gas', 100)).toBe(30);
            });

            it('should calculate powder (50%) addition correctly', () => {
                // 1000L, +30mg/L, 50% -> (1000 * 30) / (10 * 50) = 30000 / 500 = 60g
                expect(calcSO2Addition(1000, 30, 'powder', 50)).toBe(60);
            });

            it('should calculate liquid (150g/l) addition correctly', () => {
                // 1000L, +30mg/L, 150g/l -> (1000 * 30) / 150 = 30000 / 150 = 200ml
                expect(calcSO2Addition(1000, 30, 'liquid', 150)).toBe(200);
            });

            it('should return 0 for invalid inputs', () => {
                expect(calcSO2Addition(-100, 30, 'gas', 100)).toBe(0);
                expect(calcSO2Addition(1000, -30, 'gas', 100)).toBe(0);
                expect(calcSO2Addition(1000, 30, 'gas', 0)).toBe(0);
            });
        });
    });
});
