'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";
import { Calculator, ArrowRightLeft, GlassWater, Milestone } from "lucide-react";

/**
 * Компонент для отображения формул конвертации спирта (g/l <-> % Vol.)
 * Адаптирован под мобильные устройства с использованием HeroUI.
 */
const FormulAlcCalculation: React.FC = () => {
    
    const conversionFactor = 0.1267;
    const unit_GL = <span className="text-primary-600 dark:text-primary-400 font-bold">g/l</span>;
    const unit_VOL = <span className="text-secondary-600 dark:text-secondary-400 font-bold">% Vol.</span>;

    // Вспомогательный компонент для визуальной дроби
    const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
        <div className="flex flex-col items-center mx-2 shrink-0">
            <div className="pb-1 border-b-2 sm:border-b-4 border-default-900 dark:border-default-100 w-full text-center">
                <span className="text-xl sm:text-3xl font-mono">
                    {numerator}
                </span>
            </div>
            <div className="pt-1 w-full text-center">
                <span className="text-xl sm:text-3xl font-mono text-default-500">
                    {denominator}
                </span>
            </div>
        </div>
    );

    return (
        <Card className="w-full max-w-2xl mx-auto my-6 border-none shadow-xl" radius="lg">
            <CardHeader className="flex gap-3 bg-default-50 dark:bg-default-100/20 p-5 sm:p-6">
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
                    <Calculator size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <h2 className="text-xl sm:text-2xl font-black">Alkohol-Konvertierung</h2>
                    <div className="flex items-center gap-2">
                         <Chip size="sm" variant="flat" color="primary" className="h-5 text-[10px] font-bold">
                            Faktor: {conversionFactor}
                         </Chip>
                    </div>
                </div>
            </CardHeader>
            
            <Divider />

            <CardBody className="p-4 sm:p-8 space-y-6">
                
                {/* Секция 1: g/l -> % Vol. */}
                <Card shadow="sm" className="bg-default-50/50 border border-default-100 overflow-hidden">
                    <CardBody className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-indigo-500/10 rounded-md text-indigo-500">
                                <Milestone size={18} />
                            </div>
                            <h3 className="text-sm sm:text-lg font-bold text-default-700">
                                1. Gramm/Liter in % Volumen
                            </h3>
                        </div>

                        <div className="flex justify-center items-center py-4 bg-white dark:bg-black/20 rounded-xl border border-default-200">
                            <div className="flex items-center text-xl sm:text-3xl font-mono font-bold tracking-tighter sm:tracking-normal">
                                {unit_VOL}
                                <span className="mx-2 text-default-400">=</span>
                                {unit_GL}
                                <span className="mx-2 text-default-400">×</span>
                                <span className="text-default-900 dark:text-default-100">{conversionFactor}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex justify-center -my-3 relative z-10">
                    <div className="bg-background p-2 rounded-full border-2 border-default-100 shadow-sm">
                        <ArrowRightLeft size={20} className="text-default-400 rotate-90 sm:rotate-0" />
                    </div>
                </div>

                {/* Секция 2: % Vol. -> g/l */}
                <Card shadow="sm" className="bg-default-50/50 border border-default-100 overflow-hidden">
                    <CardBody className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-success-500/10 rounded-md text-success-500">
                                <GlassWater size={18} />
                            </div>
                            <h3 className="text-sm sm:text-lg font-bold text-default-700">
                                2. % Volumen in Gramm/Liter
                            </h3>
                        </div>

                        <div className="flex justify-center items-center py-4 bg-white dark:bg-black/20 rounded-xl border border-default-200">
                            <div className="flex items-center text-xl sm:text-3xl font-mono font-bold tracking-tighter sm:tracking-normal">
                                {unit_GL}
                                <span className="mx-2 text-default-400">=</span>
                                <FractionDisplay numerator={unit_VOL} denominator={conversionFactor} />
                            </div>
                        </div>
                    </CardBody>
                </Card>

            </CardBody>

            <div className="bg-default-50 dark:bg-default-100/10 p-4 text-center">
                <p className="text-[11px] sm:text-xs text-default-400 font-medium uppercase tracking-widest">
                    Standard-Konvertierungsfaktor für Kellerwirtschaft
                </p>
            </div>
        </Card>
    );
};

export default FormulAlcCalculation;