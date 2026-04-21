/**
 * НАЗНАЧЕНИЕ: Компонент отображения последних расчетов пользователя в стиле SaaS Dashboard
 * ЗАВИСИМОСТИ: useHistoryStore, next-intl, lucide-react, framer-motion, @heroui/react
 * ОСОБЕННОСТИ: Обновлено под Tech UI: используется glass-modern, бренд-цвета и современная сетка
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { 
    History, 
    Trash2, 
    Calculator, 
    Droplets, 
    Layers, 
    RefreshCcw,
    ChevronRight,
    Clock,
    FlaskConical,
    Activity
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { CalculationType } from '@/types/calculations';

const getIcon = (type: CalculationType) => {
    switch (type) {
        case 'sr-rechner': return <Calculator className="text-blue-500" size={18} />;
        case 'alkohol': return <RefreshCcw className="text-purple-500" size={18} />;
        case 'sr-verschnitt': return <Droplets className="text-cyan-500" size={18} />;
        case 'mehrfach': return <Layers className="text-orange-500" size={18} />;
        case 'so2-calc': return <FlaskConical className="text-emerald-500" size={18} />;
        case 'acid-management': return <FlaskConical className="text-rose-500" size={18} />;
        case 'chaptalization': return <Activity className="text-amber-500" size={18} />;
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
        case 'acid-management': return 'tools.acid-management';
        case 'chaptalization': return 'tools.chaptalization';
        default: return 'tool-label';
    }
};

export const RecentCalculations: React.FC = () => {
    const t = useTranslations('HomePage');
    const { records, clearHistory, deleteRecord, _hasHydrated } = useHistoryStore();

    const activeRecords = records.filter(r => !r.isDeleted);

    if (!_hasHydrated || activeRecords.length === 0) {
        return null;
    }

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500/10 rounded-xl text-brand-600">
                        <History size={20} />
                    </div>
                    <h2 className="text-xl font-black tracking-tight uppercase italic opacity-80">{t('recent-calculations')}</h2>
                </div>
                <Button 
                    size="sm" 
                    variant="light" 
                    color="danger" 
                    onPress={clearHistory}
                    startContent={<Trash2 size={16} />}
                    className="font-bold uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100"
                >
                    {t('clear-history')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode='popLayout'>
                    {activeRecords.map((record) => (
                        <m.div
                            key={record.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="border-none glass-modern shadow-none group">
                                <CardBody className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                                {getIcon(record.type)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                                                    {t(getTitleKey(record.type))}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
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
                                    
                                    <Divider className="my-2 opacity-30" />

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex flex-col text-left">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 opacity-60">
                                                {t('last-result')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-brand-600 dark:text-brand-400 tracking-tighter">
                                                    {record.result}
                                                </span>
                                                {record.unit && (
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase">
                                                        {record.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-brand-500 opacity-20 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </m.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};
