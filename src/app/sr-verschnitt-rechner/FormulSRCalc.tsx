'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";
import { Calculator, Info, Beaker, ChevronRight } from "lucide-react";

/**
 * Компонент для отображения формулы расчета Süßreserve (SR) в вине.
 * Полностью адаптирован под мобильные устройства и HeroUI.
 */
const FormulSRCalc: React.FC = () => {
    // Математические символы с индексами
    const L_SR = <span className="font-mono">L<sub>SR</sub></span>;
    const L_W = <span className="font-mono">L<sub>W</sub></span>;
    const G_SR = <span className="font-mono">g<sub>SR</sub></span>;
    const G_W = <span className="font-mono">g<sub>W</sub></span>;
    const G_Z = <span className="font-mono">g<sub>Ziel</sub></span>;
    const L_Gesamt = <span className="font-mono">L<sub>Gesamt</sub></span>;

    // Вспомогательный компонент для легенды переменных
    const FormulaVariable: React.FC<{
        symbol: React.ReactNode;
        description: string;
        unit: string;
        colorClass: string;
    }> = ({ symbol, description, unit, colorClass }) => (
        <div className="flex items-start gap-3 p-3 bg-default-50 dark:bg-default-100/50 rounded-xl border border-default-200 transition-all hover:border-teal-500/50">
            <div className={`text-xl sm:text-2xl font-black shrink-0 w-12 sm:w-16 ${colorClass}`}>
                {symbol}
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-default-700 dark:text-default-300 font-bold text-xs sm:text-sm leading-tight">
                    {description}
                </p>
                <Chip size="sm" variant="flat" className="h-5 text-[10px] uppercase font-bold px-1">
                    Einheit: {unit}
                </Chip>
            </div>
        </div>
    );

    return (
        <Card className="w-full max-w-2xl mx-auto my-6 border-none shadow-xl" radius="lg">
            <CardHeader className="flex gap-3 bg-teal-500/10 p-5 sm:p-6 text-left">
                <div className="p-2 bg-teal-500 rounded-lg text-white">
                    <Calculator size={24} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">
                        Verschnittberechnung
                    </h2>
                    <p className="text-default-500 text-[11px] sm:text-xs uppercase tracking-wider font-bold">
                        Mischungsregel (Alligation)
                    </p>
                </div>
            </CardHeader>
            
            <Divider />

            <CardBody className="p-4 sm:p-8 space-y-8">
                {/* --- Блок формулы --- */}
                <section>
                    <p className="text-default-500 mb-6 text-xs sm:text-base italic text-center px-2">
                        Bestimmung des benötigten Volumens der Süßreserve ({L_SR})
                    </p>

                    <div className="flex justify-center items-center py-8 sm:py-12 px-2 bg-default-50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-teal-500/30 overflow-x-auto overflow-y-hidden">
                        <div className="flex items-center text-2xl sm:text-5xl font-black tracking-tighter sm:tracking-normal">
                            <span className="text-danger-500">{L_SR}</span>
                            <span className="mx-2 text-default-400">=</span>
                            <span className="text-primary-500">{L_W}</span>
                            <span className="mx-2 text-default-400">⋅</span>
                            
                            {/* Дробь */}
                            <div className="flex flex-col items-center mx-1 shrink-0">
                                <div className="pb-1.5 border-b-2 sm:border-b-4 border-default-900 dark:border-default-100 w-full text-center">
                                    <span className="text-lg sm:text-3xl font-mono text-pink-600">
                                        ({G_Z} - {G_W})
                                    </span>
                                </div>
                                <div className="pt-1.5 w-full text-center">
                                    <span className="text-lg sm:text-3xl font-mono text-secondary-600">
                                        ({G_SR} - {G_Z})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Описание переменных --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={18} className="text-teal-500" />
                        <h3 className="font-black text-sm sm:text-md uppercase tracking-widest text-default-600">
                            Legende
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <FormulaVariable 
                            symbol={L_SR} 
                            colorClass="text-danger-500"
                            unit="L"
                            description="Benötigtes Volumen der Süßreserve."
                        />
                        <FormulaVariable 
                            symbol={L_W} 
                            colorClass="text-primary-500"
                            unit="L"
                            description="Verfügbares Volumen des Grundweins."
                        />
                        <FormulaVariable 
                            symbol={G_SR} 
                            colorClass="text-secondary-600"
                            unit="g/l"
                            description="Zuckergehalt der Süßreserve."
                        />
                        <FormulaVariable 
                            symbol={G_W} 
                            colorClass="text-orange-500"
                            unit="g/l"
                            description="Zuckergehalt основного вина."
                        />
                        <FormulaVariable 
                            symbol={G_Z} 
                            colorClass="text-pink-600"
                            unit="g/l"
                            description="Angestrebter Ziel-Zuckergehalt."
                        />
                    </div>
                </section>

                {/* --- Доп. формула общего объема --- */}
                <Card shadow="none" className="bg-teal-500/5 border border-teal-500/20">
                    <CardBody className="p-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Beaker size={20} className="text-teal-500" />
                                <span className="font-bold text-sm">Gesamtvolumen</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-mono font-black text-default-800">
                                {L_Gesamt} = {L_W} + {L_SR}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </CardBody>

            <div className="bg-default-50 dark:bg-default-100/10 p-4 rounded-b-2xl">
                <div className="flex items-center justify-center gap-2 text-default-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    <span>Precision calculation</span>
                    <ChevronRight size={12} />
                    <span>Vinology Standard</span>
                </div>
            </div>
        </Card>
    );
};

export default FormulSRCalc;