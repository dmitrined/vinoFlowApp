/**
 * НАЗНАЧЕНИЕ: Генерация файла robots.txt для поисковых систем (SEO)
 * ЗАВИСИМОСТИ: next
 * ОСОБЕННОСТИ: Динамическое определение базового URL и правил индексации
 */

import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinoflow.app';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
