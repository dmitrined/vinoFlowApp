/**
 * НАЗНАЧЕНИЕ: Клиентский сервис для экспорта списка бочек (Дашборд) в формат PDF.
 * ЗАВИСИМОСТИ: jspdf, jspdf-autotable, типы бочки из стора.
 * ОСОБЕННОСТИ: Внедряет кириллический шрифт Roboto (через Base64) для корректного отображения. Формирует плоскую таблицу (1 строка = 1 бочка).
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Barrel } from '@/types/fermentation';
import { robotoBase64 } from './robotoFont';

export const exportAllBarrelsToPdf = (barrels: Barrel[], t: (key: string) => string) => {
    // 1. Инициализация PDF в альбомной ориентации (landscape), так как колонок много
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // 2. Внедрение кириллического шрифта
    doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    const brandColor: [number, number, number] = [100, 83, 233]; // #6453e9

    // Заголовок документа
    doc.setFontSize(18);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`${t('export_all')} - ${dateStr}`, 14, 20);

    // 3. Подготовка данных
    const tableColumns = [
        t('barrel'),
        t('volume'),
        t('status'),
        t('start_date'),
        t('current_oechsle'),
        t('current_temp'),
        t('additions_summary'),
        t('notes')
    ];

    const activeBarrels = barrels.filter(b => !b.isDeleted);
    
    const tableData = activeBarrels.map(barrel => {
        const activeReadings = (barrel.readings || []).filter(r => !r.isDeleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const activeAdditions = (barrel.additions || []).filter(a => !a.isDeleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const startDate = activeReadings.length > 0 ? activeReadings[0].date : '-';
        const lastReading = activeReadings.length > 0 ? activeReadings[activeReadings.length - 1] : null;
        const additionsSummary = activeAdditions.map(a => `${a.name} (${a.dosage}${a.unit})`).join(', ') || '-';

        return [
            barrel.number,
            barrel.volume ? `${barrel.volume} L` : '-',
            barrel.status,
            startDate,
            lastReading?.oechsle ?? '-',
            lastReading?.temperature ?? '-',
            additionsSummary,
            barrel.notes || '-'
        ];
    });

    // 4. Отрисовка таблицы
    autoTable(doc, {
        head: [tableColumns],
        body: tableData,
        startY: 30,
        styles: {
            font: 'Roboto', // Использование внедренного шрифта
            fontSize: 9,
            cellPadding: 4,
            lineColor: [220, 220, 220],
            lineWidth: 0.1,
            valign: 'middle' // Вертикальное выравнивание по центру
        },
        headStyles: {
            fillColor: brandColor,
            textColor: [255, 255, 255],
            fontStyle: 'normal',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [248, 248, 250] // Светло-серый фон для четных строк
        },
        columnStyles: {
            0: { fontStyle: 'bold' },
            6: { cellWidth: 50 }, // Расширяем колонку с добавками
            7: { cellWidth: 40 }  // И колонку с заметками
        }
    });

    // 5. Сохранение файла
    const fileNameDate = new Date().toISOString().split('T')[0];
    doc.save(`Cellar_Overview_${fileNameDate}.pdf`);
};
