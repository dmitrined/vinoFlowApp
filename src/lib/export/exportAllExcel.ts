/**
 * НАЗНАЧЕНИЕ: Клиентский сервис для экспорта списка бочек (Дашборд) в формат Excel (XLSX).
 * ЗАВИСИМОСТИ: exceljs, file-saver, типы бочки из стора.
 * ОСОБЕННОСТИ: Формирует файл в один лист по правилу "1 строка = 1 бочка".
 */
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Barrel } from '@/types/fermentation';

export const exportAllBarrelsToExcel = async (barrels: Barrel[], t: (key: string) => string) => {
    // 1. Инициализация рабочей книги
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'VinoFlow App';
    workbook.lastModifiedBy = 'VinoFlow App';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(t('export_all'));

    // Настройка колонок
    sheet.columns = [
        { header: t('barrel'), key: 'barrel', width: 20 },
        { header: t('volume'), key: 'volume', width: 15 },
        { header: t('status'), key: 'status', width: 15 },
        { header: t('start_date'), key: 'startDate', width: 15 },
        { header: t('current_oechsle'), key: 'currentOechsle', width: 20 },
        { header: t('current_temp'), key: 'currentTemp', width: 15 },
        { header: t('additions_summary'), key: 'additions', width: 40 },
        { header: t('notes'), key: 'notes', width: 30 }
    ];

    // Общий стиль заголовков таблиц
    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6453E9' } } as ExcelJS.Fill,
        alignment: { vertical: 'middle', horizontal: 'center' } as ExcelJS.Alignment
    };

    // Стилизация заголовков
    sheet.getRow(1).eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
    });

    // 2. Обработка данных бочек
    const activeBarrels = barrels.filter(b => !b.isDeleted);
    
    activeBarrels.forEach(barrel => {
        const activeReadings = (barrel.readings || []).filter(r => !r.isDeleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const activeAdditions = (barrel.additions || []).filter(a => !a.isDeleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const startDate = activeReadings.length > 0 ? activeReadings[0].date : '-';
        const lastReading = activeReadings.length > 0 ? activeReadings[activeReadings.length - 1] : null;
        
        const additionsSummary = activeAdditions.map(a => `${a.name} (${a.dosage}${a.unit})`).join(', ') || '-';

        sheet.addRow({
            barrel: barrel.number,
            volume: barrel.volume ? `${barrel.volume} L` : '-',
            status: barrel.status,
            startDate: startDate,
            currentOechsle: lastReading?.oechsle ?? '-',
            currentTemp: lastReading?.temperature ?? '-',
            additions: additionsSummary,
            notes: barrel.notes || '-'
        });
    });

    // Включаем перенос текста для длинных строк (Препараты, Заметки)
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.getCell('additions').alignment = { wrapText: true, vertical: 'top' };
            row.getCell('notes').alignment = { wrapText: true, vertical: 'top' };
        }
    });

    // 3. Генерация и сохранение файла
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const dateStr = new Date().toISOString().split('T')[0];
    saveAs(blob, `Cellar_Overview_${dateStr}.xlsx`);
};
