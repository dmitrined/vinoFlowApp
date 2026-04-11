/**
 * НАЗНАЧЕНИЕ: Общие типы данных для энологических расчетов
 */
export type CalculationType = 'sr-rechner' | 'alkohol' | 'sr-verschnitt' | 'mehrfach' | 'so2-calc' | 'acid-management' | 'chaptalization';

export type ProductType = 'gas' | 'powder' | 'liquid';

export interface CalculationRecord {
    id: string;
    type: CalculationType;
    date: number;
    result: string;
    unit?: string;
}

export interface AutoSaveRecord {
    type: CalculationType;
    result: string;
    unit?: string;
}
