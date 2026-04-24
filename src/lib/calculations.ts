import { ProductType } from '@/types/calculations';
import { TROOST_TABLE, TroostRow } from './troostData';

/**
 * НАЗНАЧЕНИЕ: Энологические расчеты на основе таблицы Трооста
 * ЗАВИСИМОСТИ: @/lib/troostData
 * ОСОБЕННОСТИ: Линейная интерполяция для дробных значений Oechsle
 */

export const WINE_CONSTANTS = {
    ALCOHOL_CONVERSION_FACTOR: 0.1267,
    SO2_DEFAULTS: {
        gas: 100,
        powder: 50,
        liquid: 150
    },
    CHAPTALIZATION: {
        SUGAR_PER_ABV: 16.83,
        SUGAR_PER_OECHSLE: 2.5,
        VOL_INCREASE_PER_KG: 0.63
    },
    ACID_MANAGEMENT: {
        COEFFICIENTS: {
            // Acidification
            tartaric: 1.0,
            malic: 1.12,
            lactic: 1.5,
            citric: 0.85,
            // Deacidification
            potassium: 0.9,
            calcium: 0.67
        }
    }
} as const;

export type EnologicalUnit = 'oe' | 'alcVol' | 'alcGl' | 'sugar';

/**
 * Интерполяция значений из таблицы Трооста
 * @param value Значение
 * @param fromUnit Единица измерения значения
 */
export const getTroostData = (value: number, fromUnit: EnologicalUnit): TroostRow & { alcGl: number } => {
    if (isNaN(value) || value < 0) return { oe: 0, sugar: 0, totalAlc: 0, alcVol: 0, alcGl: 0 };

    const minOe = TROOST_TABLE[0].oe;
    const maxOe = TROOST_TABLE[TROOST_TABLE.length - 1].oe;

    let targetOe: number;

    if (fromUnit === 'oe') {
        targetOe = value;
    } else {
        // РЕВЕРСИВНАЯ ИНТЕРПОЛЯЦИЯ: Находим дробное Oechsle на основе входного значения
        const searchUnit = (fromUnit === 'alcGl' ? 'totalAlc' : fromUnit) as keyof TroostRow;
        
        // Находим интервал в таблице
        let index = -1;
        for (let i = 0; i < TROOST_TABLE.length - 1; i++) {
            const v1 = TROOST_TABLE[i][searchUnit] as number;
            const v2 = TROOST_TABLE[i+1][searchUnit] as number;
            
            // Проверяем, попадает ли значение в интервал [v1, v2]
            if ((value >= v1 && value <= v2) || (value <= v1 && value >= v2)) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            // Вне диапазона - берем ближайший край
            if (value <= (TROOST_TABLE[0][searchUnit] as number)) targetOe = minOe;
            else targetOe = maxOe;
        } else {
            const r1 = TROOST_TABLE[index];
            const r2 = TROOST_TABLE[index + 1];
            const v1 = r1[searchUnit] as number;
            const v2 = r2[searchUnit] as number;
            
            // Фактор интерполяции внутри интервала значений
            const t = v1 === v2 ? 0 : (value - v1) / (v2 - v1);
            // Линейно находим Oechsle между r1.oe и r2.oe
            targetOe = r1.oe + t * (r2.oe - r1.oe);
        }
    }

    const clampedOe = Math.max(minOe, Math.min(maxOe, targetOe));
    
    // ПРЯМАЯ ИНТЕРПОЛЯЦИЯ всех выходных параметров на основе найденного Oechsle
    const findIndex = TROOST_TABLE.findIndex(r => r.oe >= clampedOe);
    if (findIndex === 0) {
        const row = TROOST_TABLE[0];
        return { ...row, alcGl: row.totalAlc };
    }
    if (findIndex === -1) {
        const row = TROOST_TABLE[TROOST_TABLE.length - 1];
        return { ...row, alcGl: row.totalAlc };
    }

    const r1 = TROOST_TABLE[findIndex - 1];
    const r2 = TROOST_TABLE[findIndex];

    if (r1.oe === clampedOe) return { ...r1, alcGl: r1.totalAlc };
    if (r2.oe === clampedOe) return { ...r2, alcGl: r2.totalAlc };

    const t = (clampedOe - r1.oe) / (r2.oe - r1.oe);
    const interpolatedTotalAlc = r1.totalAlc + t * (r2.totalAlc - r1.totalAlc);

    return {
        oe: clampedOe,
        sugar: r1.sugar + t * (r2.sugar - r1.sugar),
        totalAlc: interpolatedTotalAlc,
        alcVol: r1.alcVol + t * (r2.alcVol - r1.alcVol),
        alcGl: interpolatedTotalAlc
    };
};

/**
 * Конвертация г/л в % об.
 * @param gl Концентрация в граммах на литр
 * @returns Процент объема
 */
export const convertGLToVol = (gl: number): number => {
    if (isNaN(gl) || gl < 0) return 0;
    return gl * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
};

/**
 * Конвертация % об. в г/л
 * @param vol Процент объема
 * @returns Грамм на литр
 */
export const convertVolToGL = (vol: number): number => {
    if (isNaN(vol) || vol < 0) return 0;
    return vol / WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
};

/**
 * Расчет Süßreserve (Auf) - добавление к объему базового вина
 * @param percent Желаемый процент SR
 * @param liters Объём базового вина
 */
export const calcSR_Auf = (percent: number, liters: number): number => {
    if (isNaN(percent) || isNaN(liters) || percent < 0 || liters < 0 || percent >= 100) return 0;
    return (percent / 100) * liters;
};

/**
 * Расчет Süßreserve (In) - доля в итоговом объеме
 * @param percent Желаемый процент SR
 * @param liters Объём базового вина
 */
export const calcSR_In = (percent: number, liters: number): number => {
    if (isNaN(percent) || isNaN(liters) || percent < 0 || liters < 0 || percent >= 100) return 0;
    return (percent / (100 - percent)) * liters;
};

/**
 * Расчет добавления Süßreserve по сахару (правило смешивания)
 * @param sSugar Сахар в SR (г/л)
 * @param wSugar Сахар в вине (г/л)
 * @param wLiters Объем вина (л)
 * @param zSugar Целевой сахар (г/л)
 */
export const calcSRVerschnitt = (sSugar: number, wSugar: number, wLiters: number, zSugar: number): number => {
    if (isNaN(sSugar) || isNaN(wSugar) || isNaN(wLiters) || isNaN(zSugar)) return 0;

    const denominator = sSugar - zSugar;
    if (Math.abs(denominator) < 1e-6) return 0;

    const result = (wLiters * (zSugar - wSugar)) / denominator;
    return result > 0 ? result : 0;
};

/**
 * Расчет ассамбляжа (средневзвешенное)
 * @param entries Массив данных { liter, parameter }
 */
export const calcMultiBlended = (entries: { liter: number, parameter: number }[]): number => {
    let totalMass = 0;
    let totalVolume = 0;

    entries.forEach(e => {
        if (e.liter > 0) {
            totalVolume += e.liter;
            totalMass += e.liter * e.parameter;
        }
    });

    return totalVolume > 0 ? totalMass / totalVolume : 0;
};

/**
 * Расчет добавки SO2
 * @param volume Объем вина (л)
 * @param deltaSO2 Желаемое повышение SO2 (мг/л)
 * @param productType Тип продукта ('gas', 'powder', 'liquid')
 * @param concentration Концентрация (для 'liquid' в г/л, для 'powder' обычно 50, для 'gas' 100)
 * @returns Количество продукта (г или мл)
 * Формула: M(g) = (V(l) * ΔSO2(mg/l)) / (1000 * (Концентрация / 100)) для порошка/газа
 * Формула: V(ml) = (V(l) * ΔSO2(mg/l)) / Концентрация(g/l) для жидкости
 */
export const calcSO2Addition = (
    volume: number,
    deltaSO2: number,
    productType: ProductType,
    concentration: number
): number => {
    if (isNaN(volume) || isNaN(deltaSO2) || isNaN(concentration) || volume <= 0 || deltaSO2 <= 0 || concentration <= 0) {
        return 0;
    }

    if (productType === 'liquid') {
        // concentration в г/л (например 150 г/л)
        // M(mg) = V(l) * ΔSO2(mg/l)
        // V(ml) = M(mg) / concentration(mg/ml)
        // concentration(mg/ml) = concentration(g/l)
        return (volume * deltaSO2) / concentration;
    }

    // concentration в % (например 50 для порошка, 100 для газа)
    // M(mg) = V(l) * ΔSO2(mg/l)
    // M(g) = M(mg) / 1000
    // M_product(g) = M(g) / (concentration / 100)
    return (volume * deltaSO2) / (10 * concentration);
};

/**
 * Расчет шаптализации на основе таблицы Трооста
 * @param volume Объем вина (л)
 * @param currentVal Текущий показатель
 * @param targetVal Целевой показатель
 * @param currentUnit Единица измерения текущего показателя
 * @param targetUnit Единица измерения целевого показателя
 */
export const calcChaptalization = (
    volume: number,
    currentVal: number,
    targetVal: number,
    currentUnit: EnologicalUnit = 'alcVol',
    targetUnit: EnologicalUnit = 'alcVol'
) => {
    if (isNaN(volume) || isNaN(currentVal) || isNaN(targetVal) || volume <= 0 || currentVal < 0) {
        return { sugar: 0, deltaVol: 0, total: volume, deltaOe: 0, deltaAlcVol: 0, deltaAlcGl: 0, deltaSugar: 0 };
    }

    const currentData = getTroostData(currentVal, currentUnit);
    const targetData = getTroostData(targetVal, targetUnit);

    // Если целевой алкоголь ниже текущего, расчет не требуется
    if (targetData.totalAlc <= currentData.totalAlc) {
        return { sugar: 0, deltaVol: 0, total: volume, deltaOe: 0, deltaAlcVol: 0, deltaAlcGl: 0, deltaSugar: 0, currentData, targetData };
    }

    // ЛОГИКА ПОЛЬЗОВАТЕЛЯ: Используем разницу сахара напрямую из таблицы Трооста
    const deltaSugar = targetData.sugar - currentData.sugar;
    const sugarNeededKg = (deltaSugar * volume) / 1000;

    const volumeIncrease = sugarNeededKg * WINE_CONSTANTS.CHAPTALIZATION.VOL_INCREASE_PER_KG;
    const totalVolume = volume + volumeIncrease;

    const deltaOe = targetData.oe - currentData.oe;
    const deltaAlcVol = targetData.alcVol - currentData.alcVol;
    const deltaAlcGl = targetData.totalAlc - currentData.totalAlc;

    return { 
        sugar: sugarNeededKg, 
        deltaVol: volumeIncrease, 
        total: totalVolume,
        // Данные для отображения в UI (по Троосту)
        currentData,
        targetData,
        // Разница по всем 4 параметрам
        deltaOe,
        deltaAlcVol,
        deltaAlcGl,
        deltaSugar
    };
};

/**
 * Расчет добавки для управления кислотностью
 * @param volume Объем вина (л)
 * @param currentTa Текущая кислотность (г/л)
 * @param targetTa Целевая кислотность (г/л)
 * @param agent Агент (кислота или основание)
 */
export const calcAcidManagement = (
    volume: number,
    currentTa: number,
    targetTa: number,
    agent: keyof typeof WINE_CONSTANTS.ACID_MANAGEMENT.COEFFICIENTS
): number => {
    if (isNaN(volume) || isNaN(currentTa) || isNaN(targetTa) || volume <= 0 || currentTa < 0 || targetTa < 0) {
        return 0;
    }

    const coeff = WINE_CONSTANTS.ACID_MANAGEMENT.COEFFICIENTS[agent] || 1.0;
    const diff = Math.abs(targetTa - currentTa);
    
    return volume * diff * coeff;
};
