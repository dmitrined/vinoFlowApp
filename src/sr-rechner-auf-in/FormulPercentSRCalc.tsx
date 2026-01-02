'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";
import { Calculator, Info, Beaker, Percent } from "lucide-react";

/**
 * Компонент для отображения формул расчета Süßreserve (SR) в процентах.
 * Использует HeroUI и Lucide для профессионального интерфейса.
 */
const FormulPercentSRCalc: React.FC = () => {
    // Вспомогательные элементы
    const L_SR = <span className="font-mono">L<sub>SR</sub></span>;
    const L_W = <span className="font-mono">L<sub>W</sub></span>;
    const P_SR = <span className="font-mono">%<sub>SR</sub></span>;

    // Компонент отображения переменной (Description Row)
    const VariableDisplay: React.FC<{ symbol: React.ReactNode; description: string; icon: React.ReactNode }> = ({ symbol, description, icon }) => (
        <div className="flex items-center p-4 bg-default-50 dark:bg-default-100/50 rounded-xl border border-default-200 transition-hover hover:border-primary-500/50">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-default-200 shadow-sm mr-4 text-primary">
                {icon}
            </div>
            <div className="flex-none w-16 sm:w-20 text-xl font-bold text-primary-600 dark:text-primary-400">
                {symbol}
            </div>
            <p className="text-default-700 dark:text-default-300 text-sm sm:text-base font-medium">
                {description}
            </p>
        </div>
    );

    // Компонент математической дроби
    const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
        <div className="flex flex-col items-center mx-2 sm:mx-4">
            <div className="pb-1 border-b-2 sm:border-b-4 border-default-900 dark:border-default-100 w-full text-center">
                <span className="text-2xl sm:text-4xl font-mono text-secondary-600 dark:text-secondary-400">
                    {numerator}
                </span>
            </div>
            <div className="pt-1 w-full text-center">
                <span className="text-2xl sm:text-4xl font-mono text-secondary-600 dark:text-secondary-400">
                    {denominator}
                </span>
            </div>
        </div>
    );

    return (
        <Card className="max-w-4xl mx-auto my-8 border-none shadow-xl" radius="lg">
            <CardHeader className="flex gap-3 bg-primary-50/50 dark:bg-primary-900/10 p-6">
                <Calculator className="text-primary" size={28} />
                <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold">Mathematische Formeln</h2>
                    <p className="text-small text-default-500">% SR Rechner Spezifikationen</p>
                </div>
            </CardHeader>
            
            <Divider />

            <CardBody className="p-4 sm:p-8 space-y-12">
                
                {/* --- Секция 1: SR % auf --- */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Chip color="primary" variant="flat" size="sm">Option 1</Chip>
                        <h3 className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-100">
                            SR % auf <span className="text-default-400 font-normal text-sm sm:text-base ml-2">(Prozentsatz vom Gesamtvolumen)</span>
                        </h3>
                    </div>
                    
                    <p className="text-default-500 mb-8 text-sm sm:text-base italic">
                        Berechnet die Süßreserve basierend auf dem Anteil am Endvolumen.
                    </p>

                    <div className="flex justify-center items-center py-10 px-4 bg-default-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-default-200">
                        <div className="flex items-center text-3xl sm:text-5xl font-bold">
                            {L_SR}
                            <span className="mx-3 text-default-400">=</span>
                            <FractionDisplay numerator={P_SR} denominator="100" />
                            <span className="mx-2 sm:mx-4 text-default-400">⋅</span>
                            {L_W}
                        </div>
                    </div>
                </section>

                {/* --- Секция 2: SR % in --- */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Chip color="secondary" variant="flat" size="sm">Option 2</Chip>
                        <h3 className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-100">
                            SR % in <span className="text-default-400 font-normal text-sm sm:text-base ml-2">(Prozentsatz im fertigen Wein)</span>
                        </h3>
                    </div>

                    <p className="text-default-500 mb-8 text-sm sm:text-base italic">
                        Berechnet die Süßreserve als präzisen Anteil der fertigen Mischung.
                    </p>

                    <div className="flex justify-center items-center py-10 px-4 bg-default-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-default-200">
                        <div className="flex items-center text-3xl sm:text-5xl font-bold">
                            {L_SR}
                            <span className="mx-3 text-default-400">=</span>
                            <FractionDisplay numerator={P_SR} denominator={<span>100 - {P_SR}</span>} />
                            <span className="mx-2 sm:mx-4 text-default-400">⋅</span>
                            {L_W}
                        </div>
                    </div>
                </section>

                {/* --- Легенда / Переменные --- */}
                <section className="pt-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Info className="text-primary" size={20} />
                        <h4 className="font-bold text-lg uppercase tracking-wider text-default-600">
                            Legende der Variablen
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <VariableDisplay 
                            symbol={L_SR} 
                            icon={<Beaker size={24} />}
                            description="Benötigtes Volumen der Süßreserve in Litern." 
                        />
                        <VariableDisplay 
                            symbol={P_SR} 
                            icon={<Percent size={24} />}
                            description="Der gewünschte Süßreserve Prozentsatz." 
                        />
                        <VariableDisplay 
                            symbol={L_W} 
                            icon={<Beaker size={24} className="rotate-180" />}
                            description="Das verfügbare Volumen des Grundweins in Litern." 
                        />
                    </div>
                </section>

            </CardBody>
        </Card>
    );
};

export default FormulPercentSRCalc;