/**
 * НАЗНАЧЕНИЕ: Динамическая генерация файла sitemap.xml для SEO индексации
 * ЗАВИСИМОСТИ: next, @/i18n/routing, @/lib/mdx
 * ОСОБЕННОСТИ: Включает статические маршруты и динамические статьи базы знаний для всех локалей
 */

import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getDocs } from '@/lib/mdx';

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

    // 1. Статические маршруты
    for (const route of staticRoutes) {
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

    // 2. Динамические статьи (Knowledge Hub)
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
