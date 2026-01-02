'use client';

import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from '@heroui/react';
import { Wine, Heart } from 'lucide-react';
import NextLink from 'next/link';

type Language = 'en' | 'de' | 'ru';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('de');

  const navigationItems = [
    { label: 'SR Rechner auf/in', path: '/sr-rechner-auf-in' },
    { label: 'Alkohol-Umrechner', path: '/alkohol-umrechner' },
    { label: 'SR Verschnitt Rechner', path: '/sr-verschnitt-rechner' },
    { label: 'Mehrfach-Verschnitt', path: '/mehrfach-verschnitt' },
  ];

  return (
    <>
      {/* Top Promo Bar */}
      <div className="bg-zinc-100 dark:bg-zinc-900 text-tiny py-2 px-4 border-b border-divider">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wine className="w-4 h-4 text-red-700" />
            <span className="text-orange-500 font-medium mr-2">Dmitri Nedioglo</span>
            <span className="text-yellow-600 hidden sm:inline">Fellbacher Weingärtner</span>
          </div>
          
          {/* Language Switcher (Simple Local State Version) */}
          <div className="flex gap-2">
            {(['en', 'de', 'ru'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={`uppercase font-bold text-xs transition-colors ${
                  currentLanguage === lang
                    ? 'text-primary'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                disabled={currentLanguage === lang}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar 
        onMenuOpenChange={setIsMenuOpen} 
        maxWidth="xl" 
        isBordered 
        classNames={{
            item: [
              "flex",
              "relative",
              "h-full",
              "items-center",
              "data-[active=true]:after:content-['']",
              "data-[active=true]:after:absolute",
              "data-[active=true]:after:bottom-0",
              "data-[active=true]:after:left-0",
              "data-[active=true]:after:right-0",
              "data-[active=true]:after:h-[2px]",
              "data-[active=true]:after:rounded-[2px]",
              "data-[active=true]:after:bg-primary",
            ],
          }}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <NextLink href="/" className="flex items-center gap-2">
                <p className="font-serif font-bold text-2xl text-inherit">Wine Calculator</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navigationItems.map((item) => (
            <NavbarItem key={item.path}>
              <Link color="foreground" as={NextLink} href={item.path}>
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button isIconOnly variant="light" aria-label="Like">
              <Heart className="text-default-500" />
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {navigationItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                color="foreground"
                className="w-full"
                as={NextLink}
                href={item.path}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
};