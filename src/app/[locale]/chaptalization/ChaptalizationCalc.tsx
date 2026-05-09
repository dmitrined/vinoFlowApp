/**
 * НАЗНАЧЕНИЕ: Калькулятор шаптализации на основе таблицы Трооста
 * ЗАВИСИМОСТИ: useTranslations, useHistoryAutoSave, calcChaptalization
 * ОСОБЕННОСТЬ: 4 единицы измерения, энологическая точность, Mobile-first
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { Beaker, AlertTriangle, History, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { calcChaptalization, EnologicalUnit, getTroostData } from '@/lib/calculations';
import FormulChaptalizationMath from './FormulChaptalizationMath';

export default function ChaptalizationCalc() {
    const t = useTranslations('Calculators.chaptalization');
    const commonT = useTranslations('Calculators');
    const locale = useLocale();

    const [showFormula, setShowFormula] = useState<boolean>(false);
    const [volume, setVolume] = useState<string>('');
    const [currentVal, setCurrentVal] = useState<string>('');
    const [targetVal, setTargetVal] = useState<string>('');
    const [currentUnit, setCurrentUnit] = useState<EnologicalUnit>('alcVol');
    const [targetUnit, setTargetUnit] = useState<EnologicalUnit>('alcVol');

    // Функция для пересчета значений между различными энологическими единицами
    const handleUnitChange = React.useCallback((valStr: string, fromUnit: EnologicalUnit, toUnit: EnologicalUnit) => {
        const v = parseFloat(valStr.replace(',', '.'));
        if (isNaN(v)) return valStr;

        const data = getTroostData(v, fromUnit);
        const result = data[toUnit as keyof typeof data];
        
        return typeof result === 'number' 
            ? result.toLocaleString(locale, { maximumFractionDigits: toUnit === 'oe' ? 0 : 2 }) 
            : valStr;
    }, [locale]);

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

    // Основной расчет параметров шаптализации
    const results = useMemo(() => {
        // Парсинг входных данных с поддержкой запятой как десятичного разделителя
        const v = parseFloat(volume.replace(',', '.')) || 0;
        const c = parseFloat(currentVal.replace(',', '.')) || 0;
        const target = parseFloat(targetVal.replace(',', '.')) || 0;
        
        return calcChaptalization(v, c, target, currentUnit, targetUnit);
    }, [volume, currentVal, targetVal, currentUnit, targetUnit]);

    // Валидация: проверка, что целевое значение больше текущего
    const error = useMemo(() => {
        if (!currentVal || !targetVal) return null;
        if (results.targetData && results.currentData) {
            if (results.targetData.totalAlc < results.currentData.totalAlc) {
                return t('error-target');
            }
        }
        return null;
    }, [currentVal, targetVal, results.targetData, results.currentData, t]);


    const getPositive = (val: number | undefined) => {
        if (val && val > 0) return val;
        return 0;
    };

    const showWarning = (results.targetData?.alcVol || 0) - (results.currentData?.alcVol || 0) > 3.0; // Примерный порог 3% Vol

    
    // Получение локализованного отображения единиц измерения
    const getUnitDisplay = (u: EnologicalUnit) => {
        switch(u) {
            case 'oe': return t('unit-oe');
            case 'alcVol': return t('unit-alc-vol');
            case 'alcGl': return t('unit-g-l-alc');
            case 'sugar': return t('unit-sugar-gl');
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
                    <CardHeader className="flex gap-3 sm:gap-5 p-4 sm:p-8">
                        <div className="p-3 sm:p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20 shrink-0">
                            <Beaker size={24} className="sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex flex-col text-left flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-tech-gradient uppercase italic leading-tight">{t('title')}</h1>
                            <p className="text-[10px] sm:text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">{t('subtitle')}</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
                            <History size={16} className="text-zinc-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('history')}</span>
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

                            <div className="flex flex-col gap-2">
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
                                                    variant="flat" 
                                                    size="sm" 
                                                    className="h-9 px-3 min-w-[85px] text-[10px] font-black tracking-widest uppercase text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/50 hover:bg-brand-200 dark:hover:bg-brand-800 transition-all border border-brand-300/50 dark:border-brand-600/50 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between w-full gap-2">
                                                        <span>{getUnitDisplay(currentUnit)}</span>
                                                        <ChevronsUpDown size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
                                                    </div>
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu 
                                                aria-label={t('unit-select')} 
                                                onAction={(k) => handleCurrentUnitChange(k as EnologicalUnit)}
                                            >
                                                {units.map(u => (
                                                    <DropdownItem key={u}>
                                                        {getUnitDisplay(u)}
                                                    </DropdownItem>
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

                            <div className="flex flex-col gap-2">
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
                                                    variant="flat" 
                                                    size="sm" 
                                                    className="h-9 px-3 min-w-[85px] text-[10px] font-black tracking-widest uppercase text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/50 hover:bg-brand-200 dark:hover:bg-brand-800 transition-all border border-brand-300/50 dark:border-brand-600/50 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between w-full gap-2">
                                                        <span>{getUnitDisplay(targetUnit)}</span>
                                                        <ChevronsUpDown size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
                                                    </div>
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu 
                                                aria-label={t('unit-select')} 
                                                onAction={(k) => handleTargetUnitChange(k as EnologicalUnit)}
                                            >
                                                {units.map(u => (
                                                    <DropdownItem key={u}>
                                                        {getUnitDisplay(u)}
                                                    </DropdownItem>
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
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative bg-zinc-950 text-white border-none overflow-hidden py-8 flex flex-col items-center justify-center rounded-[2.5rem]" shadow="none">
                                <CardBody className="p-0 flex flex-col items-center justify-center relative z-10 w-full space-y-8">
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-[0.3em]">
                                            {t('result-sugar')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                                                    {results.sugar > 0 ? results.sugar.toLocaleString(locale, { maximumFractionDigits: 2 }) : '0'}
                                                </span>
                                                <span className="text-xl font-black text-brand-500 uppercase italic">
                                                    kg
                                                </span>
                                            </div>
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
                                    
                                    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-y-6 divide-x-0 sm:divide-x divide-white/10 border-t border-white/10 pt-8 px-4">
                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                {t('result-oe-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-zinc-200">
                                                    +{getPositive(results.deltaOe).toLocaleString(locale, { maximumFractionDigits: 1 })}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">{t('unit-oe')}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                {t('result-alc-vol-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-zinc-200">
                                                    +{getPositive(results.deltaAlcVol).toLocaleString(locale, { maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">{t('unit-alc-vol')}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                {t('result-alc-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-zinc-200">
                                                    +{getPositive(results.deltaAlcGl).toLocaleString(locale, { maximumFractionDigits: 1 })}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">{t('unit-g-l-alc')}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center px-2 text-center">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 truncate w-full">
                                                {t('result-sugar-increase')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-zinc-200">
                                                    +{getPositive(results.deltaSugar).toLocaleString(locale, { maximumFractionDigits: 1 })}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">{t('unit-sugar-gl')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 pt-6 px-4">
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

                    <CardBody className="px-8 pb-8 pt-0 flex flex-col items-center">
                        <Button
                            variant="light"
                            onPress={() => setShowFormula(!showFormula)}
                            startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
                            className="font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-brand-600 w-full h-12 rounded-2xl"
                        >
                            {showFormula ? commonT('formula.hide') : commonT('formula.title')}
                        </Button>
                    </CardBody>
                </Card>
            </m.div>

            <AnimatePresence>
                {showFormula && (
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                    >
                        <FormulChaptalizationMath />
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
