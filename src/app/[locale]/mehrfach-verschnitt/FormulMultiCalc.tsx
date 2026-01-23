'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";
import { Info, Layers, Beaker, MoveRight } from "lucide-react";
import { useTranslations } from 'next-intl';

/**
 * Компонент математической формулы для мульти-купажа.
 * Рассчитывает средневзвешенное значение параметров (сахар/алкоголь).
 */
const FormulMultiCalc: React.FC = () => {
    const t = useTranslations('Calculators.mehrfach');
    const commonT = useTranslations('Calculators');

    return (
        <Card className="w-full max-w-4xl mx-auto my-6 border-none shadow-2xl" radius="lg">
            <CardHeader className="flex gap-4 bg-indigo-500/10 p-5 sm:p-6">
                <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                    <Layers size={24} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {t('formula-title')}
                    </h2>
                    <p className="text-default-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">
                        {t('formula-type')}
                    </p>
                </div>
            </CardHeader>

            <Divider />

            <CardBody className="p-4 sm:p-10 space-y-10">
                <section>
                    <p className="text-center text-default-500 mb-8 italic text-xs sm:text-base">
                        {t('formula-desc')}
                    </p>

                    {/* Визуализация формулы */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-teal-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative overflow-x-auto pb-6 bg-default-50 dark:bg-black/20 rounded-3xl border border-default-200 p-6 sm:p-10">
                            <div className="flex items-center justify-center min-w-max gap-4 text-xl sm:text-4xl font-mono font-black text-default-800 dark:text-default-100">

                                <div className="flex flex-col items-center">
                                    <span className="text-indigo-500 italic">P<sub>Ges</sub></span>
                                </div>

                                <span className="text-default-400 font-light">=</span>

                                <div className="flex flex-col items-center">
                                    {/* Числитель */}
                                    <div className="px-6 pb-4 border-b-3 sm:border-b-4 border-default-800 dark:border-default-100">
                                        <span className="text-indigo-600">(L₁·P₁)</span>
                                        <span className="mx-2 text-default-400 text-2xl">+</span>
                                        <span className="text-teal-600">(L₂·P₂)</span>
                                        <span className="mx-2 text-default-400 text-2xl">+</span>
                                        <span className="text-default-400">...</span>
                                        <span className="mx-2 text-default-400 text-2xl">+</span>
                                        <span className="text-secondary-500">(L<sub>n</sub>·P<sub>n</sub>)</span>
                                    </div>

                                    {/* Знаменатель */}
                                    <div className="px-6 pt-4 text-default-500">
                                        L₁ + L₂ + ... + L<sub>n</sub>
                                    </div>
                                </div>
                            </div>

                            {/* Индикатор скролла для мобилок */}
                            <div className="flex justify-center mt-4 sm:hidden">
                                <Chip size="sm" variant="flat" color="default" className="animate-pulse text-[10px]">
                                    {commonT('formula.swipe')}
                                </Chip>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Легенда */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Info size={18} className="text-indigo-500" />
                            <h3 className="font-black text-sm uppercase tracking-widest text-default-600">{commonT('formula.legend')}</h3>
                        </div>

                        <div className="space-y-3">
                            {[
                                { sym: 'L', desc: t('legend-l'), unit: 'Liter', color: 'bg-indigo-100 text-indigo-600' },
                                { sym: 'P', desc: t('legend-p'), unit: 'g/l', color: 'bg-teal-100 text-teal-600' },
                                { sym: 'n', desc: t('legend-n'), unit: 'Count', color: 'bg-default-200 text-default-700' }
                            ].map((item) => (
                                <div key={item.sym} className="flex items-center gap-4 p-3 rounded-xl border border-default-100 hover:bg-default-50 transition-colors">
                                    <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg font-black text-xl ${item.color}`}>
                                        {item.sym}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-default-700">{item.desc}</span>
                                        <span className="text-[10px] text-default-400 uppercase font-bold tracking-tighter">{commonT('formula.unit-label')} {item.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Логика */}
                    <Card shadow="none" className="bg-indigo-500/5 border border-indigo-500/10 p-2">
                        <CardBody className="gap-4">
                            <div className="flex items-center gap-2">
                                <Beaker size={20} className="text-indigo-500" />
                                <h4 className="font-black text-sm uppercase text-indigo-600">{t('formula-logic')}</h4>
                            </div>
                            <p className="text-default-600 text-sm leading-relaxed">
                                {t('formula-logic-desc')}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 mt-2">
                                <MoveRight size={14} />
                                <span>{t('logic-tag')}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </CardBody>

            <Divider />

            <div className="p-4 bg-default-50 dark:bg-default-100/5 text-center">
                <p className="text-[10px] sm:text-xs text-default-400 font-medium uppercase tracking-[0.3em]">
                    {t('footer-tag')}
                </p>
            </div>
        </Card>
    );
};

export default FormulMultiCalc;