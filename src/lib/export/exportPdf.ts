/**
 * НАЗНАЧЕНИЕ: Клиентский сервис для экспорта данных бочки в формат PDF.
 * ЗАВИСИМОСТИ: jspdf, jspdf-autotable, типы бочки из стора.
 * ОСОБЕННОСТИ: Генерирует PDF-отчет с таблицами. Выполняется полностью на стороне клиента.
 * ВНИМАНИЕ: Стандартные шрифты jsPDF не поддерживают кириллицу. Для русского языка потребуется загрузка кастомного шрифта (например, Roboto.ttf) в VFS.
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Barrel, Reading, Addition } from '@/types/fermentation';
import { robotoBase64 } from './robotoFont';

export const exportBarrelToPdf = async (barrel: Barrel, t: (key: string) => string) => {
    // Инициализация документа
    const doc = new jsPDF();
    
    // Загрузка шрифта для поддержки кириллицы
    doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    
    // Заголовок документа
    doc.setFontSize(18);
    doc.text(`${t('barrel')}: ${barrel.number}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`${t('volume')}: ${barrel.volume ? `${barrel.volume} L` : '-'}`, 14, 30);
    doc.text(`${t('status')}: ${barrel.status}`, 14, 36);
    if (barrel.notes) {
        doc.text(`${t('notes')}: ${barrel.notes}`, 14, 42);
    }

    let startY = 50;

    // --- Таблица: Замеры ---
    const activeReadings = (barrel.readings || []).filter((r: Reading) => !r.isDeleted).sort((a: Reading, b: Reading) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (activeReadings.length > 0) {
        doc.setFontSize(14);
        doc.text(t('readings'), 14, startY);
        
        autoTable(doc, {
            startY: startY + 5,
            head: [[t('date'), t('oechsle'), t('temperature')]],
            body: activeReadings.map((r: Reading) => [
                r.date, 
                r.oechsle?.toString() ?? '-', 
                r.temperature?.toString() ?? '-'
            ]),
            theme: 'striped',
            headStyles: { fillColor: [100, 83, 233] }, // Цвет brand-600
            styles: { font: 'Roboto' }
        });
        
        // @ts-expect-error - autoTable adds finalY to doc
        startY = doc.lastAutoTable.finalY + 15;
    }

    // --- Таблица: Препараты ---
    const activeAdditions = (barrel.additions || []).filter((a: Addition) => !a.isDeleted).sort((a: Addition, b: Addition) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (activeAdditions.length > 0) {
        // Проверка, нужно ли перенести на новую страницу
        if (startY > 250) {
            doc.addPage();
            startY = 20;
        }

        doc.setFontSize(14);
        doc.text(t('additions'), 14, startY);

        autoTable(doc, {
            startY: startY + 5,
            head: [[t('date'), t('name'), t('dosage'), t('unit')]],
            body: activeAdditions.map((a: Addition) => [
                a.date,
                a.name,
                a.dosage,
                a.unit
            ]),
            theme: 'striped',
            headStyles: { fillColor: [100, 83, 233] },
            styles: { font: 'Roboto' }
        });
    }

    // Сохранение файла
    const safeName = barrel.number.replace(/[^a-zA-Z0-9-]/g, '_');
    doc.save(`Barrel_${safeName}_Export.pdf`);
};
