/**
 * НАЗНАЧЕНИЕ: Нижний колонтитул (Footer) приложения
 * ЗАВИСИМОСТИ: next-intl
 * ОСОБЕННОСТИ: Поддержка i18n, адаптивный дизайн
 */

import React from 'react';
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('Layout.footer');

  return (
    <footer className="bg-zinc-900 text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <span className="font-serif text-xl font-bold text-zinc-100">
              {t('app-name')}
            </span>
          </div>
        </div>

        {/* Нижняя панель */}
        <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500 text-sm font-medium">
          <p>
            &copy; {new Date().getFullYear()} {t('app-name')}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};