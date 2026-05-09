/**
 * НАЗНАЧЕНИЕ: Калькулятор управления кислотностью (подкисление/раскисление)
 * ЗАВИСИМОСТИ: @/lib/calculations, @/hooks/useHistoryAutoSave, @heroui/react
 * ОСОБЕННОСТИ: Автоматическое переключение режима (acid/base), сохранение истории, поддержка i18n
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardBody, Input, RadioGroup, Radio } from "@heroui/react";
import { Droplet, Info, Zap } from "lucide-react";
import { m } from "framer-motion";
import { WINE_CONSTANTS, calcAcidManagement } from '@/lib/calculations';

type AcidAgent = keyof typeof WINE_CONSTANTS.ACID_MANAGEMENT.COEFFICIENTS;

export default function AcidManagementCalc() {
    const t = useTranslations('Calculators.acid-management');
    const locale = useLocale();

    const [volume, setVolume] = useState<string>('1000');
    const [currentTa, setCurrentTa] = useState<string>('5.0');
    const [targetTa, setTargetTa] = useState<string>('6.5');
    const [agent, setAgent] = useState<AcidAgent>('tartaric');

    const mode = useMemo(() => {
        const c = parseFloat(currentTa) || 0;
        const target = parseFloat(targetTa) || 0;
        return target >= c ? 'acidification' : 'deacidification';
    }, [currentTa, targetTa]);

    useEffect(() => {
        if (mode === 'acidification') {
            setAgent('tartaric');
        } else {
            setAgent('potassium');
        }
    }, [mode]);

    const activeCoeff = useMemo(() => {
        const c = WINE_CONSTANTS.ACID_MANAGEMENT.COEFFICIENTS;
        return c[agent] || 1.0;
    }, [agent]);

    const result = useMemo(() => {
        const v = parseFloat(volume) || 0;
        const c = parseFloat(currentTa) || 0;
        const target = parseFloat(targetTa) || 0;
        
        return calcAcidManagement(v, c, target, agent);
    }, [volume, currentTa, targetTa, agent]);


    
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <Card className="bento-card border-none shadow-none">
                    <CardHeader className="flex gap-3 sm:gap-5 p-4 sm:p-8">
                        <div className="p-2 sm:p-4 bg-brand-600 text-white rounded-xl sm:rounded-2xl shadow-xl shadow-brand-500/20 shrink-0">
                            <Droplet size={24} className="sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex flex-col text-left min-w-0 justify-center">
                            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-tech-gradient uppercase italic leading-tight">
                                {t('title')}
                            </h1>
                            <p className="text-[9px] sm:text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60 leading-tight mt-0.5">
                                {t('subtitle')}
                            </p>
                        </div>
                    </CardHeader>

                    <CardBody className="p-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Input
                                type="number"
                                label={t('input-volume')}
                                value={volume}
                                onValueChange={setVolume}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                            <Input
                                type="number"
                                label={t('input-current-ta')}
                                value={currentTa}
                                onValueChange={setCurrentTa}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                            <Input
                                type="number"
                                label={t('input-target-ta')}
                                value={targetTa}
                                onValueChange={setTargetTa}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                classNames={{
                                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="font-black uppercase text-[11px] tracking-widest text-brand-500">
                                {t('mode')} {mode === 'acidification' ? t('acidification') : t('deacidification')}
                            </p>
                            <RadioGroup
                                label={t('agent')}
                                value={agent}
                                onValueChange={(val) => setAgent(val as AcidAgent)}
                                orientation="horizontal"
                                classNames={{
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            >
                                {mode === 'acidification' ? (
                                    <>
                                        <Radio value="tartaric" classNames={{ label: "text-sm font-bold pt-1" }}>{t('acid-tartaric')}</Radio>
                                        <Radio value="malic" classNames={{ label: "text-sm font-bold pt-1" }}>{t('acid-malic')}</Radio>
                                        <Radio value="lactic" classNames={{ label: "text-sm font-bold pt-1" }}>{t('acid-lactic')}</Radio>
                                        <Radio value="citric" classNames={{ label: "text-sm font-bold pt-1" }}>{t('acid-citric')}</Radio>
                                    </>
                                ) : (
                                    <>
                                        <Radio value="potassium" classNames={{ label: "text-sm font-bold pt-1" }}>{t('base-potassium')}</Radio>
                                        <Radio value="calcium" classNames={{ label: "text-sm font-bold pt-1" }}>{t('base-calcium')}</Radio>
                                    </>
                                )}
                            </RadioGroup>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative bg-zinc-950 text-white border-none overflow-hidden h-40 flex items-center justify-center rounded-[2.5rem]" shadow="none">
                                <CardBody className="p-0 flex flex-col items-center justify-center relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 ml-[0.3em] text-center px-4">
                                        {t('result-addition')}
                                    </span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-6xl font-black tracking-tighter text-white">
                                            {result > 0 ? result.toLocaleString(locale, { maximumFractionDigits: 1 }) : '0'}
                                        </span>
                                        <span className="text-xl font-black text-brand-500 italic lowercase">
                                            g
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 text-[9px] uppercase tracking-[0.2em] text-zinc-400/80 font-bold px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
                                        {t(mode === 'acidification' 
                                            ? (['tartaric', 'malic', 'lactic', 'citric'].includes(agent) ? `acid-${agent}` : 'acid-tartaric') 
                                            : (['potassium', 'calcium'].includes(agent) ? `base-${agent}` : 'base-potassium'))}: {activeCoeff}g / 1 g/L TA
                                    </div>
                                </CardBody>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Zap size={80} />
                                </div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-600/20 rounded-full blur-3xl"></div>
                            </Card>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30">
                            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400 shrink-0">
                                <Info size={18} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs text-orange-700 dark:text-orange-300 font-bold uppercase tracking-tight text-left">
                                    {t('alert-trial')}
                                </p>
                                {(agent === 'tartaric' || agent === 'citric') && (
                                    <p className="text-[11px] text-orange-700/80 dark:text-orange-300/80 font-medium text-left">
                                        {agent === 'tartaric' ? t('warn-tartaric') : t('warn-citric')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </m.div>
        </div>
    );
}
