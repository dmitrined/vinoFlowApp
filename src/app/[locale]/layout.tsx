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
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
    title: "VinoFlow",
    description: "Профессиональные инструменты для энологических расчетов в вашем погребе.",
    keywords: ["виноделие", "расчеты", "энология", "алкоголь", "сахар", "VinoFlow"],
    manifest: "/manifest.json",
    openGraph: {
        title: "VinoFlow",
        description: "Профессиональные инструменты для энологических расчетов.",
        url: "https://vinoflow.app",
        siteName: "VinoFlow",
        locale: "ru_RU",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "VinoFlow",
        description: "Your wine tracking application",
    },
    icons: {
        icon: [
            { url: "/icon-192x192.png?v=2", sizes: "192x192", type: "image/png" },
        ],
    },
};

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
            </Providers>
        </NextIntlClientProvider>
    );
}
