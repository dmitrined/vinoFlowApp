/**
 * НАЗНАЧЕНИЕ: Компонент отображения последних расчетов пользователя
 * ЗАВИСИМОСТИ: useHistoryStore, next-intl, lucide-react, framer-motion, @heroui/react
 * ОСОБЕННОСТИ: Адаптивная сетка, поддержка i18n, анимации удаления и появления
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardBody, Button, Chip, Divider } from "@heroui/react";
import { 
    History, 
    Trash2, 
    Calculator, 
    Beaker, 
    Droplets, 
    Layers, 
    RefreshCcw,
    ChevronRight,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistoryStore, CalculationType } from '@/lib/store/useHistoryStore';

const getIcon = (type: CalculationType) => {
    switch (type) {
        case 'sr-rechner': return <Calculator className="text-orange-500" size={18} />;
        case 'alkohol': return <RefreshCcw className="text-purple-500" size={18} />;
        case 'sr-verschnitt': return <Droplets className="text-teal-500" size={18} />;
        case 'mehrfach': return <Layers className="text-indigo-500" size={18} />;
        case 'so2-calc': return <Beaker className="text-pink-500" size={18} />;
        default: return <Calculator size={18} />;
    }
};

const getTitleKey = (type: CalculationType) => {
    switch (type) {
        case 'sr-rechner': return 'tools.sr-rechner';
        case 'alkohol': return 'tools.alkohol';
        case 'sr-verschnitt': return 'tools.sr-verschnitt';
        case 'mehrfach': return 'tools.mehrfach';
        case 'so2-calc': return 'tools.so2-rechner';
        default: return 'tool-label';
    }
};

export const RecentCalculations: React.FC = () => {
    const t = useTranslations('HomePage');
    const { records, clearHistory, deleteRecord } = useHistoryStore();
    const [mounted, setMounted] = useState(false);

    // Предотвращение гидратации
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || records.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-wine-500/10 rounded-lg text-wine-600">
                        <History size={20} />
                    </div>
                    <h2 className="text-xl font-black tracking-tight">{t('recent-calculations')}</h2>
                </div>
                <Button 
                    size="sm" 
                    variant="light" 
                    color="danger" 
                    onPress={clearHistory}
                    startContent={<Trash2 size={16} />}
                    className="font-bold uppercase text-[10px] tracking-widest"
                >
                    {t('clear-history')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode='popLayout'>
                    {records.map((record) => (
                        <motion.div
                            key={record.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        >
                            <Card className="border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 transition-all border border-default-100 shadow-sm overflow-hidden group">
                                <CardBody className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-default-100 rounded-lg group-hover:scale-110 transition-transform">
                                                {getIcon(record.type)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase text-default-400 tracking-tighter">
                                                    {t(getTitleKey(record.type))}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-default-400">
                                                    <Clock size={10} />
                                                    {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onPress={() => deleteRecord(record.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                    
                                    <Divider className="my-2 opacity-50" />

                                    <div className="flex justify-between items-end mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-default-400 uppercase italic mb-0.5">
                                                {t('last-result')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-black text-wine-600 dark:text-wine-400 tracking-tighter">
                                                    {record.result}
                                                </span>
                                                {record.unit && (
                                                    <span className="text-[10px] font-bold text-default-500 uppercase">
                                                        {record.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-wine-500 opacity-20 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};
