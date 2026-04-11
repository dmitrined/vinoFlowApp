import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import FormulSo2Calc from './FormulSo2Calc';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.so2-calc' });

    return {
        title: t('seo-title'),
        description: t('seo-description'),
    };
}

export default async function So2CalcPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.so2-calc' });

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
            {/* Hero Section or simple spacing */}
            <div className="max-w-7xl mx-auto pt-8 pb-12">
                <FormulSo2Calc />
            </div>
        </main>
    );
}
