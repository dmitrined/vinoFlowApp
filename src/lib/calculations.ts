/**
 * НАЗНАЧЕНИЕ: Математические функции для расчетов (энология)
 * ОСОБЕННОСТИ: Экспортированные функции для чистого тестирования
 */

/**
 * Конвертация г/л в % об.
 * @param gl Концентрация в граммах на литр
 * @returns Процент объема
 */
export const convertGLToVol = (gl: number): number => {
    if (isNaN(gl) || gl < 0) return 0;
    return gl * 0.1267;
};

/**
 * Конвертация % об. в г/л
 * @param vol Процент объема
 * @returns Грамм на литр
 */
export const convertVolToGL = (vol: number): number => {
    if (isNaN(vol) || vol < 0) return 0;
    return vol / 0.1267;
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
    productType: 'gas' | 'powder' | 'liquid',
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
