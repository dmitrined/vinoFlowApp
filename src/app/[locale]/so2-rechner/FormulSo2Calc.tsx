/**
 * НАЗНАЧЕНИЕ: Компонент калькулятора SO2 в стиле Tech SaaS
 * ЗАВИСИМОСТИ: next-intl, HeroUI, calculations.ts, Lucide-react
 * ОСОБЕННОСТИ: Клиентский компонент, поддержка 3 типов продуктов, i18n, Tech UI дизайн.
 */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardBody, Input, Button } from "@heroui/react";
import { Info, Eye, EyeOff, Zap, Wine } from "lucide-react";
import ProductTypeSelector from '@/components/ui/ProductTypeSelector';
import { calcSO2Addition, WINE_CONSTANTS } from '@/lib/calculations';
import { m, AnimatePresence } from "framer-motion";
import FormulSo2Math from './FormulSo2Math';
import { ProductType } from '@/types/calculations';

const FormulSo2Calc: React.FC = () => {
    const t = useTranslations('Calculators.so2-calc');
    const commonT = useTranslations('Calculators');

    const [showFormula, setShowFormula] = useState<boolean>(false);
    const [volume, setVolume] = useState<string>('1000');
    const [deltaSO2, setDeltaSO2] = useState<string>('30');
    const [productType, setProductType] = useState<ProductType>('gas');
    const [concentration, setConcentration] = useState<string>(WINE_CONSTANTS.SO2_DEFAULTS.gas.toString());

    const handleTypeChange = (key: React.Key) => {
        const type = key as ProductType;
        setProductType(type);
        if (type === 'gas') setConcentration(WINE_CONSTANTS.SO2_DEFAULTS.gas.toString());
        else if (type === 'powder') setConcentration(WINE_CONSTANTS.SO2_DEFAULTS.powder.toString());
        else if (type === 'liquid') setConcentration(WINE_CONSTANTS.SO2_DEFAULTS.liquid.toString());
    };

    const result = useMemo(() => {
        const v = parseFloat(volume);
        const d = parseFloat(deltaSO2);
        const c = parseFloat(concentration);
        return calcSO2Addition(v, d, productType, c);
    }, [volume, deltaSO2, productType, concentration]);

    const unit = productType === 'liquid' ? t('unit-ml') : t('unit-g');

    // Авто-сохранение в историю через хук (задержка 3с)
    
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
                            <Wine size={24} className="sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-tech-gradient uppercase italic leading-tight">{t('title')}</h1>
                            <p className="text-[10px] sm:text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">{t('subtitle')}</p>
                        </div>
                    </CardHeader>
                    
                    <CardBody className="p-8 space-y-10">
                        {/* Тип продукта - Modern Toggle */}
                        {/* Тип продукта - Modern Toggle */}
                        <div className="flex flex-col gap-4">
                            <ProductTypeSelector 
                                selectedKey={productType}
                                onSelectionChange={handleTypeChange}
                            />
                        </div>

                        {/* Поля ввода - Clean Modern Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                label={t('input-delta')}
                                value={deltaSO2}
                                onValueChange={setDeltaSO2}
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
                                label={productType === 'liquid' ? t('input-liquid-conc') : t('input-powder-conc')}
                                value={concentration}
                                onValueChange={setConcentration}
                                variant="flat"
                                labelPlacement="outside"
                                size="lg"
                                radius="lg"
                                isReadOnly={productType !== 'liquid'}
                                classNames={{
                                    inputWrapper: `bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent ${productType === 'liquid' ? 'group-data-[focus=true]:border-brand-500' : 'opacity-60'} transition-all`,
                                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                                }}
                            />
                        </div>

                        {/* Результат - Hero Action Style */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative bg-zinc-950 text-white border-none overflow-hidden h-40 flex items-center justify-center rounded-[2.5rem]" shadow="none">
                                <CardBody className="p-0 flex flex-col items-center justify-center relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 ml-[0.3em]">
                                        {t('result')}
                                    </span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-6xl font-black tracking-tighter text-white">
                                            {result > 0 ? result.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}
                                        </span>
                                        <span className="text-xl font-black text-brand-500 uppercase italic">
                                            {unit}
                                        </span>
                                    </div>
                                </CardBody>
                                {/* Futuristic background elements */}
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Zap size={80} />
                                </div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-600/20 rounded-full blur-3xl"></div>
                            </Card>
                        </div>

                        {/* Инфо - Minimal SaaS Style */}
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-600">
                                <Info size={18} />
                            </div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight text-left">
                                {productType === 'gas' && t('formula-gas')}
                                {productType === 'powder' && t('formula-powder')}
                                {productType === 'liquid' && t('formula-liquid')}
                            </p>
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
                        <FormulSo2Math />
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FormulSo2Calc;
