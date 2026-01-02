'use client';

import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from '@heroui/react';
import { Wine, User } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

type Language = 'en' | 'de' | 'ru';

export const Header = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('de');
  const pathname = usePathname();

  const navigationItems = [
    { label: 'SR Rechner auf/in', path: '/sr-rechner-auf-in' },
    { label: 'Alkohol-Umrechner', path: '/alkohol-umrechner' },
    { label: 'SR Verschnitt', path: '/sr-verschnitt-rechner' },
    { label: 'Mehrfach-Verschnitt', path: '/mehrfach-verschnitt' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Top Promo Bar */}
      <div className="bg-zinc-100 dark:bg-zinc-900 text-[10px] sm:text-tiny py-2 px-4 border-b border-divider">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wine className="w-3 sm:w-4 h-3 sm:h-4 text-red-700" />
            <span className="text-orange-500 font-bold mr-1 sm:mr-2">Dmitri Nedioglo</span>
          </div>
          
          <div className="flex gap-3">
            {(['en', 'de', 'ru'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={`uppercase font-black text-[10px] tracking-widest transition-all ${
                  currentLanguage === lang ? 'text-primary scale-110' : 'text-zinc-400'
                }`}
              >
                {lang}
              </button>
            ))}
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
            "data-[active=true]:after:bg-primary",
          ],
        }}
      >
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-2">
            <p className="font-serif font-black text-xl sm:text-2xl tracking-tighter italic">
              Vino<span className="text-primary not-italic font-sans uppercase ml-1">Flow</span>
            </p>
          </NextLink>
        </NavbarBrand>

        {/* Desktop Menu - Показывается только на больших экранах */}
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          {navigationItems.map((item) => (
            <NavbarItem key={item.path} isActive={pathname === item.path}>
              <NextLink 
                href={item.path}
                className={`text-sm font-bold transition-colors ${
                  pathname === item.path ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
           <Button isIconOnly variant="flat" radius="full" size="sm">
              <User size={18} />
           </Button>
        </NavbarContent>
      </Navbar>
    </div>
  );
};