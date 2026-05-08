import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getDocs } from '@/lib/mdx';

// Fallback to localhost if NEXT_PUBLIC_APP_URL is not set
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinoflow.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        '/',
        '/docs',
        '/sr-rechner-auf-in',
        '/alkohol-umrechner',
        '/so2-rechner',
        '/sr-verschnitt-rechner',
        '/mehrfach-verschnitt',
        '/acid-management',
        '/chaptalization',
    ];

    const { locales, defaultLocale } = routing;

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 1. Add static routes
    for (const route of staticRoutes) {
        // According to next-intl defaults, all routes are prefixed with the locale
        const url = `${baseUrl}/${defaultLocale}${route === '/' ? '' : route}`;
        
        const languages: Record<string, string> = {};
        for (const locale of locales) {
            languages[locale] = `${baseUrl}/${locale}${route === '/' ? '' : route}`;
        }

        sitemapEntries.push({
            url,
            lastModified: new Date(),
            changeFrequency: route === '/' ? 'weekly' : 'monthly',
            priority: route === '/' ? 1 : 0.8,
            alternates: {
                languages,
            },
        });
    }

    // 2. Add dynamic docs (Knowledge Hub)
    // We read the docs from the default locale (they should exist across all locales)
    try {
        const docs = await getDocs(defaultLocale);
        
        for (const doc of docs) {
            const route = `/docs/${doc.slug}`;
            const url = `${baseUrl}/${defaultLocale}${route}`;
            
            const languages: Record<string, string> = {};
            for (const locale of locales) {
                languages[locale] = `${baseUrl}/${locale}${route}`;
            }

            sitemapEntries.push({
                url,
                lastModified: new Date(doc.frontmatter.date || new Date()),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: {
                    languages,
                },
            });
        }
    } catch (e) {
        console.error('Error generating sitemap for docs:', e);
    }

    return sitemapEntries;
}
