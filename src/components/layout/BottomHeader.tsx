/**
 * НАЗНАЧЕНИЕ: Мобильное нижнее навигационное меню в стиле Tech SaaS
 * ЗАВИСИМОСТИ: lucide-react, next-intl, framer-motion, @heroui/react
 * ОСОБЕННОСТИ: "Островной" дизайн, неоновые акценты, улучшенная эргономика
 */

'use client';

import React, { useState } from 'react';
import { Button } from "@heroui/react";
import { 
  Home, 
  Beaker, 
  Layers, 
  Droplets, 
  Calculator, 
  FlaskConical,
  Droplet,
  Wine,
  X,
  Activity
} from "lucide-react";
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from "framer-motion";

export const BottomHeader = () => {
  const t = useTranslations('Layout');
  const tTools = useTranslations('HomePage.tools');
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: tTools('sr-rechner'), path: '/sr-rechner-auf-in', icon: <Calculator size={20} /> },
    { label: tTools('alkohol'), path: '/alkohol-umrechner', icon: <Beaker size={20} /> },
    { label: tTools('sr-verschnitt'), path: '/sr-verschnitt-rechner', icon: <Droplets size={20} /> },
    { label: tTools('mehrfach'), path: '/mehrfach-verschnitt', icon: <Layers size={20} /> },
    { label: tTools('so2-rechner'), path: '/so2-rechner', icon: <FlaskConical size={20} /> },
    { label: tTools('acid-management'), path: '/acid-management', icon: <Droplet size={20} /> },
    { label: tTools('chaptalization'), path: '/chaptalization', icon: <Activity size={20} /> },
    { label: t('fermentation'), path: '/fermentation', icon: <Activity size={20} /> },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-[998] bg-slate-950/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999] pointer-events-none">
        <div className="w-full relative pointer-events-auto">
          
          {/* Меню инструментов - SaaS Floating Panel */}
          <AnimatePresence>
            {isOpen && (
              <m.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-16 left-0 right-0 glass-modern p-3 shadow-2xl z-[1000] border-brand-500/10 mb-0 neon-glow bg-white dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-4 p-3.5 rounded-[1.5rem] transition-all active:scale-[0.97] ${
                        pathname === item.path 
                          ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20" 
                          : "text-zinc-600 dark:text-zinc-400 active:bg-zinc-100 dark:active:bg-zinc-800"
                      }`}
                    >
                      <div className={`p-2 rounded-xl shadow-sm italic transition-all ${pathname === item.path ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800 text-brand-600'}`}>
                        {item.icon}
                      </div>
                      <span className="font-black uppercase tracking-widest text-[10px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Основная панель навигации - Clean Tech Glass */}
          <div className="glass-modern rounded-none flex justify-around items-center p-2 shadow-2xl relative z-[1001] border-none border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95">
            
            {/* Главная */}
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className={`flex flex-col gap-0.5 h-14 w-full min-w-0 transition-all ${pathname === '/' && !isOpen ? 'text-brand-600 scale-110' : 'text-zinc-400'}`}
              onPress={() => {
                router.push('/');
                setIsOpen(false);
              }}
            >
              <Home size={22} />
              <span className="text-[8px] font-black uppercase tracking-widest">{t('menu.home')}</span>
            </Button>

            {/* Брожение */}
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className={`flex flex-col gap-0.5 h-14 w-full min-w-0 transition-all ${pathname.includes('fermentation') && !isOpen ? 'text-brand-600 scale-110' : 'text-zinc-400'}`}
              onPress={() => {
                router.push('/fermentation');
                setIsOpen(false);
              }}
            >
              <Activity size={22} />
              <span className="text-[8px] font-black uppercase tracking-widest">{t('fermentation')}</span>
            </Button>

            {/* Центральный разделитель или экшн */}
            <div className="bg-brand-600/10 p-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" />
            </div>

            {/* Кнопка Еще (More) */}
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className={`flex flex-col gap-0.5 h-14 w-full min-w-0 transition-all ${isOpen ? 'text-brand-600 scale-110' : 'text-zinc-400'}`}
              onPress={() => setIsOpen(!isOpen)}
            >
              <div className="flex flex-col items-center">
                {isOpen ? (
                  <X size={22} className="text-brand-600" />
                ) : (
                  <div className="relative">
                    <Wine size={22} className="text-brand-600" />
                  </div>
                )}
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {isOpen ? t('menu.close') : t('menu.more')}
                </span>
              </div>
            </Button>

          </div>
        </div>
      </div>
    </>
  );
};