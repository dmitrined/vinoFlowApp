/**
 * НАЗНАЧЕНИЕ: Детальная страница бочки с журналом измерений и графиком
 * ЗАВИСИМОСТИ: useFermentationStore, FermentationChart, ReadingModal
 * ОСОБЕННОСТИ: Динамический роут, CRUD операций над записями
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
    Button, 
    Card, 
    CardHeader, 
    CardBody, 
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell,
    Chip,
    Breadcrumbs,
    BreadcrumbItem,
    Input,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/react";
import { 
    ArrowLeft, 
    Trash2, 
    Edit2, 
    Activity, 
    Info, 
    ChevronLeft
} from "lucide-react";
import { useFermentationStore } from '@/lib/store/useFermentationStore';
const FermentationChart = dynamic(
    () => import('@/components/fermentation/FermentationChart').then(mod => mod.FermentationChart),
    { ssr: false }
);
const ReadingModal = dynamic(
    () => import('@/components/fermentation/ReadingModal').then(mod => mod.ReadingModal),
    { ssr: false }
);
const AdditionModal = dynamic(
    () => import('@/components/fermentation/AdditionModal').then(mod => mod.AdditionModal),
    { ssr: false }
);
const ConfirmModal = dynamic(
    () => import('@/components/fermentation/ConfirmModal').then(mod => mod.ConfirmModal),
    { ssr: false }
);
import { AdditionsList } from '@/components/fermentation/AdditionsList';
import { Reading, Addition } from '@/types/fermentation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { formatDate } from '@/lib/dateUtils';

export default function BarrelDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const t = useTranslations('Fermentation');
    const { 
        barrels, 
        addReading, 
        updateReading, 
        deleteReading, 
        changeStatus, 
        updateBarrel,
        addAddition,
        updateAddition,
        deleteAddition
    } = useFermentationStore();
    const barrel = useMemo(() => {
        const b = barrels.find(b => b.id === id);
        if (!b || b.isDeleted) return null;
        
        const activeReadings = (b.readings || []).filter(r => !r.isDeleted);
        const activeAdditions = (b.additions || []).filter(a => !a.isDeleted);

        return {
            ...b,
            readings: activeReadings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            additions: activeAdditions
        };
    }, [barrels, id]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editNumber, setEditNumber] = useState('');
    const [editVolume, setEditVolume] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReading, setSelectedReading] = useState<Reading | null>(null);

    const [isAdditionModalOpen, setIsAdditionModalOpen] = useState(false);
    const [selectedAddition, setSelectedAddition] = useState<Addition | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [readingToDelete, setReadingToDelete] = useState<string | null>(null);

    const [mounted, setMounted] = useState(false);
    // Синхронизация теперь управляется централизованно через SyncEngine в layout.tsx
    // Убираем локальный вызов, чтобы не дублировать запросы
    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) return null;

    if (!barrel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="font-bold text-zinc-500 uppercase tracking-widest">{t('no-barrels')}</p>
                <Link href="/fermentation">
                    <Button variant="flat" startContent={<ArrowLeft size={18} />}>{t('back-to-list')}</Button>
                </Link>
            </div>
        );
    }

    const handleSaveReading = (oechsle: number, temp: number, date: string) => {
        if (selectedReading) {
            updateReading(barrel.id, selectedReading.id, { oechsle, temperature: temp, date });
        } else {
            addReading(barrel.id, oechsle, temp, date);
        }
        setSelectedReading(null);
    };

    const handleSaveAddition = (name: string, dosage: number, unit: string, date: string) => {
        if (selectedAddition) {
            updateAddition(barrel.id, selectedAddition.id, { name, dosage, unit, date });
        } else {
            addAddition(barrel.id, name, dosage, unit, date);
        }
        setSelectedAddition(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:py-8 space-y-8">
            {/* Breadcrumbs & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/fermentation">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            className="text-zinc-400 hover:text-brand-500"
                        >
                            <ChevronLeft size={24} />
                        </Button>
                    </Link>
                    <Breadcrumbs 
                        variant="light"
                        classNames={{
                            list: "bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 px-4 py-2 rounded-full"
                        }}
                    >
                        <BreadcrumbItem href="/fermentation">{t('title')}</BreadcrumbItem>
                        <BreadcrumbItem>
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                                setEditNumber(barrel.number);
                                setEditVolume(barrel.volume?.toString() || '');
                                setIsEditOpen(true);
                            }}>
                                <span className="font-black text-zinc-900 dark:text-white uppercase italic">
                                    {barrel.number}
                                    {barrel.volume ? ` (${barrel.volume} ${t('unit-liters')})` : ''}
                                </span>
                                <Edit2 size={14} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="flat"
                        color={barrel.status === 'active' ? 'primary' : barrel.status === 'finished' ? 'default' : 'success'}
                        onPress={() => {
                            const next = barrel.status === 'active' ? 'finished' : barrel.status === 'finished' ? 'archived' : 'active';
                            changeStatus(barrel.id, next);
                        }}
                        className="font-black uppercase tracking-widest text-[10px] h-11 flex-1 sm:flex-none"
                    >
                        {barrel.status === 'active' ? t('finish') : barrel.status === 'finished' ? t('archive') : t('activate')}
                    </Button>
                </div>
            </div>

            {/* Barrel Notes Section */}
            <Card className="bento-card border-none shadow-none bg-white dark:bg-zinc-900">
                <CardHeader className="px-6 pt-6 flex items-center gap-3">
                    <div className="p-1.5 bg-brand-500/10 text-brand-600 rounded-lg">
                        <Info size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('notes')}</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 pt-2">
                    <Textarea
                        variant="flat"
                        placeholder={t('notes-placeholder')}
                        value={barrel.notes || ''}
                        onValueChange={(val) => updateBarrel(barrel.id, { notes: val })}
                        classNames={{
                            input: "text-sm font-medium",
                            inputWrapper: "bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        }}
                        minRows={2}
                    />
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Chart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bento-card border-none shadow-none bg-white dark:bg-zinc-900 overflow-visible">
                        <CardHeader className="flex justify-between items-center px-6 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-500/10 text-brand-600 rounded-xl">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-xl font-black text-tech-gradient">{t('chart-title')}</h3>
                            </div>
                            {barrel.readings.length >= 20 && (
                                <Chip size="sm" color="warning" variant="flat" className="font-bold border-none">
                                    {t('limit-reached')}
                                </Chip>
                            )}
                        </CardHeader>
                        <CardBody className="p-2 sm:p-8">
                            {barrel.readings.length > 0 ? (
                                <FermentationChart data={barrel.readings} additions={barrel.additions || []} />
                            ) : (
                                <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] text-zinc-400 space-y-4">
                                    <Info size={40} className="opacity-20" />
                                    <p className="font-bold uppercase tracking-widest text-xs opacity-50">{t('no-chart-data')}</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Right: Info & Log Section */}
                <div className="space-y-6">

                    {/* History Log */}
                    <Card className="bento-card border-none shadow-none bg-white dark:bg-zinc-900 max-h-[500px] overflow-hidden">
                        <CardHeader className="px-6 pt-6 flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('history')}</h3>
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() => {
                                    setSelectedReading(null);
                                    setIsModalOpen(true);
                                }}
                                className="font-black uppercase tracking-widest text-[10px] px-4"
                            >
                                {t('add')}
                            </Button>
                        </CardHeader>
                        <CardBody className="p-0 overflow-y-auto px-2 sm:px-4 pb-4">
                            <Table 
                                aria-label="Reading history" 
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
                                    <TableColumn>{t('oechsle')}</TableColumn>
                                    <TableColumn>{t('temperature')}</TableColumn>
                                    <TableColumn align="end">{t('actions')}</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {barrel.readings.map((reading) => (
                                        <TableRow key={reading.id}>
                                            <TableCell className="text-[10px]">{formatDate(reading.date)}</TableCell>
                                            <TableCell className="text-brand-600 font-black">{reading.oechsle}°</TableCell>
                                            <TableCell className="text-orange-500 font-black">{reading.temperature}°</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button 
                                                        isIconOnly 
                                                        size="sm" 
                                                        variant="light" 
                                                        className="text-zinc-300 hover:text-brand-500"
                                                        onPress={() => {
                                                            setSelectedReading(reading);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <Edit2 size={12} />
                                                    </Button>
                                                    <Button 
                                                        isIconOnly 
                                                        size="sm" 
                                                        variant="light" 
                                                        className="text-zinc-300 hover:text-danger"
                                                        onPress={() => {
                                                            setReadingToDelete(reading.id);
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
                            {barrel.readings.length === 0 && (
                                <p className="text-center py-8 text-[10px] font-bold text-zinc-300 uppercase italic">{t('no-readings')}</p>
                            )}
                        </CardBody>
                    </Card>

                    {/* Ingredients List */}
                    <AdditionsList 
                        additions={barrel.additions || []} 
                        onDelete={(aid) => deleteAddition(barrel.id, aid)}
                        onEditClick={(item) => {
                            setSelectedAddition(item);
                            setIsAdditionModalOpen(true);
                        }}
                        onAddClick={() => {
                            setSelectedAddition(null);
                            setIsAdditionModalOpen(true);
                        }}
                    />
                </div>
            </div>

            <ReadingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveReading}
                initialData={selectedReading}
            />

            <AdditionModal 
                isOpen={isAdditionModalOpen}
                onClose={() => {
                    setIsAdditionModalOpen(false);
                    setSelectedAddition(null);
                }}
                onSave={handleSaveAddition}
                initialData={selectedAddition}
            />

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    if (readingToDelete) {
                        deleteReading(barrel.id, readingToDelete);
                        setReadingToDelete(null);
                    }
                }}
                title={t('actions')}
                message={t('delete-reading-confirm')}
            />

            {/* Edit Barrel Modal */}
            <Modal 
                isOpen={isEditOpen} 
                onOpenChange={setIsEditOpen}
                placement="center"
                backdrop="blur"
                size="sm"
                classNames={{
                    base: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 m-4",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h3 className="text-xl font-black text-tech-gradient uppercase italic">{t('edit-barrel')}</h3>
                            </ModalHeader>
                            <ModalBody className="py-6">
                                <Input
                                    autoFocus
                                    placeholder={t('barrel-placeholder')}
                                    variant="flat"
                                    labelPlacement="outside"
                                    value={editNumber}
                                    onValueChange={setEditNumber}
                                    className="font-bold"
                                />
                                <Input
                                    label={t('volume')}
                                    placeholder="225"
                                    variant="flat"
                                    labelPlacement="outside"
                                    type="number"
                                    value={editVolume}
                                    onValueChange={setEditVolume}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">{t('unit-liters')}</span>
                                        </div>
                                    }
                                    className="font-bold mt-4"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" className="font-bold uppercase tracking-widest text-xs" onPress={onClose}>
                                    {t('cancel')}
                                </Button>
                                <Button 
                                    color="primary" 
                                    className="font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20" 
                                    onPress={() => {
                                        if (editNumber.trim()) {
                                            updateBarrel(barrel.id, { 
                                                number: editNumber.trim(),
                                                volume: editVolume ? parseFloat(editVolume) : 0
                                            });
                                            onClose();
                                        }
                                    }}
                                    isDisabled={!editNumber.trim()}
                                >
                                    {t('save')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
