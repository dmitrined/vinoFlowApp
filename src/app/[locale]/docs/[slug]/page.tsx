/**
 * НАЗНАЧЕНИЕ: Страница конкретной статьи (MDX)
 * ЗАВИСИМОСТИ: next-mdx-remote, next-intl, @/lib/mdx, @/components/mdx/MdxComponents
 * ОСОБЕННОСТИ: Рендеринг MDX на сервере (RSC) без плагинов GFM для обхода багов.
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDocBySlug, getDocs } from '@/lib/mdx';
import { MdxComponents } from '@/components/mdx/MdxComponents';
import { Link } from '@/i18n/routing';
import { ChevronLeft, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Chip } from '@heroui/react';

const TOOL_HREFS: Record<string, string> = {
    'alkohol': '/alkohol-umrechner',
    'sr-rechner': '/sr-rechner-auf-in',
    'so2-rechner': '/so2-rechner',
    'sr-verschnitt': '/sr-verschnitt-rechner',
    'mehrfach': '/mehrfach-verschnitt',
    'acid-management': '/acid-management',
    'chaptalization': '/chaptalization'
};

// Генерация статических параметров для SSG
export async function generateStaticParams() {
    const { routing } = await import('@/i18n/routing');
    const params: { locale: string; slug: string }[] = [];
    
    for (const locale of routing.locales) {
        const docs = getDocs(locale);
        for (const doc of docs) {
            params.push({
                locale,
                slug: doc.slug,
            });
        }
    }
    
    return params;
}

// Генерация метаданных
export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const resolvedParams = await params;
    const doc = getDocBySlug(resolvedParams.slug, resolvedParams.locale);
    
    if (!doc) {
        return {
            title: 'Not Found',
        };
    }
    
    return {
        title: `${doc.frontmatter.title} | VinoFlow Knowledge Hub`,
        description: doc.frontmatter.excerpt,
    };
}

export default async function DocPage({
    params
}: {
    params: Promise<{ slug: string, locale: string }>;
}) {
    const resolvedParams = await params;
    const doc = getDocBySlug(resolvedParams.slug, resolvedParams.locale);
    
    if (!doc) {
        notFound();
    }
    
    const t = await getTranslations('Docs');
    // Получаем переводы для калькуляторов, чтобы показать связанные инструменты
    const tHomePage = await getTranslations('HomePage.tools');

    return (
        <article className="container mx-auto px-4 py-8 pb-32 max-w-3xl min-h-screen">
            <div className="mb-8">
                <Link 
                    href="/docs" 
                    className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline mb-6 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {t('back')}
                </Link>
                
                <div className="mb-4">
                    <Chip size="sm" color="primary" variant="flat" className="font-medium mb-3">
                        {doc.frontmatter.category}
                    </Chip>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-default-900 leading-tight">
                        {doc.frontmatter.title}
                    </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-default-500 mt-6 pt-6 border-t border-default-100">
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-default-400" />
                        <span>{doc.frontmatter.author}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-default-400" />
                        <span>{doc.frontmatter.date}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-default-400" />
                        <span>{doc.frontmatter.readTime} {t('readTime')}</span>
                    </div>
                </div>
            </div>

            <div className="prose prose-default max-w-none prose-headings:text-default-900 prose-p:text-default-700 prose-a:text-brand-600 dark:prose-invert">
                <MDXRemote 
                    source={doc.content} 
                    components={MdxComponents} 
                />
            </div>

            {/* Связанные инструменты */}
            {doc.frontmatter.relatedTools && doc.frontmatter.relatedTools.length > 0 && (
                <div className="mt-16 pt-8 border-t border-default-200">
                    <h3 className="text-xl font-bold mb-6 text-default-900">
                        {t('relatedTools')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doc.frontmatter.relatedTools.map(toolId => (
                            <Link 
                                key={toolId} 
                                href={(TOOL_HREFS[toolId] || `/${toolId}`)}
                                className="group block"
                            >
                                <div className="p-4 rounded-xl border border-default-200 bg-default-50 hover:bg-brand-50 hover:border-brand-300 transition-all flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-default-900 group-hover:text-brand-700">
                                            {tHomePage(toolId) || toolId}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-default-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
