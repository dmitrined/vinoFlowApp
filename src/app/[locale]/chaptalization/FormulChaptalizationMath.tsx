/**
 * НАЗНАЧЕНИЕ: Отображение математической формулы для расчета шаптализации.
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl
 * ОСОБЕННОСТИ: Показывает разницу параметров по таблице Трооста и расчет сахара и объема.
 */
'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Calculator, HelpCircle, Beaker, Scaling, Database } from "lucide-react";
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

const FormulChaptalizationMath: React.FC = () => {
    const t = useTranslations('Calculators.chaptalization');
    const commonT = useTranslations('Calculators');

    const colorSugar = "text-amber-600 dark:text-amber-400";
    const colorVol = "text-primary-600 dark:text-primary-400";

    const V = <span className={`font-mono font-black ${colorVol}`}>V<sub>(L)</sub></span>;
    const SugarDiff = <span className={`font-mono font-black ${colorSugar}`}>ΔS<sub>(g/l)</sub></span>;

    return (
        <Card className="w-full border-none shadow-2xl mt-8 overflow-hidden" radius="lg">
            <CardHeader className="flex gap-4 bg-brand-600 p-6 text-white">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Calculator size={32} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black tracking-tight">{commonT('formula.title')}</h2>
                    <p className="text-[10px] opacity-80 uppercase font-black tracking-[0.2em]">{commonT('standards.vinology')}</p>
                </div>
            </CardHeader>

            <CardBody className="p-0">
                <div className="bg-default-50/80 backdrop-blur-md border-b border-divider p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <VariableDisplay symbol={V} description={t('input-volume')} icon={<Beaker size={20} />} color="text-primary-500" />
                    <VariableDisplay symbol={SugarDiff} description={t('formula-desc-1')} icon={<Database size={20} />} color="text-amber-500" />
                </div>

                <div className="p-6 sm:p-10 space-y-16">
                    <section className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-amber-500 rounded-full" />
                            <h3 className="text-xl font-black uppercase tracking-tight text-default-800">
                                {t('result-sugar')}
                            </h3>
                            <Chip size="sm" variant="dot" color="warning" className="font-bold border-none">{commonT('formula.mass-calc')}</Chip>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 w-full">
                                <div className="flex justify-center items-center py-10 bg-white dark:bg-black/20 rounded-3xl border-2 border-divider shadow-inner overflow-x-auto">
                                    <div className="flex items-center text-3xl sm:text-5xl font-black">
                                        <span className="text-default-900 dark:text-default-100">kg</span>
                                        <span className="mx-4 text-default-300">=</span>
                                        <div className="flex items-center gap-2">
                                            <span>(</span>
                                            {V}
                                            <span className="text-default-300 mx-2">⋅</span>
                                            {SugarDiff}
                                            <span>) / 1000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-primary-500 rounded-full" />
                            <h3 className="text-xl font-black uppercase tracking-tight text-default-800">
                                {t('result-volume-increase')}
                            </h3>
                            <Chip size="sm" variant="dot" color="primary" className="font-bold border-none"><Scaling size={12} className="mr-1 inline"/> 0.63 L/kg</Chip>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 w-full">
                                <div className="flex justify-center items-center py-10 bg-white dark:bg-black/20 rounded-3xl border-2 border-divider shadow-inner overflow-x-auto">
                                    <div className="flex items-center text-3xl sm:text-5xl font-black">
                                        <span className="text-default-900 dark:text-default-100">L</span>
                                        <span className="mx-4 text-default-300">=</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-amber-600 dark:text-amber-400">kg</span>
                                            <span className="text-default-300 mx-2">⋅</span>
                                            <span>0.63</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 mb-3 text-zinc-500 font-black uppercase text-xs">
                                        <HelpCircle size={14} />
                                        <span>{t('formula-desc-2')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </CardBody>
        </Card>
    );
};

export default FormulChaptalizationMath;
