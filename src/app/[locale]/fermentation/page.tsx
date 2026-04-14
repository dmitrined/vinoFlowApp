/**
 * НАЗНАЧЕНИЕ: Дашборд модуля мониторинга брожения
 * ЗАВИСИМОСТИ: useFermentationStore, BarrelCard, @heroui/react
 * ОСОБЕННОСТИ: Bento-сетка бочек, модальное окно добавления
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Plus, Wine, Search, Filter } from "lucide-react";
import { useFermentationStore } from '@/lib/store/useFermentationStore';
import { BarrelCard } from '@/components/fermentation/BarrelCard';
import { ConfirmModal } from '@/components/fermentation/ConfirmModal';
import { useSyncEngine } from '@/hooks/useSyncEngine';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";

export default function FermentationDashboard() {
    const t = useTranslations('Fermentation');
    const { barrels, addBarrel, deleteBarrel } = useFermentationStore();
    const { syncAll } = useSyncEngine();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newBarrelNumber, setNewBarrelNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Синхронизация теперь управляется централизованно через SyncEngine в layout.tsx
    // Убираем локальный вызов, чтобы не дублировать запросы

    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [barrelToDelete, setBarrelToDelete] = useState<string | null>(null);

    const handleAddBarrel = (onClose: () => void) => {
        if (newBarrelNumber.trim()) {
            addBarrel(newBarrelNumber.trim());
            setNewBarrelNumber('');
            onClose();
        }
    };

    const filteredBarrels = barrels.filter(b => 
        !b.isDeleted && b.number.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                <Input
                    isClearable
                    fullWidth
                    placeholder={t('barrel-placeholder')}
                    startContent={<Search size={18} className="text-zinc-400" />}
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    variant="flat"
                    className="max-w-md"
                    classNames={{
                        inputWrapper: "bg-white dark:bg-zinc-800 shadow-sm border-zinc-100 dark:border-zinc-700"
                    }}
                />
                <Button variant="flat" isIconOnly radius="full" className="bg-white dark:bg-zinc-800 shadow-sm">
                    <Filter size={18} className="text-zinc-500" />
                </Button>
            </div>

            {/* Barrels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredBarrels.length > 0 ? (
                        filteredBarrels.map((barrel) => (
                            <BarrelCard 
                                key={barrel.id} 
                                barrel={barrel} 
                                onDelete={(id) => {
                                    setBarrelToDelete(id);
                                    setIsConfirmOpen(true);
                                }}
                            />
                        ))
                    ) : (
                        <motion.div 
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
                                    label={t('barrel-number')}
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
        </div>
    );
}
