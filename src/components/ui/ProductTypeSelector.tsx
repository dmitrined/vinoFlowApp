/**
 * НАЗНАЧЕНИЕ: Селектор типа продукта (газ, порошок, жидкость) для SO2
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl
 * ОСОБЕННОСТИ: Client Component, адаптивный дизайн в стиле Tech SaaS
 */

'use client';

import React from 'react';
import { Tabs, Tab } from "@heroui/react";
import { Wind, Beaker, FlaskConical } from "lucide-react";
import { useTranslations } from 'next-intl';
import { ProductType } from '@/types/calculations';

interface ProductTypeSelectorProps {
    selectedKey: ProductType;
    onSelectionChange: (key: ProductType) => void;
}

const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({ 
    selectedKey, 
    onSelectionChange 
}) => {
    const t = useTranslations('Calculators.so2-calc');

    return (
        <Tabs
            fullWidth
            radius="full"
            color="primary"
            variant="bordered"
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(key as ProductType)}
            classNames={{
                tabList: "bg-zinc-100 dark:bg-zinc-800/50 p-1 border-none h-16",
                cursor: "bg-white dark:bg-zinc-700 shadow-sm",
                tab: "h-14 px-1 sm:px-3",
                tabContent: "group-data-[selected=true]:text-brand-600 font-black uppercase tracking-tighter text-[10px] sm:text-xs w-full"
            }}
        >
            <Tab key="gas" title={
                <div className="flex sm:flex-row flex-col items-center gap-0 sm:gap-2 py-1">
                    <Wind size={16} className="mb-0.5 sm:mb-0 shrink-0" />
                    <span className="text-[9px] sm:text-xs leading-none font-black uppercase tracking-tighter">{t('gas')}</span>
                </div>
            } />
            <Tab key="powder" title={
                <div className="flex sm:flex-row flex-col items-center gap-0 sm:gap-2 py-1">
                    <Beaker size={16} className="mb-0.5 sm:mb-0 shrink-0" />
                    <div className="flex flex-col items-center sm:items-start leading-[1.1] sm:leading-none">
                        <span className="text-[9px] sm:text-xs font-black uppercase tracking-tighter">{t('powder-line1')}</span>
                        <span className="text-[8px] sm:text-xs opacity-60 font-black uppercase tracking-tighter sm:ml-1">{t('powder-line2')}</span>
                    </div>
                </div>
            } />
            <Tab key="liquid" title={
                <div className="flex sm:flex-row flex-col items-center gap-0 sm:gap-2 py-1">
                    <FlaskConical size={16} className="mb-0.5 sm:mb-0 shrink-0" />
                    <div className="flex flex-col items-center sm:items-start leading-[1.1] sm:leading-none">
                        <span className="text-[9px] sm:text-xs font-black uppercase tracking-tighter">{t('liquid-line1')}</span>
                        <span className="text-[8px] sm:text-xs opacity-60 font-black uppercase tracking-tighter sm:ml-1">{t('liquid-line2')}</span>
                    </div>
                </div>
            } />
        </Tabs>
    );
};

export default ProductTypeSelector;
