/**
 * НАЗНАЧЕНИЕ: Главное навигационное меню приложения с поддержкой i18n
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl
 * ОСОБЕННОСТИ: Адаптивный дизайн, переключение языков, поддержка активных состояний
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
} from '@heroui/react';
import NextImage from 'next/image';
import { User, Globe } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

export const Header = () => {
  const t = useTranslations('Layout');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const navigationItems = [
    { label: t('menu.sr-auf-in'), path: '/sr-rechner-auf-in' },
    { label: t('menu.alkohol'), path: '/alkohol-umrechner' },
    { label: t('menu.sr-verschnitt'), path: '/sr-verschnitt-rechner' },
    { label: t('menu.mehrfach'), path: '/mehrfach-verschnitt' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Верхняя панель с автором и выбором языка */}
      <div className="bg-zinc-100 dark:bg-zinc-900 text-[10px] sm:text-tiny py-2 px-4 border-b border-divider">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              as={NextImage}
              src="/icon-192x192.png"
              alt="Logo"
              width={16}
              height={16}
              className="rounded-sm"
            />
            <span className="text-wine-700 font-bold mr-1 sm:mr-2">{t('developer')}</span>
          </div>

          <div className="flex gap-3 items-center">
            <Globe size={12} className="text-zinc-400" />
            <div className="flex gap-2">
              {['en', 'de', 'ru'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`uppercase font-black text-[10px] tracking-widest transition-all hover:text-wine-500 ${locale === lang ? 'text-wine-600 scale-110' : 'text-zinc-400'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Navbar
        maxWidth="xl"
        isBordered
        className="h-16"
        classNames={{
          item: [
            "flex", "relative", "h-full", "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[3px]",
            "data-[active=true]:after:rounded-t-[2px]",
            "data-[active=true]:after:bg-wine-600",
          ],
        }}
      >
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 group">
            <p className="font-serif font-black text-xl sm:text-2xl tracking-tighter italic transition-transform group-hover:scale-105">
              Vino<span className="text-wine-600 not-italic font-sans uppercase ml-1">Flow</span>
            </p>
          </Link>
        </NavbarBrand>

        {/* Десктопное меню */}
        <NavbarContent className="hidden lg:flex gap-8" justify="center">
          {navigationItems.map((item) => (
            <NavbarItem key={item.path} isActive={pathname === item.path}>
              <Link
                href={item.path}
                className={`text-sm font-bold transition-colors ${pathname === item.path ? "text-wine-600" : "text-foreground hover:text-wine-600"
                  }`}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <Button isIconOnly variant="flat" radius="full" size="sm" className="bg-wine-50 text-wine-600">
            <User size={18} />
          </Button>
        </NavbarContent>
      </Navbar>
    </div>
  );
};