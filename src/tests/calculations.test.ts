import { describe, it, expect } from 'vitest';
import { 
    convertGLToVol, 
    convertVolToGL, 
    calcSR_Auf, 
    calcSR_In, 
    calcSRVerschnitt, 
    calcMultiBlended, 
    calcSO2Addition,
    calcChaptalization,
    calcAcidManagement
} from '../lib/calculations';

describe('Enological Calculations', () => {
    describe('Alcohol Conversion', () => {
        it('should correctly convert g/L to % Vol', () => {
            expect(convertGLToVol(78.9)).toBeCloseTo(10.0, 1);
            expect(convertGLToVol(0)).toBe(0);
            expect(convertGLToVol(-10)).toBe(0);
        });

        it('should correctly convert % Vol to g/L', () => {
            expect(convertVolToGL(10.0)).toBeCloseTo(78.9, 1);
            expect(convertVolToGL(0)).toBe(0);
            expect(convertVolToGL(-10)).toBe(0);
        });
    });

    describe('Süßreserve (SR)', () => {
        it('should calculate SR (Auf) correctly', () => {
            // 10% on top of 1000L = 100L
            expect(calcSR_Auf(10, 1000)).toBe(100);
            expect(calcSR_Auf(0, 1000)).toBe(0);
            expect(calcSR_Auf(110, 1000)).toBe(0); // Invalid percent
        });

        it('should calculate SR (In) correctly', () => {
            // 10% in total volume of 1000L base wine
            // result = (10 / (100 - 10)) * 1000 = 111.11
            expect(calcSR_In(10, 1000)).toBeCloseTo(111.11, 2);
        });

        it('should calculate SR Blending (Verschnitt)', () => {
            // Wine: 1000L @ 0g/L sugar
            // SR: 800g/L sugar
            // Target: 8g/L sugar
            // Formula: (1000 * (8 - 0)) / (800 - 8) = 8000 / 792 = 10.101
            expect(calcSRVerschnitt(800, 0, 1000, 8)).toBeCloseTo(10.1, 1);
        });
    });

    describe('Multi-Blending', () => {
        it('should calculate weighted average correctly', () => {
            const entries = [
                { liter: 100, parameter: 10 },
                { liter: 200, parameter: 20 }
            ];
            // Total volume: 300
            // Total mass: (100*10) + (200*20) = 1000 + 4000 = 5000
            // Result: 5000 / 300 = 16.666
            expect(calcMultiBlended(entries)).toBeCloseTo(16.67, 2);
        });

        it('should handle empty or zero volume entries', () => {
            expect(calcMultiBlended([])).toBe(0);
            expect(calcMultiBlended([{ liter: 0, parameter: 10 }])).toBe(0);
        });
    });

    describe('SO2 Addition', () => {
        it('should calculate SO2 for Gas (100%)', () => {
            // 1000L, +30mg/L SO2
            // Formula: (1000 * 30) / (10 * 100) = 30000 / 1000 = 30g
            expect(calcSO2Addition(1000, 30, 'gas', 100)).toBe(30);
        });

        it('should calculate SO2 for Powder (50%)', () => {
            // Formula: (1000 * 30) / (10 * 50) = 30000 / 500 = 60g
            expect(calcSO2Addition(1000, 30, 'powder', 50)).toBe(60);
        });

        it('should calculate SO2 for Liquid (150g/L)', () => {
            // Formula: (1000 * 30) / 150 = 30000 / 150 = 200ml
            expect(calcSO2Addition(1000, 30, 'liquid', 150)).toBe(200);
        });
    });

    describe('Chaptalization', () => {
        it('should calculate sugar and volume increase using user custom formula (Delta g/L Alc * 2.5)', () => {
            // 1000L, 10.0% Vol -> 12.51% Vol
            // From Troost Table:
            // 10.0% Vol = 78.9 g/L Alc
            // 12.51% Vol = 98.8 g/L Alc
            // Delta g/L Alc: 98.8 - 78.9 = 19.9
            // Sugar: (19.9 * 2.5 * 1000) / 1000 = 49.75 kg
            const result = calcChaptalization(1000, 10.0, 12.51, 'alcVol');
            
            expect(result.sugar).toBeCloseTo(49.75, 2);
            expect(result.deltaVol).toBeCloseTo(49.75 * 0.63, 2);
        });

        it('should handle alcGl input correctly with user custom formula', () => {
            // 1000L, 78.9 g/L alc -> 98.8 g/L alc
            // Delta g/L Alc: 19.9
            // Sugar: (19.9 * 2.5 * 1000) / 1000 = 49.75 kg
            const result = calcChaptalization(1000, 78.9, 98.8, 'alcGl', 'alcGl');
            expect(result.sugar).toBeCloseTo(49.75, 2);
        });

        it('should return zeros for invalid input', () => {
            expect(calcChaptalization(1000, 12.5, 10.0).sugar).toBe(0);
            expect(calcChaptalization(0, 10, 12).sugar).toBe(0);
        });
    });

    describe('Acid Management', () => {
        it('should calculate Tartaric Acid addition', () => {
            // 1000L, 5g/L -> 6.5g/L (diff 1.5)
            // Coeff: 1.0
            // Result: 1000 * 1.5 * 1.0 = 1500g
            expect(calcAcidManagement(1000, 5, 6.5, 'tartaric')).toBe(1500);
        });

        it('should calculate Potassium Bicarbonate deacidification', () => {
            // 1000L, 7g/L -> 6g/L (diff 1.0)
            // Coeff: 0.9
            // Result: 1000 * 1.0 * 0.9 = 900g
            expect(calcAcidManagement(1000, 7, 6, 'potassium')).toBe(900);
        });

        it('should handle Malic Acid coefficient', () => {
            // Diff 1.0, Coeff 1.12
            expect(calcAcidManagement(1000, 5, 6, 'malic')).toBe(1120);
        });
    });
});
