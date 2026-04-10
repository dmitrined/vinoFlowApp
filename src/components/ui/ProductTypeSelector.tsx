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
                tabList: "bg-zinc-100 dark:bg-zinc-800/50 p-1 border-none",
                cursor: "bg-white dark:bg-zinc-700 shadow-sm",
                tab: "h-10",
                tabContent: "group-data-[selected=true]:text-brand-600 font-black uppercase tracking-tighter text-[10px] sm:text-xs"
            }}
        >
            <Tab key="gas" title={
                <div className="flex items-center gap-2">
                    <Wind size={16} />
                    <span>{t('gas')}</span>
                </div>
            } />
            <Tab key="powder" title={
                <div className="flex items-center gap-2">
                    <Beaker size={16} />
                    <span>{t('powder')}</span>
                </div>
            } />
            <Tab key="liquid" title={
                <div className="flex items-center gap-2">
                    <FlaskConical size={16} />
                    <span>{t('liquid')}</span>
                </div>
            } />
        </Tabs>
    );
};

export default ProductTypeSelector;
