/**
 * НАЗНАЧЕНИЕ: Нижний колонтитул (Footer) приложения
 * ЗАВИСИМОСТИ: next-intl
 * ОСОБЕННОСТИ: Поддержка i18n, адаптивный дизайн
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export const Footer = () => {
  const t = useTranslations('Layout.footer');

  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
          
          {/* Левая часть: Брендинг и Копирайт */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black bg-tech-gradient bg-clip-text text-transparent tracking-tighter">
              VinoFlow
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              {t('rights')}
            </span>
          </div>

          {/* Центральная часть: Ссылки */}
          <div className="flex justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
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
              v1.2.0-stable
            </div>
            <div className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] hidden lg:block">
              Precision Oenology Hub
            </div>
          </div>

        </div>
        
        {/* Нижняя декоративная линия (опционально) */}
        <div className="mt-12 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </footer>
  );
};