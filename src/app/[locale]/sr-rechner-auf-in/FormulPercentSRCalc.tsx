/**
 * НАЗНАЧЕНИЕ: Компонент для отображения формул SR Rechner в стиле Tech SaaS
 * ЗАВИСИМОСТИ: HeroUI, Lucide, next-intl
 * ОСОБЕННОСТИ: Профессиональный технический дизайн, использование символов и дробей
 */
'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Calculator, Info, Beaker, Percent, Cpu } from "lucide-react";
import { useTranslations } from 'next-intl';

const VariableDisplay: React.FC<{ symbol: React.ReactNode; description: string; icon: React.ReactNode }> = ({ symbol, description, icon }) => (
    <div className="flex items-center p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 transition-all hover:border-brand-500/30 group">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm mr-5 text-brand-600 transition-transform group-hover:scale-110 group-hover:rotate-12">
            {icon}
        </div>
        <div className="flex-none w-16 text-xl font-black italic tracking-tighter text-brand-600">
            {symbol}
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-black uppercase tracking-tight leading-tight">
            {description}
        </p>
    </div>
);

const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
    <div className="flex flex-col items-center mx-4 shrink-0">
        <div className="pb-1 border-b-2 border-zinc-900 dark:border-zinc-100 w-full text-center">
            <span className="text-2xl sm:text-4xl font-black italic tracking-tighter text-indigo-600">
                {numerator}
            </span>
        </div>
        <div className="pt-1 w-full text-center">
            <span className="text-2xl sm:text-4xl font-black italic tracking-tighter text-zinc-400">
                {denominator}
            </span>
        </div>
    </div>
);

const FormulPercentSRCalc: React.FC = () => {
    const t = useTranslations('Calculators.sr-rechner');
    const commonT = useTranslations('Calculators');

    const L_SR = <span>L<sub>SR</sub></span>;
    const L_W = <span>L<sub>W</sub></span>;
    const P_SR = <span>%<sub>SR</sub></span>;

    return (
        <Card className="bento-card border-none shadow-none mt-6" radius="lg">
            <CardHeader className="flex gap-4 p-8">
                <div className="p-3 bg-brand-500/10 rounded-xl text-brand-600">
                    <Cpu size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase italic opacity-80">{commonT('formula.title')}</h2>
                    <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-widest opacity-60">{t('subtitle')}</p>
                </div>
            </CardHeader>

            <CardBody className="p-8 space-y-12 pt-0">
                {/* --- Секция 1: SR % auf --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Chip variant="flat" className="bg-brand-500/10 text-brand-600 font-black uppercase text-[9px] border-none h-6">{t('auf')}</Chip>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 opacity-60">
                        {t('formula-auf')}
                    </p>
                    <div className="flex justify-center items-center py-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center text-3xl sm:text-5xl font-black italic tracking-tighter">
                            {L_SR}
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">=</span>
                            <FractionDisplay numerator={P_SR} denominator="100" />
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">⋅</span>
                            {L_W}
                        </div>
                    </div>
                </section>

                {/* --- Секция 2: SR % in --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Chip variant="flat" className="bg-indigo-500/10 text-indigo-600 font-black uppercase text-[9px] border-none h-6">{t('in')}</Chip>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 opacity-60">
                        {t('formula-in')}
                    </p>
                    <div className="flex justify-center items-center py-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center text-3xl sm:text-5xl font-black italic tracking-tighter">
                            {L_SR}
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">=</span>
                            <FractionDisplay numerator={P_SR} denominator={<span>100 - {P_SR}</span>} />
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">⋅</span>
                            {L_W}
                        </div>
                    </div>
                </section>

                {/* --- Легенда --- */}
                <section className="pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <Info className="text-brand-600 opacity-60" size={18} />
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">
                            {commonT('formula.legend')}
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <VariableDisplay
                            symbol={L_SR}
                            icon={<Beaker size={20} />}
                            description={t('legend-lsr')}
                        />
                        <VariableDisplay
                            symbol={P_SR}
                            icon={<Percent size={20} />}
                            description={t('legend-psr')}
                        />
                        <VariableDisplay
                            symbol={L_W}
                            icon={<Beaker size={20} className="rotate-180" />}
                            description={t('legend-lw')}
                        />
                    </div>
                </section>
            </CardBody>
        </Card>
    );
};

export default FormulPercentSRCalc;