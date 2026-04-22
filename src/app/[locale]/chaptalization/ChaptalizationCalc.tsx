/**
 * НАЗНАЧЕНИЕ: Калькулятор шаптализации на основе таблицы Трооста
 * ЗАВИСИМОСТИ: useTranslations, useFermentationStore, calcChaptalization
 * ОСОБЕННОСТЬ: 4 единицы измерения, высокоточная интерполяция, Mobile-first
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { Beaker, AlertTriangle, ChevronDown } from "lucide-react";
import { m } from "framer-motion";
import { useHistoryAutoSave } from '@/hooks/useHistoryAutoSave';
import SaveFeedback from '@/components/ui/SaveFeedback';
import { calcChaptalization, EnologicalUnit, getTroostData } from '@/lib/calculations';

export default function ChaptalizationCalc() {
    const t = useTranslations('Calculators.chaptalization');
    const locale = useLocale();

    const [volume, setVolume] = useState<string>('');
    const [currentVal, setCurrentVal] = useState<string>('');
    const [targetVal, setTargetVal] = useState<string>('');
    const [currentUnit, setCurrentUnit] = useState<EnologicalUnit>('alcVol');
    const [targetUnit, setTargetUnit] = useState<EnologicalUnit>('alcVol');

    const handleUnitChange = (valStr: string, fromUnit: EnologicalUnit, toUnit: EnologicalUnit) => {
        const v = parseFloat(valStr.replace(',', '.'));
        if (isNaN(v)) return valStr;

        const data = getTroostData(v, fromUnit);
        const result = data[toUnit as keyof typeof data];
        
        return typeof result === 'number' 
            ? result.toLocaleString(locale, { maximumFractionDigits: toUnit === 'oe' ? 0 : 2 }) 
            : valStr;
    };

    const handleCurrentUnitChange = (k: EnologicalUnit) => {
        if (k === currentUnit) return;
        setCurrentVal(handleUnitChange(currentVal, currentUnit, k));
        setCurrentUnit(k);
    };

    const handleTargetUnitChange = (k: EnologicalUnit) => {
        if (k === targetUnit) return;
        setTargetVal(handleUnitChange(targetVal, targetUnit, k));
        setTargetUnit(k);
    };

    const results = useMemo(() => {
        const v = parseFloat(volume.replace(',', '.')) || 0;
        const c = parseFloat(currentVal.replace(',', '.')) || 0;
        const target = parseFloat(targetVal.replace(',', '.')) || 0;
        
        return calcChaptalization(v, c, target, currentUnit, targetUnit);
    }, [volume, currentVal, targetVal, currentUnit, targetUnit]);

    const error = useMemo(() => {
        if (!currentVal || !targetVal) return null;
        if (results.sugar === 0 && parseFloat(targetVal) > 0) {
            return t('error-target');
        }
        return null;
    }, [currentVal, targetVal, results.sugar, t]);

    const formattedResult = results.sugar > 0 ? results.sugar.toLocaleString(locale, { maximumFractionDigits: 2 }) : '0';

    const alcGlDifference = useMemo(() => {
        if (results.targetData && results.currentData) {
            const diff = results.targetData.totalAlc - results.currentData.totalAlc;
            return diff > 0 ? diff : 0;
        }
        return 0;
    }, [results.targetData, results.currentData]);

    const showWarning = (results.targetData?.alcVol || 0) - (results.currentData?.alcVol || 0) > 3.0; // Примерный порог 3% Vol

    const { showFeedback } = useHistoryAutoSave(
        {
            type: 'chaptalization',
            result: formattedResult,
            unit: 'kg'
        },
        results.sugar > 0 ? results.sugar : null
    );

    const getUnitDisplay = (u: EnologicalUnit) => {
        switch(u) {
            case 'oe': return '°Oe';
            case 'alcVol': return '% Vol';
            case 'alcGl': return 'g/L Alc';
            case 'sugar': return 'g/L Sugar';
            default: return u;
        }
    };

    const units: EnologicalUnit[] = ['oe', 'alcVol', 'alcGl', 'sugar'];

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <Card className="bento-card border-none shadow-none">
                    <CardHeader className="flex gap-5 p-8 pb-4">
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
                                type="text"
                                inputMode="decimal"
                                label={t('input-volume')}
                                placeholder="0"
                                value={volume}
                                onValueChange={setVolume}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2 truncate w-full"
                                }}
                                endContent={<span className="text-zinc-400 font-black text-[10px]">L</span>}
                            />

                            <Input
                                type="text"
                                inputMode="decimal"
                                label={t('input-current')}
                                placeholder="0"
                                value={currentVal}
                                onValueChange={setCurrentVal}
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
                                                endContent={<ChevronDown size={12} />}
                                            >
                                                {getUnitDisplay(currentUnit)}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu 
                                            aria-label={t('unit-select')} 
                                            onAction={(k) => handleCurrentUnitChange(k as EnologicalUnit)}
                                        >
                                            {units.map(u => (
                                                <DropdownItem key={u}>{getUnitDisplay(u)}</DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                }
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2 truncate w-full"
                                }}
                            />

                            <Input
                                type="text"
                                inputMode="decimal"
                                label={t('input-target')}
                                placeholder="0"
                                value={targetVal}
                                onValueChange={setTargetVal}
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
                                                endContent={<ChevronDown size={12} />}
                                            >
                                                {getUnitDisplay(targetUnit)}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu 
                                            aria-label={t('unit-select')} 
                                            onAction={(k) => handleTargetUnitChange(k as EnologicalUnit)}
                                        >
                                            {units.map(u => (
                                                <DropdownItem key={u}>{getUnitDisplay(u)}</DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                }
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2 truncate w-full"
                                }}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative bg-zinc-950 text-white border-none overflow-hidden py-8 flex flex-col items-center justify-center rounded-[2.5rem]" shadow="none">
                                <CardBody className="p-0 flex flex-col items-center justify-center relative z-10 w-full space-y-8">
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-[0.3em]">
                                            {t('result-sugar')}
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                                                {results.sugar > 0 ? results.sugar.toLocaleString(locale, { maximumFractionDigits: 2 }) : '0'}
                                            </span>
                                            <span className="text-xl font-black text-brand-500 uppercase italic">
                                                kg
                                            </span>
                                        </div>
                                        {showWarning && (
                                            <m.div 
                                                initial={{ opacity: 0, scale: 0.9 }} 
                                                animate={{ opacity: 1, scale: 1 }} 
                                                className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            >
                                                <AlertTriangle size={14} className="shrink-0" />
                                                <span>{t('warning-limit')}</span>
                                            </m.div>
                                        )}
                                    </div>
                                    
                                    <div className="w-full grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8 px-4">
                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                Zusatz (Alc)
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-zinc-200">
                                                    +{alcGlDifference > 0 ? alcGlDifference.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">g/L Alc</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                {t('result-volume-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-zinc-200">
                                                    +{results.deltaVol > 0 ? results.deltaVol.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">L</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                {t('result-total-volume')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-brand-400">
                                                    {results.total > 0 ? results.total.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">L</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                                <div className="absolute top-0 left-0 p-6 opacity-5">
                                    <Beaker size={140} />
                                </div>
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </m.div>
            <SaveFeedback show={showFeedback} />
        </div>
    );
}
