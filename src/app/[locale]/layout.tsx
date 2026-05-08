/**
 * НАЗНАЧЕНИЕ: Корневой слой приложения с поддержкой i18n и провайдерами
 * ЗАВИСИМОСТИ: next-intl, @/components/layout, @/providers
 * ОСОБЕННОСТИ: Динамическая подгрузка сообщений, настройка шрифтов Geist
 */

import React from 'react';
import type { Metadata, Viewport } from "next";
import { Providers } from "../providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomHeader } from "@/components/layout/BottomHeader";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Layout.metadata' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map(k => k.trim()),
        manifest: "/manifest.json",
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: process.env.NEXT_PUBLIC_APP_URL || "https://vinoflow.app",
            siteName: t('title'),
            locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'de_DE',
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: t('title'),
            description: t('description'),
        },
        icons: {
            icon: [
                { url: "/icon-192x192.png?v=2", sizes: "192x192", type: "image/png" },
            ],
        },
    };
}

export const viewport: Viewport = {
    themeColor: "#800020", // Burgundy
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as 'en' | 'de' | 'ru')) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <Providers>
                <Header />
                <main className="min-h-[calc(100vh-300px)]">
                    {children}
                </main>
                <BottomHeader />
                <Footer />
                <CookieConsent />
            </Providers>
        </NextIntlClientProvider>
    );
}
