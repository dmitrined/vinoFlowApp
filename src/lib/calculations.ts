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
