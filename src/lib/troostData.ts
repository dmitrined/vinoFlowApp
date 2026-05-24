/**
 * НАЗНАЧЕНИЕ: Оцифрованные данные таблицы Трооста (G. Troost, "Technologie des Weines")
 * ЗАВИСИМОСТИ: Нет
 * ОСОБЕННОСТИ: Диапазон 44°Oe - 124°Oe. Используется для высокоточных энологических расчетов.
 * ПОЛЯ: 
 * - oe: Градусы Эксле (°Oe)
 * - sugar: Сахар (г/л)
 * - totalAlc: Общий алкоголь (г/л) - Gesamtalkohol
 * - alcVol: Алкоголь (% Vol)
 */

export interface TroostRow {
  oe: number;
  sugar: number;
  totalAlc: number;
  alcVol: number;
}

export const TROOST_TABLE: TroostRow[] = [
  { oe: 44, sugar: 87, totalAlc: 40.5, alcVol: 5.13 },
  { oe: 45, sugar: 90, totalAlc: 41.8, alcVol: 5.29 },
  { oe: 46, sugar: 92, totalAlc: 43.0, alcVol: 5.45 },
  { oe: 47, sugar: 95, totalAlc: 44.3, alcVol: 5.61 },
  { oe: 48, sugar: 98, totalAlc: 45.5, alcVol: 5.76 },
  { oe: 49, sugar: 100, totalAlc: 46.8, alcVol: 5.92 },
  { oe: 50, sugar: 103, totalAlc: 48.0, alcVol: 6.08 },
  { oe: 51, sugar: 106, totalAlc: 49.2, alcVol: 6.24 },
  { oe: 52, sugar: 108, totalAlc: 50.5, alcVol: 6.39 },
  { oe: 53, sugar: 111, totalAlc: 51.7, alcVol: 6.55 },
  { oe: 54, sugar: 114, totalAlc: 52.9, alcVol: 6.70 },
  { oe: 55, sugar: 116, totalAlc: 54.1, alcVol: 6.86 },
  { oe: 56, sugar: 119, totalAlc: 55.2, alcVol: 7.02 },
  { oe: 57, sugar: 122, totalAlc: 56.6, alcVol: 7.17 },
  { oe: 58, sugar: 124, totalAlc: 57.9, alcVol: 7.33 },
  { oe: 59, sugar: 127, totalAlc: 59.1, alcVol: 7.49 },
  { oe: 60, sugar: 130, totalAlc: 60.4, alcVol: 7.65 },
  { oe: 61, sugar: 132, totalAlc: 61.6, alcVol: 7.81 },
  { oe: 62, sugar: 135, totalAlc: 62.9, alcVol: 7.96 },
  { oe: 63, sugar: 138, totalAlc: 64.1, alcVol: 8.12 },
  { oe: 64, sugar: 140, totalAlc: 65.3, alcVol: 8.27 },
  { oe: 65, sugar: 143, totalAlc: 66.5, alcVol: 8.43 },
  { oe: 66, sugar: 146, totalAlc: 67.8, alcVol: 8.59 },
  { oe: 67, sugar: 148, totalAlc: 69.0, alcVol: 8.74 },
  { oe: 68, sugar: 151, totalAlc: 70.2, alcVol: 8.90 },
  { oe: 69, sugar: 154, totalAlc: 71.5, alcVol: 9.06 },
  { oe: 70, sugar: 156, totalAlc: 72.8, alcVol: 9.22 },
  { oe: 71, sugar: 159, totalAlc: 74.0, alcVol: 9.37 },
  { oe: 72, sugar: 162, totalAlc: 75.2, alcVol: 9.53 },
  { oe: 73, sugar: 164, totalAlc: 76.5, alcVol: 9.69 },
  { oe: 74, sugar: 167, totalAlc: 77.7, alcVol: 9.84 },
  { oe: 75, sugar: 170, totalAlc: 78.9, alcVol: 10.00 },
  { oe: 76, sugar: 172, totalAlc: 80.2, alcVol: 10.16 },
  { oe: 77, sugar: 175, totalAlc: 81.4, alcVol: 10.31 },
  { oe: 78, sugar: 178, totalAlc: 82.6, alcVol: 10.47 },
  { oe: 79, sugar: 180, totalAlc: 83.9, alcVol: 10.63 },
  { oe: 80, sugar: 183, totalAlc: 85.1, alcVol: 10.79 },
  { oe: 81, sugar: 186, totalAlc: 86.4, alcVol: 10.94 },
  { oe: 82, sugar: 188, totalAlc: 87.6, alcVol: 11.10 },
  { oe: 83, sugar: 191, totalAlc: 88.9, alcVol: 11.26 },
  { oe: 84, sugar: 193, totalAlc: 90.1, alcVol: 11.41 },
  { oe: 85, sugar: 196, totalAlc: 91.3, alcVol: 11.57 },
  { oe: 86, sugar: 199, totalAlc: 92.6, alcVol: 11.73 },
  { oe: 87, sugar: 201, totalAlc: 93.8, alcVol: 11.88 },
  { oe: 88, sugar: 204, totalAlc: 95.1, alcVol: 12.04 },
  { oe: 89, sugar: 207, totalAlc: 96.3, alcVol: 12.20 },
  { oe: 90, sugar: 209, totalAlc: 97.5, alcVol: 12.35 },
  { oe: 91, sugar: 212, totalAlc: 98.8, alcVol: 12.51 },
  { oe: 92, sugar: 215, totalAlc: 100.0, alcVol: 12.67 },
  { oe: 93, sugar: 217, totalAlc: 101.3, alcVol: 12.83 },
  { oe: 94, sugar: 220, totalAlc: 102.5, alcVol: 12.98 },
  { oe: 95, sugar: 223, totalAlc: 103.7, alcVol: 13.14 },
  { oe: 96, sugar: 225, totalAlc: 105.0, alcVol: 13.30 },
  { oe: 97, sugar: 228, totalAlc: 106.2, alcVol: 13.45 },
  { oe: 98, sugar: 231, totalAlc: 107.5, alcVol: 13.61 },
  { oe: 99, sugar: 233, totalAlc: 108.7, alcVol: 13.76 },
  { oe: 100, sugar: 236, totalAlc: 110.0, alcVol: 13.92 },
  { oe: 101, sugar: 239, totalAlc: 111.2, alcVol: 14.08 },
  { oe: 102, sugar: 241, totalAlc: 112.4, alcVol: 14.24 },
  { oe: 103, sugar: 244, totalAlc: 113.7, alcVol: 14.40 },
  { oe: 104, sugar: 247, totalAlc: 114.9, alcVol: 14.55 },
  { oe: 105, sugar: 249, totalAlc: 116.1, alcVol: 14.71 },
  { oe: 106, sugar: 252, totalAlc: 117.4, alcVol: 14.87 },
  { oe: 107, sugar: 255, totalAlc: 118.6, alcVol: 15.02 },
  { oe: 108, sugar: 257, totalAlc: 119.9, alcVol: 15.18 },
  { oe: 109, sugar: 260, totalAlc: 121.1, alcVol: 15.33 },
  { oe: 110, sugar: 263, totalAlc: 122.3, alcVol: 15.49 },
  { oe: 111, sugar: 265, totalAlc: 123.6, alcVol: 15.65 },
  { oe: 112, sugar: 268, totalAlc: 124.8, alcVol: 15.81 },
  { oe: 113, sugar: 271, totalAlc: 126.0, alcVol: 15.97 },
  { oe: 114, sugar: 273, totalAlc: 127.2, alcVol: 16.12 },
  { oe: 115, sugar: 276, totalAlc: 128.5, alcVol: 16.28 },
  { oe: 116, sugar: 279, totalAlc: 129.9, alcVol: 16.44 },
  { oe: 117, sugar: 281, totalAlc: 131.0, alcVol: 16.59 },
  { oe: 118, sugar: 284, totalAlc: 132.2, alcVol: 16.75 },
  { oe: 119, sugar: 287, totalAlc: 133.4, alcVol: 16.90 },
  { oe: 120, sugar: 289, totalAlc: 134.7, alcVol: 17.06 },
  { oe: 121, sugar: 292, totalAlc: 136.0, alcVol: 17.22 },
  { oe: 122, sugar: 295, totalAlc: 137.6, alcVol: 17.37 },
  { oe: 123, sugar: 297, totalAlc: 138.4, alcVol: 17.53 },
  { oe: 124, sugar: 300, totalAlc: 139.7, alcVol: 17.68 },
];
