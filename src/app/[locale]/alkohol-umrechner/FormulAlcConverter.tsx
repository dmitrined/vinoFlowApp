/**
 * НАЗНАЧЕНИЕ: Анализатор сусла и спирта (Dashboard)
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, @/lib/calculations
 * ОСОБЕННОСТИ: Единый ввод с переключением единиц, высокоточный расчет по Троосту.
 */

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardBody, Input, Tabs, Tab } from "@heroui/react";
import { RefreshCcw, Droplets, Wine, Beaker, FlaskConical, Info, type LucideIcon } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { m, AnimatePresence } from "framer-motion";
import { getTroostData, EnologicalUnit } from '@/lib/calculations';

const MustAnalyzer = () => {
    const t = useTranslations('Calculators.alkohol');
    const locale = useLocale();
    const inputRef = useRef<HTMLInputElement>(null);

    // Основное состояние - значение и его единица измерения
    const [activeValue, setActiveValue] = useState<string>('');
    const [activeUnit, setActiveUnit] = useState<EnologicalUnit>('oe');

    // Фокус при монтировании
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Расчетные данные
    const data = useMemo(() => {
        const val = parseFloat(activeValue.replace(',', '.')) || 0;
        return getTroostData(val, activeUnit);
    }, [activeValue, activeUnit]);

    const format = (val: number, unit: EnologicalUnit) => {
        return val.toLocaleString(locale, { 
            maximumFractionDigits: unit === 'oe' ? 0 : 2,
            minimumFractionDigits: unit === 'oe' ? 0 : 2
        });
    };

    const units: { key: EnologicalUnit; icon: LucideIcon; color: string }[] = [
        { key: 'oe', icon: Droplets, color: 'text-blue-500' },
        { key: 'alcVol', icon: Wine, color: 'text-brand-500' },
        { key: 'sugar', icon: Beaker, color: 'text-orange-500' },
        { key: 'alcGl', icon: FlaskConical, color: 'text-purple-500' }
    ];

    const results = units.filter(u => u.key !== activeUnit);

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center py-12 md:py-24">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl space-y-12"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <m.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="p-4 bg-brand-600 text-white rounded-3xl shadow-2xl shadow-brand-500/20 mb-2"
                    >
                        <RefreshCcw size={40} />
                    </m.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-tech-gradient uppercase italic">
                        {t('title')}
                    </h1>
                    <p className="max-w-md text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Master Input Card */}
                <Card className="relative overflow-visible border-none bg-white dark:bg-zinc-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none p-1 sm:p-2 rounded-[2.5rem]">
                    <CardBody className="p-8 sm:p-12 space-y-10">
                        <div className="flex flex-col items-center space-y-8">
                            {/* Unit Switcher */}
                            <Tabs 
                                aria-label="Unit selection"
                                selectedKey={activeUnit}
                                onSelectionChange={(key) => setActiveUnit(key as EnologicalUnit)}
                                variant="light"
                                color="primary"
                                classNames={{
                                    tabList: "gap-1 sm:gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-3xl border-none",
                                    cursor: "bg-white dark:bg-zinc-700 shadow-xl rounded-[1.25rem]",
                                    tab: "px-3 sm:px-5 h-11 sm:h-12",
                                    tabContent: "font-black uppercase tracking-wider text-[11px] sm:text-xs"
                                }}
                            >
                                {units.map((u) => (
                                    <Tab 
                                        key={u.key} 
                                        title={
                                            <div className="flex items-center gap-2">
                                                <u.icon size={18} className={activeUnit === u.key ? u.color : 'text-zinc-400 group-hover:text-zinc-500'} />
                                                <span className={activeUnit === u.key ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}>
                                                    {u.key === 'alcVol' ? '% Vol' : u.key === 'alcGl' ? 'g/L Alc' : u.key === 'sugar' ? 'g/L Sugar' : '°Oe'}
                                                </span>
                                            </div>
                                        }
                                    />
                                ))}
                            </Tabs>

                            {/* Large Input Area */}
                            <div className="w-full relative max-w-sm">
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0"
                                    value={activeValue}
                                    onValueChange={setActiveValue}
                                    variant="flat"
                                    size="lg"
                                    classNames={{
                                        input: "text-center text-6xl md:text-8xl font-black tracking-tighter h-auto py-4",
                                        inputWrapper: "bg-transparent hover:bg-transparent focus-within:bg-transparent shadow-none h-auto"
                                    }}
                                />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-brand-500 rounded-full opacity-20"></div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                            <AnimatePresence mode="popLayout">
                                {results.map((u) => (
                                    <m.div
                                        key={u.key}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative group p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center text-center"
                                    >
                                        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <u.icon size={24} />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 truncate w-full px-2">
                                            {t(`unit-${u.key === 'alcVol' ? 'vol' : u.key === 'alcGl' ? 'alc-gl' : u.key}`)}
                                        </span>
                                        <span className="text-3xl font-black tracking-tight text-zinc-800 dark:text-zinc-100 italic">
                                            {format(data[u.key === 'alcGl' ? 'alcGl' : u.key as keyof typeof data] as number, u.key)}
                                        </span>
                                    </m.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </CardBody>
                </Card>

                {/* Footer Info */}
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/10 px-6 py-3 rounded-2xl border border-brand-100 dark:border-brand-800">
                        <Info size={16} className="text-brand-600 shrink-0" />
                        <p className="text-[10px] font-bold text-brand-950/60 dark:text-brand-100/60 uppercase tracking-widest leading-relaxed">
                            {t('formula-desc')} • {t('footer-tag')}
                        </p>
                    </div>
                </div>
            </m.div>
        </div>
    );
};

export default MustAnalyzer;
