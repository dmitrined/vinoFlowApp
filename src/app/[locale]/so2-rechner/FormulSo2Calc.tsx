/**
 * НАЗНАЧЕНИЕ: Компонент калькулятора SO2 для расчета добавки серы.
 * ЗАВИСИМОСТИ: next-intl, HeroUI, calculations.ts, Lucide-react
 * ОСОБЕННОСТИ: Клиентский компонент, поддержка 3 типов продуктов (Газ, Порошок, Жидкость), i18n.
 */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardBody, Input, Tabs, Tab, Divider, Chip, Button } from "@heroui/react";
import { FlaskConical, Beaker, Wind, Calculator, Info, Eye, EyeOff } from "lucide-react";
import { calcSO2Addition } from '@/lib/calculations';
import { motion, AnimatePresence } from "framer-motion";
import FormulSo2Math from './FormulSo2Math';

const FormulSo2Calc: React.FC = () => {
    const t = useTranslations('Calculators.so2-calc');
    const commonT = useTranslations('Calculators');

    const [showFormula, setShowFormula] = useState<boolean>(false);
    const [volume, setVolume] = useState<string>('1000');
    const [deltaSO2, setDeltaSO2] = useState<string>('30');
    const [productType, setProductType] = useState<'gas' | 'powder' | 'liquid'>('gas');
    const [concentration, setConcentration] = useState<string>('100');

    // Автоматическая установка концентрации при смене типа
    const handleTypeChange = (key: React.Key) => {
        const type = key as 'gas' | 'powder' | 'liquid';
        setProductType(type);
        if (type === 'gas') setConcentration('100');
        else if (type === 'powder') setConcentration('50');
        else if (type === 'liquid') setConcentration('150');
    };

    const result = useMemo(() => {
        const v = parseFloat(volume);
        const d = parseFloat(deltaSO2);
        const c = parseFloat(concentration);
        return calcSO2Addition(v, d, productType, c);
    }, [volume, deltaSO2, productType, concentration]);

    const unit = productType === 'liquid' ? t('unit-ml') : t('unit-g');

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-6 md:px-0 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
            >
                <Card shadow="lg" className="border-none bg-gradient-to-br from-white to-default-50 dark:from-default-50 dark:to-default-100">
                    <CardHeader className="flex gap-4 p-6 italic hover:not-italic transition-all">
                        <div className="p-3 bg-wine-500/10 rounded-2xl text-wine-600 dark:text-wine-400">
                            <Calculator size={32} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-default-900">{t('title')}</h1>
                            <p className="text-sm text-default-500 font-medium">{t('subtitle')}</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-6 space-y-8">
                        {/* Тип продукта */}
                        <div className="flex flex-col gap-3">
                            <Tabs
                                fullWidth
                                radius="lg"
                                color="primary"
                                variant="underlined"
                                selectedKey={productType}
                                onSelectionChange={handleTypeChange}
                                classNames={{
                                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                                    cursor: "w-full bg-wine-600",
                                    tab: "max-w-fit px-0 h-12",
                                    tabContent: "group-data-[selected=true]:text-wine-600 font-black uppercase tracking-widest text-[10px] sm:text-xs"
                                }}
                            >
                                <Tab key="gas" title={
                                    <div className="flex items-center gap-2">
                                        <Wind size={16} className="text-zinc-400 group-data-[selected=true]:text-wine-600" />
                                        <span>{t('gas')}</span>
                                    </div>
                                } />
                                <Tab key="powder" title={
                                    <div className="flex items-center gap-2">
                                        <Beaker size={16} className="text-zinc-400 group-data-[selected=true]:text-wine-600" />
                                        <span>{t('powder')}</span>
                                    </div>
                                } />
                                <Tab key="liquid" title={
                                    <div className="flex items-center gap-2">
                                        <FlaskConical size={16} className="text-zinc-400 group-data-[selected=true]:text-wine-600" />
                                        <span>{t('liquid')}</span>
                                    </div>
                                } />
                            </Tabs>
                        </div>

                        {/* Поля ввода */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="number"
                                label={t('input-volume')}
                                placeholder="0"
                                value={volume}
                                onValueChange={setVolume}
                                variant="bordered"
                                labelPlacement="outside"
                                size="lg"
                                classNames={{
                                    inputWrapper: "border-default-200 hover:border-wine-500 focus-within:!border-wine-500 transition-colors",
                                    label: "font-bold text-default-700"
                                }}
                            />
                            <Input
                                type="number"
                                label={t('input-delta')}
                                placeholder="0"
                                value={deltaSO2}
                                onValueChange={setDeltaSO2}
                                variant="bordered"
                                labelPlacement="outside"
                                size="lg"
                                classNames={{
                                    inputWrapper: "border-default-200 hover:border-wine-500 focus-within:!border-wine-500 transition-colors",
                                    label: "font-bold text-default-700"
                                }}
                            />
                            <Input
                                type="number"
                                label={productType === 'liquid' ? t('input-liquid-conc') : t('input-powder-conc')}
                                placeholder="0"
                                value={concentration}
                                onValueChange={setConcentration}
                                variant="bordered"
                                labelPlacement="outside"
                                size="lg"
                                isReadOnly={productType !== 'liquid'}
                                className={productType !== 'liquid' ? "opacity-70 cursor-not-allowed" : ""}
                                classNames={{
                                    inputWrapper: `border-default-200 ${productType === 'liquid' ? 'hover:border-wine-500 focus-within:!border-wine-500' : ''} transition-colors`,
                                    label: "font-bold text-default-700"
                                }}
                                description={productType !== 'liquid' ? commonT('formula.standard') : undefined}
                            />
                        </div>

                        {/* Результат */}
                        <Card className="bg-wine-600 text-white shadow-wine-500/20 shadow-xl overflow-hidden border-none" radius="lg">
                            <CardBody className="p-8 relative overflow-hidden">
                                {/* Фоновая иконка */}
                                <Calculator size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <span className="text-wine-100 text-sm font-bold uppercase tracking-wider mb-2">
                                        {t('result')}
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {result > 0 ? result.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}
                                        </span>
                                        <span className="text-2xl font-bold text-wine-200 uppercase">
                                            {unit}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Инфо */}
                        <Card shadow="sm" className="bg-default-50 border-none">
                            <CardBody className="p-4 flex flex-row items-center gap-4">
                                <div className="p-2 bg-primary-500/10 rounded-full text-primary-600">
                                    <Info size={20} />
                                </div>
                                <p className="text-sm text-default-600 font-medium">
                                    {productType === 'gas' && t('formula-gas')}
                                    {productType === 'powder' && t('formula-powder')}
                                    {productType === 'liquid' && t('formula-liquid')}
                                </p>
                            </CardBody>
                        </Card>
                    </CardBody>

                    <Divider />

                    <CardBody className="p-4 flex flex-col items-center">
                        <Button
                            variant="light"
                            color="danger"
                            onPress={() => setShowFormula(!showFormula)}
                            startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
                            className="font-bold w-full"
                        >
                            {showFormula ? commonT('formula.hide') : commonT('formula.title')}
                        </Button>
                    </CardBody>
                </Card>
            </motion.div>

            <AnimatePresence>
                {showFormula && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <FormulSo2Math />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FormulSo2Calc;
