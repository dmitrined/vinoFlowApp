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
  Chip
} from '@heroui/react';
import NextImage from 'next/image';
import { Globe, Zap } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

export const Header = () => {
  const t = useTranslations('Layout');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="w-full pt-4 px-4 sticky top-0 z-50 pointer-events-none">
      <Navbar
        maxWidth="xl"
        className="max-w-7xl mx-auto glass-modern rounded-[2rem] h-16 neon-glow pointer-events-auto border-none"
        position="static"
        classNames={{
            wrapper: "px-6",
        }}
      >
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-brand-600 p-1.5 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                <NextImage src="/icon-192x192.png" alt="Logo" width={24} height={24} className="invert brightness-200" />
            </div>
            <p className="font-black text-2xl tracking-tighter text-tech-gradient">
              Vino<span className="text-zinc-400 dark:text-zinc-500 ml-0.5">Flow</span>
            </p>
          </Link>
          <Chip size="sm" variant="flat" className="ml-3 hidden sm:flex bg-brand-500/10 text-brand-600 font-bold border-none uppercase text-[10px]">
            Pro
          </Chip>
        </NavbarBrand>

        <NavbarContent className="hidden lg:flex gap-8" justify="center">
            {/* Навигация в SaaS стиле */}
            <Link href="/" className={`text-sm font-bold ${pathname === '/' ? "text-brand-600" : "text-zinc-500 hover:text-brand-600"} transition-colors`}>
                Dashboard
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <Link href="/so2-rechner" className={`text-sm font-bold ${pathname.includes('so2') ? "text-brand-600" : "text-zinc-500 hover:text-brand-600"} transition-colors`}>
                Tools
            </Link>
        </NavbarContent>

        <NavbarContent justify="end">
          <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
            {['en', 'de', 'ru'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-8 h-8 rounded-full text-[10px] font-black uppercase transition-all ${
                    locale === lang ? 'bg-white dark:bg-zinc-700 text-brand-600 shadow-sm scale-100' : 'text-zinc-400 opacity-60 hover:opacity-100'
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