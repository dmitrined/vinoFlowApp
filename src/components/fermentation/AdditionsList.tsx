/**
 * НАЗНАЧЕНИЕ: Список добавленных ингредиентов/добавок в стиле Bento
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, fermentation.ts
 * ОСОБЕННОСТИ: Удаление записей, локализованный вывод
 */

'use client';

import React from 'react';
import { 
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell, 
    Button,
    Card,
    CardHeader,
    CardBody
} from "@heroui/react";
import { Trash2, Beaker, Edit2 } from "lucide-react";
import { Addition } from '@/types/fermentation';
import { ConfirmModal } from '@/components/fermentation/ConfirmModal';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/dateUtils';

interface Props {
    additions: Addition[];
    onDelete: (id: string) => void;
    onEditClick: (item: Addition) => void;
    onAddClick: () => void;
}

export const AdditionsList: React.FC<Props> = ({ additions, onDelete, onEditClick, onAddClick }) => {
    const t = useTranslations('Fermentation');

    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [additionToDelete, setAdditionToDelete] = React.useState<string | null>(null);

    // Сортировка по дате (сначала новые)
    const sortedAdditions = [...additions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card className="bento-card border-none shadow-none bg-white dark:bg-zinc-900 max-h-[400px] overflow-hidden">
            <CardHeader className="px-6 pt-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500/10 text-brand-600 rounded-xl">
                        <Beaker size={20} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('ingredients')}</h3>
                </div>
                <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="font-black uppercase tracking-widest text-[9px] h-8"
                    onPress={onAddClick}
                >
                    {t('add')}
                </Button>
            </CardHeader>
            <CardBody className="p-0 overflow-y-auto px-2 sm:px-4 pb-4">
                <Table 
                    aria-label="Additions list" 
                    shadow="none" 
                    radius="none" 
                    removeWrapper 
                    color="primary"
                    classNames={{
                        th: "bg-transparent text-zinc-400 font-black text-[9px] border-b border-zinc-100 dark:border-zinc-800",
                        td: "font-bold text-xs py-3 border-b border-zinc-50 dark:border-zinc-800/50"
                    }}
                >
                    <TableHeader>
                        <TableColumn>{t('date')}</TableColumn>
                        <TableColumn>{t('ingredient')}</TableColumn>
                        <TableColumn>{t('dosage')}</TableColumn>
                        <TableColumn align="end">{t('actions')}</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {sortedAdditions.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-[10px]">{formatDate(item.date)}</TableCell>
                                <TableCell className="text-brand-600 uppercase italic text-[10px]">{item.name}</TableCell>
                                <TableCell className="font-mono text-[10px]">{item.dosage} {item.unit}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button 
                                            isIconOnly 
                                            size="sm" 
                                            variant="light" 
                                            className="text-zinc-300 hover:text-brand-500"
                                            onPress={() => onEditClick(item)}
                                        >
                                            <Edit2 size={12} />
                                        </Button>
                                        <Button 
                                            isIconOnly 
                                            size="sm" 
                                            variant="light" 
                                            className="text-zinc-300 hover:text-danger"
                                            onPress={() => {
                                                setAdditionToDelete(item.id);
                                                setIsConfirmOpen(true);
                                            }}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {additions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-30">
                         <Beaker size={32} className="mb-2" />
                         <p className="text-[10px] font-bold text-zinc-300 uppercase italic">{t('no-ingredients')}</p>
                    </div>
                )}
            </CardBody>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    if (additionToDelete) {
                        onDelete(additionToDelete);
                        setAdditionToDelete(null);
                    }
                }}
                title={t('actions')}
                message={t('delete-addition-confirm')}
            />
        </Card>
    );
};
