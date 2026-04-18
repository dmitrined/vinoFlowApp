'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { Beaker, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useHistoryAutoSave } from '@/hooks/useHistoryAutoSave';
import SaveFeedback from '@/components/ui/SaveFeedback';
import { WINE_CONSTANTS, calcChaptalization } from '@/lib/calculations';

export default function ChaptalizationCalc() {
    const t = useTranslations('Calculators.chaptalization');
    const locale = useLocale();

    const [volume, setVolume] = useState<string>('');
    const [currentAbv, setCurrentAbv] = useState<string>('');
    const [targetAbv, setTargetAbv] = useState<string>('');
    const [currentUnit, setCurrentUnit] = useState<'percent' | 'gl' | 'gl-sugar' | 'oechsle'>('percent');
    const [targetUnit, setTargetUnit] = useState<'percent' | 'gl' | 'gl-sugar' | 'oechsle'>('percent');

    const convertValue = (valStr: string, fromUnit: 'percent' | 'gl' | 'gl-sugar' | 'oechsle', toUnit: 'percent' | 'gl' | 'gl-sugar' | 'oechsle') => {
        const v = parseFloat(valStr);
        if (isNaN(v)) return valStr;

        let vol = v;
        if (fromUnit === 'gl') vol = v * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
        else if (fromUnit === 'gl-sugar') vol = v / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
        else if (fromUnit === 'oechsle') vol = (v * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE) / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;

        if (toUnit === 'percent') return vol.toFixed(1);
        if (toUnit === 'gl') return (vol / WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR).toFixed(1);
        if (toUnit === 'gl-sugar') return (vol * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV).toFixed(1);
        if (toUnit === 'oechsle') return ((vol * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV) / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE).toFixed(0);
        return valStr;
    };

    const handleCurrentUnitChange = (k: 'percent' | 'gl' | 'gl-sugar' | 'oechsle') => {
        if (k === currentUnit) return;
        setCurrentAbv(convertValue(currentAbv, currentUnit, k));
        setCurrentUnit(k);
    };

    const handleTargetUnitChange = (k: 'percent' | 'gl' | 'gl-sugar' | 'oechsle') => {
        if (k === targetUnit) return;
        setTargetAbv(convertValue(targetAbv, targetUnit, k));
        setTargetUnit(k);
    };

    const error = useMemo(() => {
        const c = parseFloat(currentAbv) || 0;
        const target = parseFloat(targetAbv) || 0;
        
        let cVol = c;
        if (currentUnit === 'gl') cVol = c * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
        else if (currentUnit === 'gl-sugar') cVol = c / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
        else if (currentUnit === 'oechsle') cVol = (c * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE) / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;

        let tVol = target;
        if (targetUnit === 'gl') tVol = target * WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
        else if (targetUnit === 'gl-sugar') tVol = target / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
        else if (targetUnit === 'oechsle') tVol = (target * WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_OECHSLE) / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;

        if (tVol > 0 && tVol <= cVol) {
            return t('error-target');
        }
        return null;
    }, [currentAbv, targetAbv, currentUnit, targetUnit, t]);

    const results = useMemo(() => {
        const v = parseFloat(volume) || 0;
        const c = parseFloat(currentAbv) || 0;
        const target = parseFloat(targetAbv) || 0;
        
        return calcChaptalization(v, c, target, currentUnit, targetUnit);
    }, [volume, currentAbv, targetAbv, currentUnit, targetUnit]);

    const formattedResult = results.sugar > 0 ? results.sugar.toLocaleString(locale, { maximumFractionDigits: 2 }) : '0';

    const sugarPerLiter = useMemo(() => {
        const v = parseFloat(volume);
        if (v > 0 && results.sugar > 0) {
            return (results.sugar * 1000) / v;
        }
        return 0;
    }, [volume, results.sugar]);

    const diffAlcGl = useMemo(() => {
        if (sugarPerLiter > 0) {
             const diffVol = sugarPerLiter / WINE_CONSTANTS.CHAPTALIZATION.SUGAR_PER_ABV;
             return diffVol / WINE_CONSTANTS.ALCOHOL_CONVERSION_FACTOR;
        }
        return 0;
    }, [sugarPerLiter]);

    const showWarning = diffAlcGl > 24;

    const { showFeedback } = useHistoryAutoSave(
        {
            type: 'chaptalization',
            result: formattedResult,
            unit: 'kg'
        },
        results.sugar > 0 ? results.sugar : null
    );

    const baseCurrentLabel = (currentUnit === 'oechsle' ? t('input-current-oechsle') : t('input-current-abv')).split('(')[0].trim();
    const baseTargetLabel = (targetUnit === 'oechsle' ? t('input-target-oechsle') : t('input-target-abv')).split('(')[0].trim();

    const getUnitDisplay = (unitType: string) => {
        if (unitType === 'percent') return '% Vol';
        if (unitType === 'gl') return 'g/L Alc';
        if (unitType === 'gl-sugar') return 'g/L Sugar';
        return '°Oe';
    };

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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Input
                                type="number"
                                label={t('input-volume')}
                                placeholder="0"
                                value={volume}
                                onValueChange={setVolume}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    input: "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2 truncate w-full"
                                }}
                            />

                            <Input
                                type="number"
                                label={baseCurrentLabel}
                                placeholder="0"
                                value={currentAbv}
                                onValueChange={setCurrentAbv}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                endContent={
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button 
                                                variant="light" 
                                                size="sm" 
                                                className="min-w-0 px-2 h-7 text-[10px] font-black tracking-widest uppercase text-zinc-500 data-[hover=true]:bg-zinc-200 dark:data-[hover=true]:bg-zinc-700"
                                            >
                                                {getUnitDisplay(currentUnit)}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu 
                                            aria-label="Current Unit" 
                                            onAction={(k) => handleCurrentUnitChange(k as 'percent' | 'gl' | 'gl-sugar' | 'oechsle')}
                                        >
                                            <DropdownItem key="percent">% Vol</DropdownItem>
                                            <DropdownItem key="gl">g/L Alc</DropdownItem>
                                            <DropdownItem key="gl-sugar">g/L Sugar</DropdownItem>
                                            <DropdownItem key="oechsle">°Oe</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                }
                                classNames={{
                                    input: "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2 truncate w-full"
                                }}
                            />

                            <Input
                                type="number"
                                label={baseTargetLabel}
                                placeholder="0"
                                value={targetAbv}
                                onValueChange={setTargetAbv}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                isInvalid={!!error}
                                errorMessage={error}
                                endContent={
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button 
                                                variant="light" 
                                                size="sm" 
                                                className="min-w-0 px-2 h-7 text-[10px] font-black tracking-widest uppercase text-zinc-500 data-[hover=true]:bg-zinc-200 dark:data-[hover=true]:bg-zinc-700"
                                            >
                                                {getUnitDisplay(targetUnit)}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu 
                                            aria-label="Target Unit" 
                                            onAction={(k) => handleTargetUnitChange(k as 'percent' | 'gl' | 'gl-sugar' | 'oechsle')}
                                        >
                                            <DropdownItem key="percent">% Vol</DropdownItem>
                                            <DropdownItem key="gl">g/L Alc</DropdownItem>
                                            <DropdownItem key="gl-sugar">g/L Sugar</DropdownItem>
                                            <DropdownItem key="oechsle">°Oe</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                }
                                classNames={{
                                    input: "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2 truncate w-full"
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
                                        {showWarning && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                className="mt-6 flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            >
                                                <AlertTriangle size={16} className="shrink-0" />
                                                <span>{t('warning-limit')}</span>
                                            </motion.div>
                                        )}
                                    </div>
                                    
                                    <div className="w-full flex justify-between divide-x divide-white/10 border-t border-white/10 pt-6 px-4">
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 text-center px-1">
                                                {t('result-alc-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-xl sm:text-2xl font-black ${diffAlcGl > 0 ? 'text-zinc-200' : 'text-zinc-200'}`}>
                                                    +{diffAlcGl > 0 ? diffAlcGl.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase">g/L Alc</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 text-center px-1">
                                                {t('result-volume-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl sm:text-2xl font-black text-zinc-200">
                                                    +{results.deltaVol > 0 ? results.deltaVol.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase">L</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 text-center px-1">
                                                {t('result-total-volume')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl sm:text-2xl font-black text-brand-400">
                                                    {results.total > 0 ? results.total.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase">L</span>
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
