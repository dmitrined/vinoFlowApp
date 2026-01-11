import React from 'react';
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomHeader } from "@/components/layout/BottomHeader";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "VinoFlow - Продвинутые расчеты для виноделия",
    description: "Профессиональные инструменты для энологических расчетов в вашем погребе. SR Rechner, Alkohol-Konvertierung и многое другое.",
    keywords: ["виноделие", "расчеты", "энология", "алкоголь", "сахар", "VinoFlow"],
    manifest: "/manifest.json",
    openGraph: {
        title: "VinoFlow - Продвинутые расчеты для виноделия",
        description: "Профессиональные инструменты для энологических расчетов.",
        url: "https://vinoflow.app",
        siteName: "VinoFlow",
        locale: "ru_RU",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "VinoFlow App",
        description: "Your wine tracking application",
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
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
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
            </body>
        </html>
    );
}
