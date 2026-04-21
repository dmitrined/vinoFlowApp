/**
 * НАЗНАЧЕНИЕ: Дашборд модуля мониторинга брожения
 * ЗАВИСИМОСТИ: useFermentationStore, BarrelCard, @heroui/react
 * ОСОБЕННОСТИ: Bento-сетка бочек, модальное окно добавления
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tabs, Tab, Pagination } from "@heroui/react";
import { Plus, Wine, Search } from "lucide-react";
import { useFermentationStore } from '@/lib/store/useFermentationStore';
import { BarrelCard } from '@/components/fermentation/BarrelCard';
import { ConfirmModal } from '@/components/fermentation/ConfirmModal';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from "framer-motion";

export default function FermentationDashboard() {
    const t = useTranslations('Fermentation');
    const { barrels, addBarrel, deleteBarrel, changeStatus } = useFermentationStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newBarrelNumber, setNewBarrelNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'active' | 'finished' | 'archived'>('active');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchQuery]);

    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [barrelToDelete, setBarrelToDelete] = useState<string | null>(null);

    const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
    const [barrelToToggle, setBarrelToToggle] = useState<{id: string, status: string} | null>(null);

    const handleAddBarrel = (onClose: () => void) => {
        if (newBarrelNumber.trim()) {
            addBarrel(newBarrelNumber.trim());
            setNewBarrelNumber('');
            onClose();
        }
    };

    const activeCount = React.useMemo(() => barrels.filter(b => !b.isDeleted && b.status === 'active').length, [barrels]);
    const finishedCount = React.useMemo(() => barrels.filter(b => !b.isDeleted && b.status === 'finished').length, [barrels]);
    const archivedCount = React.useMemo(() => barrels.filter(b => !b.isDeleted && b.status === 'archived').length, [barrels]);

    const filteredBarrels = barrels.filter(b => 
        !b.isDeleted && 
        b.status === statusFilter &&
        b.number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBarrels.length / rowsPerPage);
    const paginatedBarrels = React.useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredBarrels.slice(start, start + rowsPerPage);
    }, [filteredBarrels, currentPage]);

    return (
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:py-12 space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
                            <Wine size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-tech-gradient uppercase italic">
                            {t('title')}
                        </h1>
                    </div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs opacity-60 pl-1">
                        {t('subtitle')}
                    </p>
                </div>

                <Button 
                    onPress={onOpen}
                    color="primary" 
                    size="lg" 
                    radius="full"
                    startContent={<Plus size={20} />}
                    className="w-full md:w-auto font-black uppercase tracking-widest text-xs px-8 shadow-2xl shadow-brand-500/30 active:scale-95 transition-all h-14 md:h-12"
                >
                    {t('add-barrel')}
                </Button>
            </div>

            {/* Sub-Header: Search & Filter */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                <Tabs 
                    aria-label="Barrel Status Filter"
                    selectedKey={statusFilter}
                    onSelectionChange={(key) => setStatusFilter(key as 'active' | 'finished')}
                    variant="underlined"
                    classNames={{
                        base: "w-full md:w-auto",
                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-brand-500",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-brand-600 font-black uppercase tracking-widest text-[10px]"
                    }}
                >
                    <Tab key="active" title={`${t('status-active')} (${activeCount})`} />
                    <Tab key="finished" title={`${t('status-finished')} (${finishedCount})`} />
                    <Tab key="archived" title={`${t('tab-archived')} (${archivedCount})`} />
                </Tabs>

                <div className="flex flex-1 w-full gap-4">
                    <Input
                        isClearable
                        fullWidth
                        placeholder={t('barrel-placeholder')}
                        startContent={<Search size={18} className="text-zinc-400" />}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        variant="flat"
                        classNames={{
                            inputWrapper: "bg-white dark:bg-zinc-800 shadow-sm border-zinc-100 dark:border-zinc-700 h-12 rounded-2xl"
                        }}
                    />
                </div>
            </div>

            {/* Barrels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {paginatedBarrels.length > 0 ? (
                        paginatedBarrels.map((barrel) => (
                            <BarrelCard 
                                key={barrel.id} 
                                barrel={barrel} 
                                onDelete={(id) => {
                                    setBarrelToDelete(id);
                                    setIsConfirmOpen(true);
                                }}
                                onToggleStatus={(id, status) => {
                                    setBarrelToToggle({id, status});
                                    setIsStatusConfirmOpen(true);
                                }}
                            />
                        ))
                    ) : (
                        <m.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-400 space-y-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center opacity-50">
                                <Wine size={40} />
                            </div>
                            <p className="font-bold uppercase tracking-widest text-xs">
                                {t('no-barrels')}
                            </p>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-8">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={currentPage}
                        total={totalPages}
                        onChange={setCurrentPage}
                        classNames={{
                            cursor: "bg-brand-600 text-white font-black",
                            item: "font-bold text-xs opacity-70 hover:opacity-100",
                        }}
                        radius="full"
                    />
                </div>
            )}

            {/* Add Barrel Modal */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="center"
                scrollBehavior="inside"
                size="sm"
                backdrop="blur"
                classNames={{
                    base: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 m-4",
                    header: "border-b border-zinc-100 dark:border-zinc-800",
                    footer: "border-t border-zinc-100 dark:border-zinc-800"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-xl font-black text-tech-gradient uppercase italic">
                                    {t('add-barrel')}
                                </h2>
                            </ModalHeader>
                            <ModalBody className="py-8">
                                <Input
                                    autoFocus
                                    placeholder={t('barrel-placeholder')}
                                    variant="flat"
                                    labelPlacement="outside"
                                    value={newBarrelNumber}
                                    onValueChange={setNewBarrelNumber}
                                    className="font-bold"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" className="font-bold uppercase tracking-widest text-xs" onPress={onClose}>
                                    {t('cancel')}
                                </Button>
                                <Button color="primary" className="font-black uppercase tracking-widest text-xs" onPress={() => handleAddBarrel(onClose)}>
                                    {t('save')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    if (barrelToDelete) {
                        deleteBarrel(barrelToDelete);
                        setBarrelToDelete(null);
                    }
                }}
                title={t('actions')}
                message={t('delete-barrel-confirm')}
            />

            <ConfirmModal 
                isOpen={isStatusConfirmOpen}
                onClose={() => setIsStatusConfirmOpen(false)}
                onConfirm={() => {
                    if (barrelToToggle) {
                        changeStatus(barrelToToggle.id, barrelToToggle.status as 'active' | 'finished' | 'archived');
                        setBarrelToToggle(null);
                        setIsStatusConfirmOpen(false);
                    }
                }}
                title={t('actions')}
                message={barrelToToggle?.status === 'finished' ? t('confirm-finish') : barrelToToggle?.status === 'archived' ? t('confirm-archive') : t('confirm-active')}
                confirmText={barrelToToggle?.status === 'finished' ? t('finish') : barrelToToggle?.status === 'archived' ? t('archive') : t('activate')}
                color={barrelToToggle?.status === 'archived' ? 'default' : 'primary'}
            />
        </div>
    );
}
