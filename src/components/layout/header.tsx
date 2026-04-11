/**
 * НАЗНАЧЕНИЕ: Современное навигационное меню "Floating Island"
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl
 * ОСОБЕННОСТИ: Минималистичный дизайн, поддержка i18n, эффект плавающего меню
 */

'use client';

import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Image,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import NextImage from 'next/image';
import { Globe, Zap, ChevronDown } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

export const Header = () => {
  const t = useTranslations('Layout');
  const tTools = useTranslations('HomePage.tools');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="w-full sticky top-0 z-50 pointer-events-none">
      <Navbar
        maxWidth="full"
        className="w-full glass-modern rounded-none h-16 pointer-events-auto border-none border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95"
        position="static"
        classNames={{
          wrapper: "px-6",
        }}
      >
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <NextImage 
                src="/icon-192x192.png" 
                alt="Logo" 
                width={40} 
                height={40}
              />
            </div>
            <p className="font-black text-2xl tracking-tighter text-tech-gradient">
              Vino<span className="text-zinc-400 dark:text-zinc-500 ml-0.5">Flow</span>
            </p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden lg:flex gap-8" justify="center">
          {/* Навигация в SaaS стиле */}
          <Link href="/" className={`text-sm font-bold ${pathname === '/' ? "text-brand-600" : "text-zinc-500 hover:text-brand-600"} transition-colors`}>
            Dashboard
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <Dropdown placement="bottom-start" classNames={{ content: "min-w-[220px]" }}>
            <DropdownTrigger>
              <button className={`flex items-center gap-1 text-sm font-bold ${['rechner', 'umrechner', 'verschnitt', 'acid-management', 'chaptalization'].some(p => pathname.includes(p)) ? "text-brand-600" : "text-zinc-500 hover:text-brand-600"} transition-colors outline-none cursor-pointer`}>
                Tools
                <ChevronDown size={14} className="opacity-70" />
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Calculators" 
              itemClasses={{ base: "py-2 px-3", title: "font-bold text-[11px] uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-brand-600 transition-colors" }}
            >
              <DropdownItem key="sr-rechner" onPress={() => router.push('/sr-rechner-auf-in')}>{tTools('sr-rechner')}</DropdownItem>
              <DropdownItem key="alkohol" onPress={() => router.push('/alkohol-umrechner')}>{tTools('alkohol')}</DropdownItem>
              <DropdownItem key="so2" onPress={() => router.push('/so2-rechner')}>{tTools('so2-rechner')}</DropdownItem>
              <DropdownItem key="verschnitt" onPress={() => router.push('/sr-verschnitt-rechner')}>{tTools('sr-verschnitt')}</DropdownItem>
              <DropdownItem key="mehrfach" onPress={() => router.push('/mehrfach-verschnitt')}>{tTools('mehrfach')}</DropdownItem>
              <DropdownItem key="acid-management" onPress={() => router.push('/acid-management')}>{tTools('acid-management')}</DropdownItem>
              <DropdownItem key="chaptalization" onPress={() => router.push('/chaptalization')}>{tTools('chaptalization')}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <NavbarContent justify="end">
          <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
            {['en', 'de', 'ru'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-8 h-8 rounded-full text-[10px] font-black uppercase transition-all ${locale === lang ? 'bg-white dark:bg-zinc-700 text-brand-600 shadow-sm scale-100' : 'text-zinc-400 opacity-60 hover:opacity-100'
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <Button isIconOnly variant="flat" radius="full" size="sm" className="hidden sm:flex bg-brand-500 text-white">
            <Zap size={16} />
          </Button>
        </NavbarContent>
      </Navbar>
    </div>
  );
};