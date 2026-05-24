/**
 * НАЗНАЧЕНИЕ: Страница калькулятора регулирования кислотности вина
 * ЗАВИСИМОСТИ: next-intl/server, next, AcidManagementCalc
 * ОСОБЕННОСТИ: Серверный компонент с поддержкой метаданных и JSON-LD разметки
 */

import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import AcidManagementCalc from './AcidManagementCalc';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.acid-management' });

    return {
        title: t('seo-title'),
        description: t('seo-description'),
    };
}

export default async function AcidManagementPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.acid-management' });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": t('title'),
        "description": t('subtitle'),
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <main className="min-h-screen bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto pt-8 pb-12">
                <AcidManagementCalc />
            </div>
        </main>
    );
}
