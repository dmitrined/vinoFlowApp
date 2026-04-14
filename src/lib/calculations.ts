import { ProductType } from '@/types/calculations';

/**
 * ОСОБЕННОСТИ: Экспортированные функции для чистого тестирования
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
 * Расчет шаптализации
 * @param volume Объем вина (л)
 * @param currentAbv Текущий показатель
 * @param targetAbv Целевой показатель
 * @param currentUnit Единица измерения текущего показателя ('percent' | 'gl' | 'gl-sugar' | 'oechsle')
 * @param targetUnit Единица измерения целевого показателя ('percent' | 'gl' | 'gl-sugar' | 'oechsle')
 */
export const calcChaptalization = (
    volume: number,
    currentAbv: number,
    targetAbv: number,
    currentUnit: 'percent' | 'gl' | 'gl-sugar' | 'oechsle' = 'percent',
    targetUnit: 'percent' | 'gl' | 'gl-sugar' | 'oechsle' = 'percent'
) => {
    if (isNaN(volume) || isNaN(currentAbv) || isNaN(targetAbv) || volume <= 0 || currentAbv < 0) {
        return { sugar: 0, deltaVol: 0, total: volume };
    }

    // Приводим оба значения к % Vol для сравнения и базового расчета
    let currentVol = currentAbv;
    if (currentUnit === 'gl') {
        currentVol = currentAbv * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
    } else if (currentUnit === 'oechsle') {
        currentVol = (currentAbv * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE) / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
    } else if (currentUnit === 'gl-sugar') {
        currentVol = currentAbv / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
    }

    let targetVol = targetAbv;
    if (targetUnit === 'gl') {
        targetVol = targetAbv * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
    } else if (targetUnit === 'oechsle') {
        targetVol = (targetAbv * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE) / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
    } else if (targetUnit === 'gl-sugar') {
        targetVol = targetAbv / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
    }

    if (targetVol <= currentVol) {
        return { sugar: 0, deltaVol: 0, total: volume };
    }

    let sugarNeeded = 0;

    // Если оба параметра в Эксле или сахаре, считаем напрямую без погрешностей двойной конверсии
    if (currentUnit === 'oechsle' && targetUnit === 'oechsle') {
        const diffOe = targetAbv - currentAbv;
        sugarNeeded = (diffOe * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE * volume) / 1000;
    } else if (currentUnit === 'gl-sugar' && targetUnit === 'gl-sugar') {
        const diffGl = targetAbv - currentAbv;
        sugarNeeded = (diffGl * volume) / 1000;
    } else {
        const diffAbv = targetVol - currentVol;
        sugarNeeded = (diffAbv * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV * volume) / 1000;
    }

    const volumeIncrease = sugarNeeded * WINE_CONSTANTS.CHAPTALIZATION.VOL_INCREASE_PER_KG;
    const totalVolume = volume + volumeIncrease;

    return { sugar: sugarNeeded, deltaVol: volumeIncrease, total: totalVolume };
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
