/**
 * НАЗНАЧЕНИЕ: Компонент для отображения формулы расчета Süßreserve (SR) в стиле Tech SaaS
 * ЗАВИСИМОСТИ: HeroUI, Lucide, next-intl
 * ОСОБЕННОСТИ: Профессиональный технический дизайн, использование символов и дробей
 */
'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Calculator, Info, Beaker, ChevronRight, Cpu } from "lucide-react";
import { useTranslations } from 'next-intl';

const FormulaVariable: React.FC<{
    symbol: React.ReactNode;
    description: string;
    unit: string;
    colorClass: string;
}> = ({ symbol, description, unit, colorClass }) => {
    const commonT = useTranslations('Calculators');
    return (
        <div className="flex items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 transition-all hover:border-brand-500/30 group">
            <div className={`text-xl font-black shrink-0 w-14 italic tracking-tighter ${colorClass}`}>
                {symbol}
            </div>
            <div className="flex flex-col gap-0.5 ml-2 text-left">
                <p className="text-zinc-600 dark:text-zinc-400 font-black text-[10px] uppercase tracking-tight leading-tight">
                    {description}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase opacity-40">{commonT('formula.unit-label')}</span>
                    <span className="text-[9px] font-black text-brand-600 uppercase">{unit}</span>
                </div>
            </div>
        </div>
    );
};

const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4 shrink-0">
        <div className="pb-1.5 border-b-2 sm:border-b-4 border-zinc-900 dark:border-zinc-100 w-full text-center">
            <span className="text-xl sm:text-3xl font-black italic tracking-tighter text-brand-600">
                ({numerator})
            </span>
        </div>
        <div className="pt-1.5 w-full text-center">
            <span className="text-xl sm:text-3xl font-black italic tracking-tighter text-zinc-400">
                ({denominator})
            </span>
        </div>
    </div>
);

const FormulSRCalc: React.FC = () => {
    const t = useTranslations('Calculators.sr-verschnitt');
    const commonT = useTranslations('Calculators');

    const L_SR = <span>L<sub>SR</sub></span>;
    const L_W = <span>L<sub>W</sub></span>;
    const G_SR = <span>g<sub>SR</sub></span>;
    const G_W = <span>g<sub>W</sub></span>;
    const G_Z = <span>g<sub>Ziel</sub></span>;
    const L_Gesamt = <span>L<sub>Gesamt</sub></span>;

    return (
        <Card className="bento-card border-none shadow-none mt-6" radius="lg">
            <CardHeader className="flex gap-4 p-8 sm:p-10">
                <div className="p-3 bg-brand-500/10 rounded-xl text-brand-600">
                    <Cpu size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase italic opacity-80">{commonT('formula.title')}</h2>
                    <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-widest opacity-60">{t('subtitle')}</p>
                </div>
            </CardHeader>

            <CardBody className="p-8 sm:p-10 space-y-12 pt-0">
                {/* --- Блок формулы --- */}
                <section className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 opacity-60 text-center">
                        {t('formula-desc')} ({L_SR})
                    </p>

                    <div className="flex justify-center items-center py-10 sm:py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 overflow-x-auto">
                        <div className="flex items-center text-3xl sm:text-5xl font-black italic tracking-tighter">
                            <span className="text-brand-600">{L_SR}</span>
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">=</span>
                            <span className="text-indigo-600">{L_W}</span>
                            <span className="mx-4 text-zinc-300 dark:text-zinc-700 font-normal">⋅</span>
                            <FractionDisplay numerator={<span>{G_Z} - {G_W}</span>} denominator={<span>{G_SR} - {G_Z}</span>} />
                        </div>
                    </div>
                </section>

                {/* --- Описание переменных --- */}
                <section className="pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3 mb-8 px-1">
                        <Info className="text-brand-600 opacity-60" size={18} />
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">
                            {commonT('formula.legend')}
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormulaVariable symbol={L_SR} colorClass="text-brand-600" unit="L" description={t('legend-lsr')} />
                        <FormulaVariable symbol={L_W} colorClass="text-indigo-600" unit="L" description={t('legend-lw')} />
                        <FormulaVariable symbol={G_SR} colorClass="text-zinc-500" unit="g/l" description={t('legend-gsr')} />
                        <FormulaVariable symbol={G_W} colorClass="text-zinc-500" unit="g/l" description={t('legend-gw')} />
                        <FormulaVariable symbol={G_Z} colorClass="text-brand-400" unit="g/l" description={t('legend-gz')} />
                    </div>
                </section>

                {/* --- Доп. формула общего объема --- */}
                <div className="p-6 bg-zinc-950 text-white rounded-[2rem] flex justify-between items-center shadow-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <Beaker size={18} className="text-brand-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('total-volume')}</span>
                    </div>
                    <div className="text-2xl font-black italic tracking-tighter">
                        {L_Gesamt} = {L_W} + {L_SR}
                    </div>
                </div>
            </CardBody>

            <div className="p-8 pt-0 text-center">
                <div className="flex items-center justify-center gap-3 text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
                    <span>{commonT('standards.precision')}</span>
                    <ChevronRight size={14} />
                    <span>{commonT('standards.vinology')}</span>
                </div>
            </div>
        </Card>
    );
};

export default FormulSRCalc;