/**
 * НАЗНАЧЕНИЕ: Профессиональная страница 404 (Not Found) в стиле SaaS
 * ЗАВИСИМОСТИ: next-intl, @heroui/react, framer-motion, lucide-react
 * ОСОБЕННОСТИ: Темная тема, адаптивный дизайн (Mobile First), локализация
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@heroui/react';
import { Home, ArrowLeft, Beaker } from 'lucide-react';
import { m } from 'framer-motion';
import { Link } from '@/i18n/routing';

export default function NotFoundPage() {
    const t = useTranslations('NotFound');

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
            {/* Декоративные элементы фона */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 space-y-12 max-w-lg"
            >
                {/* Иконка с анимацией */}
                <m.div 
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-2xl relative">
                        <Beaker size={80} className="text-brand-500" />
                        <m.div 
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 bg-red-600 w-6 h-6 rounded-full border-4 border-zinc-950"
                        />
                    </div>
                </m.div>

                {/* Текст */}
                <div className="space-y-4">
                    <m.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter text-tech-gradient uppercase italic"
                    >
                        {t('error-code')}
                    </m.h1>
                    <m.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight"
                    >
                        {t('title')}
                    </m.h2>
                    <m.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-zinc-500 font-bold uppercase tracking-widest text-xs md:text-sm leading-relaxed"
                    >
                        {t('description')}
                    </m.p>
                </div>

                {/* Кнопка */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                >
                    <Button
                        as={Link}
                        href="/"
                        variant="shadow"
                        color="primary"
                        size="lg"
                        radius="full"
                        startContent={<Home size={20} />}
                        className="font-black uppercase tracking-widest px-10 h-14 bg-brand-600 shadow-xl shadow-brand-500/20 hover:scale-105 transition-transform"
                    >
                        {t('back-home')}
                    </Button>
                    
                    <Button
                        as={Link}
                        href="/"
                        variant="light"
                        size="lg"
                        radius="full"
                        startContent={<ArrowLeft size={18} />}
                        className="font-black uppercase tracking-widest text-zinc-400 h-14 hover:text-white transition-colors"
                    >
                        {t('back-button')}
                    </Button>
                </m.div>
            </m.div>

            {/* Футер для стиля */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 hidden md:block">
                <span className="text-[10px] font-black uppercase tracking-[1em] text-zinc-500 italic">
                    Precision Cellar Management
                </span>
            </div>
        </div>
    );
}
