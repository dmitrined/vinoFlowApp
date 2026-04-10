/**
 * НАЗНАЧЕНИЕ: Компонент математической формулы для мульти-купажа в стиле Tech SaaS
 * ЗАВИСИМОСТИ: HeroUI, Lucide, next-intl
 * ОСОБЕННОСТИ: Профессиональный технический дизайн, мульти-параметрические расчеты
 */
'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";
import { Info, Layers, Beaker, MoveRight, Cpu } from "lucide-react";
import { useTranslations } from 'next-intl';

const FormulMultiCalc: React.FC = () => {
    const t = useTranslations('Calculators.mehrfach');
    const commonT = useTranslations('Calculators');

    return (
        <Card className="bento-card border-none shadow-none mt-6" radius="lg">
            <CardHeader className="flex gap-4 p-8 sm:p-10">
                <div className="p-3 bg-brand-500/10 rounded-xl text-brand-600">
                    <Cpu size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase italic opacity-80">{t('formula-title')}</h2>
                    <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-widest opacity-60">{t('formula-type')}</p>
                </div>
            </CardHeader>

            <CardBody className="p-8 sm:p-10 space-y-12 pt-0">
                <section className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 opacity-60 text-center">
                        {t('formula-desc')}
                    </p>

                    {/* Визуализация формулы */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative overflow-x-auto pb-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 p-8 sm:p-12">
                            <div className="flex items-center justify-center min-w-max gap-6 text-2xl sm:text-4xl font-black italic tracking-tighter">

                                <div className="flex flex-col items-center">
                                    <span className="text-brand-600">P<sub>Ges</sub></span>
                                </div>

                                <span className="text-zinc-300 dark:text-zinc-700 font-normal">=</span>

                                <div className="flex flex-col items-center">
                                    {/* Числитель */}
                                    <div className="px-8 pb-4 border-b-2 sm:border-b-4 border-zinc-900 dark:border-zinc-100">
                                        <span className="text-brand-600">(L₁⋅P₁)</span>
                                        <span className="mx-3 text-zinc-300 dark:text-zinc-700 font-normal">+</span>
                                        <span className="text-indigo-600">(L₂⋅P₂)</span>
                                        <span className="mx-3 text-zinc-300 dark:text-zinc-700 font-normal">+</span>
                                        <span className="text-zinc-400">...</span>
                                        <span className="mx-3 text-zinc-300 dark:text-zinc-700 font-normal">+</span>
                                        <span className="text-zinc-500">(L<sub>n</sub>⋅P<sub>n</sub>)</span>
                                    </div>

                                    {/* Знаменатель */}
                                    <div className="px-8 pt-4 text-zinc-400 italic">
                                        L₁ + L₂ + ... + L<sub>n</sub>
                                    </div>
                                </div>
                            </div>

                            {/* Индикатор скролла для мобилок */}
                            <div className="flex justify-center mt-6 sm:hidden">
                                <Chip size="sm" variant="flat" className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-black uppercase text-[9px] border-none tracking-widest animate-pulse">
                                    {commonT('formula.swipe')}
                                </Chip>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Легенда */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-1">
                            <Info size={18} className="text-brand-600 opacity-60" />
                            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">{commonT('formula.legend')}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { sym: 'L', desc: t('legend-l'), unit: 'Liter', color: 'text-brand-600' },
                                { sym: 'P', desc: t('legend-p'), unit: 'g/l', color: 'text-indigo-600' },
                                { sym: 'n', desc: t('legend-n'), unit: 'Count', color: 'text-zinc-500' }
                            ].map((item) => (
                                <div key={item.sym} className="flex items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 transition-all hover:border-brand-500/30 group">
                                    <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm font-black text-xl italic tracking-tighter ${item.color} group-hover:scale-110 transition-transform`}>
                                        {item.sym}
                                    </div>
                                    <div className="flex flex-col ml-4 text-left">
                                        <span className="text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 tracking-tight leading-tight">{item.desc}</span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase opacity-40">{commonT('formula.unit-label')}</span>
                                            <span className="text-[9px] font-black text-brand-600 uppercase">{item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Логика */}
                    <Card shadow="none" className="bg-zinc-950 text-white rounded-[2.5rem] p-4 flex flex-col justify-center border border-white/5">
                        <CardBody className="gap-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-500/10 rounded-xl">
                                    <Beaker size={20} className="text-brand-400" />
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-widest text-zinc-400 opacity-80">{t('formula-logic')}</h4>
                            </div>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed italic">
                                {t('formula-logic-desc')}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-brand-500 uppercase tracking-widest mt-4">
                                <MoveRight size={14} />
                                <span>{t('logic-tag')}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </CardBody>

            <div className="p-8 pt-0 text-center">
                <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.3em] opacity-30 italic">
                    {t('footer-tag')}
                </p>
            </div>
        </Card>
    );
};

export default FormulMultiCalc;