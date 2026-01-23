/**
 * НАЗНАЧЕНИЕ: Страница калькулятора SO2.
 * ЗАВИСИМОСТИ: FormulSo2Calc, next-intl
 */
import React from 'react';
import FormulSo2Calc from './FormulSo2Calc';

export default function So2CalcPage() {
    return (
        <main className="min-h-screen bg-transparent">
            {/* Hero Section or simple spacing */}
            <div className="max-w-7xl mx-auto pt-8 pb-12">
                <FormulSo2Calc />
            </div>
        </main>
    );
}
