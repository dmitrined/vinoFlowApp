/**
 * НАЗНАЧЕНИЕ: Страница с инструкцией по установке PWA
 * ЗАВИСИМОСТИ: @/components/ui/PwaGuide, next-intl/server, react
 * ОСОБЕННОСТИ: Отображение пошагового руководства по установке PWA
 */

import React from 'react';
import { PwaGuide } from '@/components/ui/PwaGuide';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pwa' });
  return {
    title: `${t('title')} | VinoFlow`,
    description: t('subtitle'),
  };
}

export default function HowToInstallPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <PwaGuide />
      </div>
    </main>
  );
}
