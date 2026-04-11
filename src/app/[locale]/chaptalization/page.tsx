import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import ChaptalizationCalc from './ChaptalizationCalc';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.chaptalization' });

    return {
        title: t('seo-title'),
        description: t('seo-description'),
    };
}

export default async function ChaptalizationPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.chaptalization' });

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
                <ChaptalizationCalc />
            </div>
        </main>
    );
}
