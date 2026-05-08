/**
 * НАЗНАЧЕНИЕ: Корневой HTML-скелет приложения
 * ЗАВИСИМОСТИ: next/font/google, globals.css
 * ОСОБЕННОСТИ: Базовая структура, Geist font configuration
 */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
