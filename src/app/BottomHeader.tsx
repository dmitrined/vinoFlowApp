'use client';

import React from 'react';
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from "@heroui/react";
import { Home, Grid, ChevronUp, Beaker, Layers, Droplets, Calculator } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';

export const BottomHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: 'SR Rechner auf/in', path: '/sr-rechner-auf-in', icon: <Calculator size={18} /> },
    { label: 'Alkohol-Umrechner', path: '/alkohol-umrechner', icon: <Beaker size={18} /> },
    { label: 'SR Verschnitt', path: '/sr-verschnitt-rechner', icon: <Droplets size={18} /> },
    { label: 'Mehrfach-Verschnitt', path: '/mehrfach-verschnitt', icon: <Layers size={18} /> },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Эффект размытия и фон */}
      <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-divider flex justify-around items-center px-6 py-3 pb-6">
        
        {/* Кнопка Home */}
        <Button
          isIconOnly
          variant="light"
          className={`flex flex-col gap-1 h-auto min-w-0 ${pathname === '/' ? 'text-primary' : 'text-zinc-500'}`}
          onPress={() => router.push('/')}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Button>

        {/* Кнопка More с выпадающим списком */}
        <Dropdown placement="top" className="dark:bg-zinc-900 border border-divider">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              className="flex flex-col gap-1 h-auto min-w-0 text-zinc-500"
            >
              <div className="relative">
                <Grid size={24} />
                <ChevronUp size={12} className="absolute -top-1 -right-2 animate-bounce" />
              </div>
              <span className="text-[10px] font-bold uppercase">More</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Navigation Actions"
            onAction={(key) => router.push(key as string)}
            className="p-3"
          >
            {menuItems.map((item) => (
              <DropdownItem
                key={item.path}
                startContent={item.icon}
                className={pathname === item.path ? "text-primary bg-primary/10" : ""}
                description="Keller-Tool"
              >
                <span className="font-bold">{item.label}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

      </div>
    </div>
  );
};