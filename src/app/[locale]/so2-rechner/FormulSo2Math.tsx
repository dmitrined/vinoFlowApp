/**
 * НАЗНАЧЕНИЕ: Улучшенное отображение математических формул расчета SO2
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl
 * ОСОБЕННОСТИ: Пошаговое объяснение, примеры для каждого типа продукта, цветовая кодировка
 */
'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Calculator, Info, Wind, Beaker, FlaskConical, MoveRight, HelpCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

const VariableDisplay: React.FC<{ symbol: React.ReactNode; description: string; icon: React.ReactNode; color: string }> = ({ symbol, description, icon, color }) => (
    <div className="flex items-start gap-4 p-4 bg-default-50 dark:bg-default-100/50 rounded-xl border border-default-200">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-default-200 shadow-sm shrink-0 ${color}`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <div className="text-xl leading-tight">
                {symbol}
            </div>
            <p className="text-default-700 dark:text-default-300 text-xs font-bold uppercase tracking-wider mt-1">
                {description}
            </p>
        </div>
    </div>
);

const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
    <div className="flex flex-col items-center mx-2 shrink-0">
        <div className="pb-1 border-b-2 border-default-900 dark:border-default-100 w-full text-center">
            <span className="text-xl sm:text-3xl font-black leading-none uppercase">
                {numerator}
            </span>
        </div>
        <div className="pt-1 w-full text-center">
            <span className="text-xl sm:text-3xl font-black leading-none uppercase">
                {denominator}
            </span>
        </div>
    </div>
);

const FormulSo2Math: React.FC = () => {
    const t = useTranslations('Calculators.so2-calc');
    const commonT = useTranslations('Calculators');

    // Цвета для переменных
    const colorVol = "text-primary-600 dark:text-primary-400";
    const colorDelta = "text-wine-600 dark:text-wine-400";
    const colorConc = "text-secondary-600 dark:text-secondary-400";

    const V = <span className={`font-mono font-black ${colorVol}`}>V<sub>(L)</sub></span>;
    const DeltaSO2 = <span className={`font-mono font-black ${colorDelta}`}>ΔSO<sub>2</sub></span>;
    const C = <span className={`font-mono font-black ${colorConc}`}>C</span>;


    return (
        <Card className="w-full border-none shadow-2xl mt-8 overflow-hidden" radius="lg">
            <CardHeader className="flex gap-4 bg-wine-600 p-6 text-white">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Calculator size={32} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black tracking-tight">{commonT('formula.title')}</h2>
                    <p className="text-[10px] opacity-80 uppercase font-black tracking-[0.2em]">{commonT('standards.enology')}</p>
                </div>
            </CardHeader>

            <CardBody className="p-0">
                {/* Legend - Sticky or Top */}
                <div className="bg-default-50/80 backdrop-blur-md border-b border-divider p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <VariableDisplay symbol={V} description={t('input-volume')} icon={<Wind size={20} />} color="text-primary-500" />
                    <VariableDisplay symbol={DeltaSO2} description={t('input-delta')} icon={<Beaker size={20} />} color="text-wine-500" />
                    <VariableDisplay symbol={C} description={t('input-liquid-conc')} icon={<FlaskConical size={20} />} color="text-secondary-500" />
                </div>

                <div className="p-6 sm:p-10 space-y-16">
                    {/* Method 1: Solid/Gas */}
                    <section className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-primary-500 rounded-full" />
                            <h3 className="text-xl font-black uppercase tracking-tight text-default-800">
                                {t('gas')} / {t('powder')}
                            </h3>
                            <Chip size="sm" variant="dot" color="primary" className="font-bold border-none">{commonT('formula.mass-calc')}</Chip>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 w-full">
                                <div className="flex justify-center items-center py-10 bg-white dark:bg-black/20 rounded-3xl border-2 border-divider shadow-inner overflow-x-auto">
                                    <div className="flex items-center text-3xl sm:text-5xl font-black">
                                        <span className="text-default-900 dark:text-default-100">g</span>
                                        <span className="mx-4 text-default-300">=</span>
                                        <FractionDisplay
                                            numerator={<div className="flex items-center gap-2">{V}<span className="text-default-300">⋅</span>{DeltaSO2}</div>}
                                            denominator={<div className="flex items-center gap-2">10 <span className="text-default-300">⋅</span> {C}<sub>(%)</sub></div>}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800">
                                    <div className="flex items-center gap-2 mb-3 text-primary-700 dark:text-primary-300 font-black uppercase text-xs">
                                        <HelpCircle size={14} />
                                        <span>{commonT('formula.example')} ({t('gas')} 100%)</span>
                                    </div>
                                    <p className="font-mono text-sm leading-relaxed">
                                        1000 L Wein + 30 mg/l SO2<br />
                                        <span className="text-default-400">→</span> (1000 ⋅ 30) / (10 ⋅ 100)<br />
                                        <span className="text-default-400 font-bold">= 30 g</span>
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 mb-3 text-zinc-500 font-black uppercase text-xs">
                                        <Info size={14} />
                                        <span>{commonT('formula.example')} ({t('powder')} 50%)</span>
                                    </div>
                                    <p className="font-mono text-sm leading-relaxed">
                                        1000 L Wein + 30 mg/l SO2<br />
                                        <span className="text-default-400">→</span> (1000 ⋅ 30) / (10 ⋅ 50)<br />
                                        <span className="text-default-400 font-bold">= 60 g</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Method 2: Liquid */}
                    <section className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-secondary-500 rounded-full" />
                            <h3 className="text-xl font-black uppercase tracking-tight text-default-800">
                                {t('liquid')}
                            </h3>
                            <Chip size="sm" variant="dot" color="secondary" className="font-bold border-none">{commonT('formula.vol-calc')}</Chip>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 w-full">
                                <div className="flex justify-center items-center py-10 bg-white dark:bg-black/20 rounded-3xl border-2 border-divider shadow-inner overflow-x-auto">
                                    <div className="flex items-center text-3xl sm:text-5xl font-black">
                                        <span className="text-default-900 dark:text-default-100">ml</span>
                                        <span className="mx-4 text-default-300">=</span>
                                        <FractionDisplay
                                            numerator={<div className="flex items-center gap-2">{V}<span className="text-default-300">⋅</span>{DeltaSO2}</div>}
                                            denominator={<span>{C}<sub>(g/l)</sub></span>}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="p-6 rounded-3xl bg-secondary-50 dark:bg-secondary-900/10 border border-secondary-100 dark:border-secondary-800">
                                    <div className="flex items-center gap-2 mb-4 text-secondary-700 dark:text-secondary-300 font-black uppercase text-xs">
                                        <HelpCircle size={14} />
                                        <span>{commonT('formula.example')} (150 g/l)</span>
                                    </div>
                                    <p className="font-mono text-base leading-loose">
                                        1000 L Wein + 30 mg/l SO2<br />
                                        <span className="text-default-400">→</span> (1000 ⋅ 30) / 150<br />
                                        <span className="text-default-400 font-bold">= 200 ml</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </CardBody>

            <div className="bg-default-50 border-t border-divider p-4 flex justify-center items-center gap-4 text-default-400 text-[10px] font-black uppercase tracking-widest">
                <span>{commonT('standards.intl-unit')}</span>
                <MoveRight size={12} />
                <span>{commonT('standards.si')}</span>
            </div>
        </Card>
    );
};

export default FormulSo2Math;
