'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";
import { Calculator, Info, Beaker, Percent } from "lucide-react";

const FormulPercentSRCalc: React.FC = () => {
    const L_SR = <span className="font-mono">L<sub>SR</sub></span>;
    const L_W = <span className="font-mono">L<sub>W</sub></span>;
    const P_SR = <span className="font-mono">%<sub>SR</sub></span>;

    const VariableDisplay: React.FC<{ symbol: React.ReactNode; description: string; icon: React.ReactNode }> = ({ symbol, description, icon }) => (
        <div className="flex items-start sm:items-center p-3 sm:p-4 bg-default-50 dark:bg-default-100/50 rounded-xl border border-default-200 transition-hover hover:border-primary-500/50">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white dark:bg-default-200 shadow-sm mr-3 sm:mr-4 text-primary shrink-0">
                {React.cloneElement(icon as React.ReactElement, )}
            </div>
            <div className="flex-none w-14 sm:w-20 text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                {symbol}
            </div>
            <p className="text-default-700 dark:text-default-300 text-[13px] sm:text-base font-medium leading-tight">
                {description}
            </p>
        </div>
    );

    const FractionDisplay: React.FC<{ numerator: React.ReactNode; denominator: React.ReactNode }> = ({ numerator, denominator }) => (
        <div className="flex flex-col items-center mx-1 sm:mx-4 shrink-0">
            <div className="pb-1 border-b-2 sm:border-b-4 border-default-900 dark:border-default-100 w-full text-center">
                <span className="text-xl sm:text-4xl font-mono text-secondary-600 dark:text-secondary-400 leading-none">
                    {numerator}
                </span>
            </div>
            <div className="pt-1 w-full text-center">
                <span className="text-xl sm:text-4xl font-mono text-secondary-600 dark:text-secondary-400 leading-none">
                    {denominator}
                </span>
            </div>
        </div>
    );

    return (
        <Card className="w-full max-w-4xl mx-auto my-4 sm:my-8 border-none shadow-xl" radius="lg">
            <CardHeader className="flex gap-3 bg-primary-50/50 dark:bg-primary-900/10 p-4 sm:p-6">
                <Calculator className="text-primary shrink-0" size={24} />
                <div className="flex flex-col">
                    <h2 className="text-lg sm:text-2xl font-bold leading-tight">Mathematische Formeln</h2>
                    <p className="text-[11px] sm:text-small text-default-500">% SR Rechner Spezifikationen</p>
                </div>
            </CardHeader>
            
            <Divider />

            <CardBody className="p-4 sm:p-8 space-y-10 sm:space-y-12 overflow-x-hidden">
                
                {/* --- Секция 1: SR % auf --- */}
                <section>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Chip color="primary" variant="flat" size="sm" className="h-5 text-[10px] uppercase font-bold">Auf</Chip>
                        <h3 className="text-md sm:text-xl font-bold text-default-800 dark:text-default-100">
                            SR % auf
                        </h3>
                    </div>
                    
                    <p className="text-default-500 mb-6 text-[12px] sm:text-base italic leading-snug">
                        Prozentsatz <span className="underline decoration-primary/30">vom</span> Grundweinvolumen.
                    </p>

                    <div className="flex justify-center items-center py-6 sm:py-10 px-2 bg-default-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-default-200 overflow-x-auto">
                        <div className="flex items-center text-2xl sm:text-5xl font-bold">
                            {L_SR}
                            <span className="mx-2 sm:mx-3 text-default-400">=</span>
                            <FractionDisplay numerator={P_SR} denominator="100" />
                            <span className="mx-1 sm:mx-4 text-default-400">⋅</span>
                            {L_W}
                        </div>
                    </div>
                </section>

                {/* --- Секция 2: SR % in --- */}
                <section>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Chip color="secondary" variant="flat" size="sm" className="h-5 text-[10px] uppercase font-bold">In</Chip>
                        <h3 className="text-md sm:text-xl font-bold text-default-800 dark:text-default-100">
                            SR % in
                        </h3>
                    </div>

                    <p className="text-default-500 mb-6 text-[12px] sm:text-base italic leading-snug">
                        Prozentsatz <span className="underline decoration-secondary/30">im</span> fertigen Gesamtvolumen.
                    </p>

                    <div className="flex justify-center items-center py-6 sm:py-10 px-2 bg-default-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-default-200 overflow-x-auto">
                        <div className="flex items-center text-2xl sm:text-5xl font-bold">
                            {L_SR}
                            <span className="mx-2 sm:mx-3 text-default-400">=</span>
                            <FractionDisplay numerator={P_SR} denominator={<span>100 - {P_SR}</span>} />
                            <span className="mx-1 sm:mx-4 text-default-400">⋅</span>
                            {L_W}
                        </div>
                    </div>
                </section>

                {/* --- Легенда --- */}
                <section className="pt-4 border-t border-default-100">
                    <div className="flex items-center gap-2 mb-5">
                        <Info className="text-primary shrink-0" size={18} />
                        <h4 className="font-bold text-sm sm:text-lg uppercase tracking-wider text-default-600">
                            Legende
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                        <VariableDisplay 
                            symbol={L_SR} 
                            icon={<Beaker />}
                            description="Benötigtes Volumen der Süßreserve (Liter)." 
                        />
                        <VariableDisplay 
                            symbol={P_SR} 
                            icon={<Percent />}
                            description="Der gewünschte Prozentsatz." 
                        />
                        <VariableDisplay 
                            symbol={L_W} 
                            icon={<Beaker className="rotate-180" />}
                            description="Verfügbares Grundwein-Volumen (Liter)." 
                        />
                    </div>
                </section>

            </CardBody>
        </Card>
    );
};

export default FormulPercentSRCalc;