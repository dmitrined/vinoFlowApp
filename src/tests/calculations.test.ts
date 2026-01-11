import { describe, it, expect } from 'vitest';
import {
    convertGLToVol,
    convertVolToGL,
    calcSR_Auf,
    calcSR_In,
    calcSRVerschnitt,
    calcMultiBlended
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
    });

    describe('SR Blending (Mixing Rule)', () => {
        it('should calculate required SR based on sugar', () => {
            // SR: 800g/l, Wein: 10g/l, Liter: 1000L, Ziel: 50g/l
            // (1000 * (50-10)) / (800-50) = 40000 / 750 = 53.33
            expect(calcSRVerschnitt(800, 10, 1000, 50)).toBeCloseTo(53.33, 2);
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
    });

});
