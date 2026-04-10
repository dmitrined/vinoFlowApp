import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import FormulMultiBlendCalc from './FormulMultiBlendCalc';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.mehrfach' });

    return {
        title: `${t('title')} | VinoFlow`,
        description: t('subtitle'),
    };
}

export default async function MultiBlendPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculators.mehrfach' });

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
            <div className="max-w-7xl mx-auto">
                <FormulMultiBlendCalc />
            </div>
        </main>
    );
}