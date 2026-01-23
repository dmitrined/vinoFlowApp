/**
 * НАЗНАЧЕНИЕ: Мобильное нижнее навигационное меню (Bottom Navigation)
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl
 * ОСОБЕННОСТИ: Fixed position, i18n, выпадающее меню навигации
 */

'use client';

import React from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { Home, Grid, ChevronUp, Beaker, Layers, Droplets, Calculator, FlaskConical } from "lucide-react";
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const BottomHeader = () => {
  const t = useTranslations('Layout');
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: t('menu.sr-auf-in'), path: '/sr-rechner-auf-in', icon: <Calculator size={18} /> },
    { label: t('menu.alkohol'), path: '/alkohol-umrechner', icon: <Beaker size={18} /> },
    { label: t('menu.sr-verschnitt'), path: '/sr-verschnitt-rechner', icon: <Droplets size={18} /> },
    { label: t('menu.mehrfach'), path: '/mehrfach-verschnitt', icon: <Layers size={18} /> },
    { label: t('menu.so2-rechner'), path: '/so2-rechner', icon: <FlaskConical size={18} /> },
  ];

  return (
    <div className="sm:hidden fixed bottom-1 left-0 right-0 z-50 px-4">
      {/* Контейнер с размытием и фоном в стиле Glassmorphism */}
      <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-divider rounded-3xl flex justify-around items-center py-2 shadow-2xl overflow-hidden">

        {/* Кнопка Главная */}
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className={`flex flex-col gap-0.5 h-12 w-full min-w-0 ${pathname === '/' ? 'text-wine-600' : 'text-zinc-500'}`}
          onPress={() => router.push('/')}
        >
          <Home size={22} />
          <span className="text-[9px] font-black uppercase tracking-tighter">{t('menu.home')}</span>
        </Button>

        {/* Кнопка Меню с выпадающим списком */}
        <Dropdown placement="top" className="dark:bg-zinc-900 border border-divider rounded-2xl">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className="flex flex-col gap-0.5 h-12 w-full min-w-0 text-zinc-500"
            >
              <div className="relative">
                <Grid size={22} />
                <ChevronUp size={10} className="absolute -top-1 -right-2 animate-bounce text-wine-600" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{t('menu.more')}</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Navigation Actions"
            onAction={(key) => router.push(key as string)}
            className="p-2"
          >
            {menuItems.map((item) => (
              <DropdownItem
                key={item.path}
                startContent={item.icon}
                className={pathname === item.path ? "text-wine-600 bg-wine-50" : ""}
              >
                <span className="font-bold text-sm">{item.label}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

      </div>
    </div>
  );
};