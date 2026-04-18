/**
 * НАЗНАЧЕНИЕ: Компонент для отображения формул конвертации спирта в стиле Tech SaaS
 * ЗАВИСИМОСТИ: HeroUI, Lucide, next-intl
 * ОСОБЕННОСТИ: Обновленный дизайн под SaaS стилистику, технический минимализм
 */
'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { ArrowRightLeft, GlassWater, Milestone, Cpu } from "lucide-react";
import { useTranslations } from 'next-intl';

const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
    <div className="flex flex-col items-center mx-2 shrink-0">
        <div className="pb-1 border-b-2 border-zinc-900 dark:border-zinc-100 w-full text-center">
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter">
                {numerator}
            </span>
        </div>
        <div className="pt-1 w-full text-center">
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-zinc-400">
                {denominator}
            </span>
        </div>
    </div>
);

const FormulAlcCalculation: React.FC = () => {
    const t = useTranslations('Calculators.alkohol');
    
    const conversionFactor = 0.1267;
    const unit_GL = <span className="text-brand-600 font-black">G/L</span>;
    const unit_VOL = <span className="text-indigo-600 font-black">% VOL.</span>;

    return (
        <Card className="bento-card border-none shadow-none mt-6" radius="lg">
            <CardHeader className="flex gap-4 p-8">
                <div className="p-3 bg-brand-500/10 rounded-xl text-brand-600">
                    <Cpu size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase italic opacity-80">{t('title')}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Chip size="sm" variant="flat" className="bg-brand-500/10 text-brand-600 font-black uppercase text-[9px] border-none">
                            Factor: {conversionFactor}
                        </Chip>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="p-8 space-y-8 pt-0">
                {/* Секция 1: g/l -> % Vol. */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Milestone size={14} className="text-brand-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            {t('formula-gl-vol')}
                        </h3>
                    </div>

                    <div className="flex justify-center items-center py-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center text-2xl sm:text-3xl font-black italic tracking-tighter">
                            {unit_VOL}
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">=</span>
                            {unit_GL}
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">×</span>
                            <span className="text-zinc-900 dark:text-zinc-100">{conversionFactor}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center opacity-20">
                   <ArrowRightLeft size={20} className="rotate-90 sm:rotate-0" />
                </div>

                {/* Секция 2: % Vol. -> g/l */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <GlassWater size={14} className="text-brand-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            {t('formula-vol-gl')}
                        </h3>
                    </div>

                    <div className="flex justify-center items-center py-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center text-2xl sm:text-3xl font-black italic tracking-tighter">
                            {unit_GL}
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">=</span>
                            <FractionDisplay numerator={unit_VOL} denominator={conversionFactor} />
                        </div>
                    </div>
                </div>
            </CardBody>

            <div className="p-8 pt-0 text-center">
                <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] opacity-40">
                    {t('footer-tag')}
                </p>
            </div>
        </Card>
    );
};

export default FormulAlcCalculation;