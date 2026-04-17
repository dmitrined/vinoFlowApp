/**
 * НАЗНАЧЕНИЕ: Карточка бочки в списке дашборда
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, fermentation.ts
 * ОСОБЕННОСТИ: Bento-стиль, отображение последних показателей
 */

'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Chip, Button } from "@heroui/react";
import { FlaskConical, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { Barrel } from '@/types/fermentation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { motion } from "framer-motion";
import { formatDate } from '@/lib/dateUtils';

interface Props {
    barrel: Barrel;
    onDelete: (id: string) => void;
}

export const BarrelCard = React.memo<Props>(({ barrel, onDelete }) => {
    const t = useTranslations('Fermentation');
    const router = useRouter();

    const lastReading = barrel.readings.length > 0 
        ? barrel.readings[barrel.readings.length - 1] 
        : null;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => router.push(`/fermentation/${barrel.id}`)}
        >
            <Card 
                className="group bento-card border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl cursor-pointer rounded-[2rem] overflow-hidden border border-transparent hover:border-brand-500/20"
            >
                <CardHeader className="flex justify-between items-start p-4 bg-transparent border-none">
                    <div className="flex gap-3 items-center">
                        <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl">
                            <FlaskConical size={20} />
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                                {t('barrel-number')}
                            </h3>
                            <p className="text-xl font-black text-tech-gradient">
                                {barrel.number}
                            </p>
                        </div>
                    </div>
                    <Chip 
                        size="sm" 
                        variant="flat" 
                        color={barrel.status === 'active' ? 'success' : 'default'}
                        className="font-black uppercase text-[9px] tracking-widest border-none"
                    >
                        {barrel.status === 'active' ? t('status-active') : t('status-finished')}
                    </Chip>
                </CardHeader>

                <CardBody className="px-4 py-2 space-y-4 bg-transparent border-none">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-[9px] font-black uppercase tracking-tighter text-zinc-400 mb-1">
                                {t('last-oechsle')}
                            </p>
                            <p className="text-lg font-black text-brand-600">
                                {lastReading ? `${lastReading.oechsle}°` : '—'}
                            </p>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-[9px] font-black uppercase tracking-tighter text-zinc-400 mb-1">
                                {t('last-temp')}
                            </p>
                            <p className="text-lg font-black text-orange-500">
                                {lastReading ? `${lastReading.temperature}°C` : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                        <Calendar size={12} />
                        <span>{t('start-date')}: {formatDate(barrel.startDate)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div onClick={(e) => e.stopPropagation()}>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-zinc-300 hover:text-danger transition-colors"
                                onPress={() => onDelete(barrel.id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        <div className="text-brand-600 group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
});
