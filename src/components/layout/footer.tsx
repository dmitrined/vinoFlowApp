/**
 * НАЗНАЧЕНИЕ: Нижний колонтитул (Footer) приложения
 * ЗАВИСИМОСТИ: next-intl
 * ОСОБЕННОСТИ: Поддержка i18n, адаптивный дизайн
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import NextImage from 'next/image';

export const Footer = () => {
  const t = useTranslations('Layout.footer');

  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
          
          {/* Левая часть: Брендинг и Копирайт */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                <NextImage 
                  src="/icon-192x192.png" 
                  alt="Logo" 
                  width={32} 
                  height={32}
                />
              </div>
              <p className="font-black text-xl tracking-tighter text-tech-gradient">
                Vino<span className="text-slate-500 ml-0.5">Flow</span>
              </p>
            </Link>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              {t('rights')}
            </span>
          </div>

          {/* Центральная часть: Ссылки */}
          <div className="flex justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link href="/how-to-install" className="hover:text-brand-400 transition-all duration-300 hover:tracking-[0.3em]">
              {t('how-to-install')}
            </Link>
            <Link href="/impressum" className="hover:text-brand-400 transition-all duration-300 hover:tracking-[0.3em]">
              {t('impressum')}
            </Link>
            <Link href="/legal" className="hover:text-brand-400 transition-all duration-300 hover:tracking-[0.3em]">
              {t('legal')}
            </Link>
          </div>

          {/* Правая часть: Версия и Слоган */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="px-4 py-1 bg-slate-900 rounded-full border border-white/5 text-[9px] font-black text-brand-500/80 tracking-widest uppercase">
              {t('version')}
            </div>
            <div className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] hidden lg:block">
              {t('slogan')}
            </div>
          </div>

        </div>
        
        {/* Нижняя декоративная линия (опционально) */}
        <div className="mt-12 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </footer>
  );
};