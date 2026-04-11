'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardBody, Input, Tabs, Tab } from "@heroui/react";
import { Beaker, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useHistoryAutoSave } from '@/hooks/useHistoryAutoSave';
import SaveFeedback from '@/components/ui/SaveFeedback';
import { WINE_CONSTANTS } from '@/lib/calculations';

export default function ChaptalizationCalc() {
    const t = useTranslations('Calculators.chaptalization');
    const locale = useLocale();

    const [volume, setVolume] = useState<string>('1000');
    const [currentAbv, setCurrentAbv] = useState<string>('10.0');
    const [targetAbv, setTargetAbv] = useState<string>('12.5');
    const [unit, setUnit] = useState<'percent' | 'gl'>('percent');

    const handleUnitToggle = (newUnit: 'percent' | 'gl') => {
        if (newUnit === unit) return;
        
        const c = parseFloat(currentAbv);
        const tArg = parseFloat(targetAbv);
        
        if (newUnit === 'gl') {
            if (!isNaN(c)) setCurrentAbv((c / WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR).toFixed(1));
            if (!isNaN(tArg)) setTargetAbv((tArg / WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR).toFixed(1));
        } else {
            if (!isNaN(c)) setCurrentAbv((c * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR).toFixed(1));
            if (!isNaN(tArg)) setTargetAbv((tArg * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR).toFixed(1));
        }
        
        setUnit(newUnit);
    };

    const error = useMemo(() => {
        const c = parseFloat(currentAbv) || 0;
        const target = parseFloat(targetAbv) || 0;
        if (target > 0 && target <= c) {
            return t('error-target');
        }
        return null;
    }, [currentAbv, targetAbv, t]);

    const results = useMemo(() => {
        const v = parseFloat(volume) || 0;
        let c = parseFloat(currentAbv) || 0;
        let target = parseFloat(targetAbv) || 0;
        
        if (v <= 0 || c <= 0 || target <= 0 || target <= c) {
            return { sugar: 0, deltaVol: 0, total: v };
        }
        
        if (unit === 'gl') {
            c = c * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
            target = target * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
        }
        
        const diff = target - c;
        const sugarNeeded = (diff * 16.83 * v) / 1000;
        const volumeIncrease = sugarNeeded * 0.63;
        const totalVolume = v + volumeIncrease;
        
        return { sugar: sugarNeeded, deltaVol: volumeIncrease, total: totalVolume };
    }, [volume, currentAbv, targetAbv, unit]);

    const formattedResult = results.sugar > 0 ? results.sugar.toLocaleString(locale, { maximumFractionDigits: 2 }) : '0';

    const { showFeedback } = useHistoryAutoSave(
        {
            type: 'chaptalization',
            result: formattedResult,
            unit: 'kg'
        },
        results.sugar > 0 ? results.sugar : null,
        3000
    );

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <Card className="bento-card border-none shadow-none">
                    <CardHeader className="flex gap-5 p-8">
                        <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
                            <Beaker size={32} />
                        </div>
                        <div className="flex flex-col text-left">
                            <h1 className="text-3xl font-black tracking-tight text-tech-gradient uppercase italic">{t('title')}</h1>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">{t('subtitle')}</p>
                        </div>
                    </CardHeader>

                    <CardBody className="p-8 space-y-10">
                        <div className="flex justify-center mb-6">
                            <Tabs 
                                selectedKey={unit} 
                                onSelectionChange={(k) => handleUnitToggle(k as 'percent' | 'gl')} 
                                variant="solid"
                                color="primary"
                                radius="full"
                                classNames={{
                                    tabList: "bg-zinc-100 dark:bg-zinc-800/50 p-1",
                                    tab: "px-6 h-8 text-[11px] font-black uppercase tracking-widest text-zinc-500",
                                    cursor: "bg-white dark:bg-zinc-700 shadow-sm"
                                }}
                            >
                                <Tab key="percent" title="% Vol" />
                                <Tab key="gl" title="g/L" />
                            </Tabs>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Input
                                type="number"
                                label={t('input-volume')}
                                value={volume}
                                onValueChange={setVolume}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                            <Input
                                type="number"
                                label={`${t('input-current-abv').replace('(%)', '').trim()} ${unit === 'percent' ? '(%)' : '(g/L)'}`}
                                value={currentAbv}
                                onValueChange={setCurrentAbv}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                            <Input
                                type="number"
                                label={`${t('input-target-abv').replace('(%)', '').trim()} ${unit === 'percent' ? '(%)' : '(g/L)'}`}
                                value={targetAbv}
                                onValueChange={setTargetAbv}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                isInvalid={!!error}
                                errorMessage={error}
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative bg-zinc-950 text-white border-none overflow-hidden py-6 flex flex-col items-center justify-center rounded-[2.5rem]" shadow="none">
                                <CardBody className="p-0 flex flex-col items-center justify-center relative z-10 w-full space-y-6">
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-[0.3em]">
                                            {t('result-sugar')}
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                                                {results.sugar > 0 ? results.sugar.toLocaleString(locale, { maximumFractionDigits: 2 }) : '0'}
                                            </span>
                                            <span className="text-xl font-black text-brand-500 uppercase italic">
                                                kg
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full flex gap-4 divide-x divide-white/10 border-t border-white/10 pt-6 px-6">
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 text-center">
                                                {t('result-volume-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-zinc-200">
                                                    +{results.deltaVol > 0 ? results.deltaVol.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-sm font-bold text-zinc-500 uppercase">L</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col items-center pl-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 text-center">
                                                {t('result-total-volume')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-brand-400">
                                                    {results.total > 0 ? results.total.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-sm font-bold text-zinc-500 uppercase">L</span>
                                            </div>
                                        </div>
                                    </div>

                                </CardBody>
                                <div className="absolute top-0 left-0 p-4 opacity-5">
                                    <Beaker size={120} />
                                </div>
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
            <SaveFeedback show={showFeedback} />
        </div>
    );
}
