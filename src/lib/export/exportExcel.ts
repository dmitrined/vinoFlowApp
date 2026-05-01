/**
 * НАЗНАЧЕНИЕ: Клиентский сервис для экспорта данных бочки в формат Excel (XLSX).
 * ЗАВИСИМОСТИ: exceljs, file-saver, типы бочки из стора.
 * ОСОБЕННОСТИ: Формирует файл из 3-х вкладок (Общая, Замеры, Препараты). Выполняется полностью на стороне клиента.
 */
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Barrel, Reading, Addition } from '@/types/fermentation';

export const exportBarrelToExcel = async (barrel: Barrel, t: (key: string) => string) => {
    // 1. Инициализация рабочей книги
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'VinoFlow App';
    workbook.lastModifiedBy = 'VinoFlow App';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Export');

    // Настройка ширины колонок (максимально до 6 колонок для препаратов)
    sheet.columns = [
        { key: 'col1', width: 20 },
        { key: 'col2', width: 20 },
        { key: 'col3', width: 20 },
        { key: 'col4', width: 20 },
    ];

    // --- Общая информация ---
    sheet.addRow({ col1: t('barrel'), col2: barrel.number });
    sheet.addRow({ col1: t('volume'), col2: barrel.volume ? `${barrel.volume} L` : '-' });
    sheet.addRow({ col1: t('status'), col2: barrel.status });
    sheet.addRow({ col1: t('notes'), col2: barrel.notes || '-' });
    
    // Стилизуем блок общей информации
    for (let i = 1; i <= 4; i++) {
        const row = sheet.getRow(i);
        row.getCell(1).font = { bold: true };
    }

    sheet.addRow({}); // Пустая строка

    // Общий стиль заголовков таблиц
    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6453E9' } } as ExcelJS.Fill,
        alignment: { vertical: 'middle', horizontal: 'center' } as ExcelJS.Alignment
    };

    // --- Таблица: Замеры ---
    const activeReadings = (barrel.readings || []).filter((r: Reading) => !r.isDeleted).sort((a: Reading, b: Reading) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (activeReadings.length > 0) {
        // Заголовок секции
        const rHeader = sheet.addRow({ col1: t('readings') });
        rHeader.getCell(1).font = { bold: true, size: 14 };
        sheet.mergeCells(`A${rHeader.number}:D${rHeader.number}`);

        // Заголовки столбцов
        const rCols = sheet.addRow({ col1: t('date'), col2: t('oechsle'), col3: t('temperature') });
        rCols.eachCell((cell, colNum) => {
            if (colNum <= 3) {
                cell.font = headerStyle.font;
                cell.fill = headerStyle.fill;
                cell.alignment = headerStyle.alignment;
            }
        });

        // Данные
        activeReadings.forEach((r: Reading) => {
            sheet.addRow({
                col1: r.date,
                col2: r.oechsle ?? '-',
                col3: r.temperature ?? '-'
            });
        });

        sheet.addRow({}); // Пустая строка
    }

    // --- Таблица: Препараты ---
    const activeAdditions = (barrel.additions || []).filter((a: Addition) => !a.isDeleted).sort((a: Addition, b: Addition) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (activeAdditions.length > 0) {
        // Заголовок секции
        const aHeader = sheet.addRow({ col1: t('additions') });
        aHeader.getCell(1).font = { bold: true, size: 14 };
        sheet.mergeCells(`A${aHeader.number}:D${aHeader.number}`);

        // Заголовки столбцов
        const aCols = sheet.addRow({ col1: t('date'), col2: t('name'), col3: t('dosage'), col4: t('unit') });
        aCols.eachCell((cell, colNum) => {
            if (colNum <= 4) {
                cell.font = headerStyle.font;
                cell.fill = headerStyle.fill;
                cell.alignment = headerStyle.alignment;
            }
        });

        // Данные
        activeAdditions.forEach((a: Addition) => {
            sheet.addRow({
                col1: a.date,
                col2: a.name,
                col3: a.dosage,
                col4: a.unit
            });
        });
    }

    // 2. Генерация и сохранение файла
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const safeName = barrel.number.replace(/[^a-zA-Z0-9-]/g, '_');
    saveAs(blob, `Barrel_${safeName}_Export.xlsx`);
};
