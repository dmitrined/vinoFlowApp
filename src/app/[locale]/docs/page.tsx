/**
 * НАЗНАЧЕНИЕ: Главная страница раздела Документация (Knowledge Hub)
 * ЗАВИСИМОСТИ: next-intl, @/lib/mdx, @/i18n/routing
 * ОСОБЕННОСТИ: Server Component. Список статей берется из локальной ФС. 
 * Используются стандартные HTML-теги внутри Link для обхода багов сериализации HeroUI.
 */

import { getTranslations } from 'next-intl/server';
import { getDocs } from '@/lib/mdx';
import { Link } from '@/i18n/routing';
import { BookOpen, Clock } from 'lucide-react';
import { Chip } from '@heroui/react';

export default async function DocsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    // В Next.js 15 params теперь промис, нужно его за-await'ить
    const resolvedParams = await params;
    const t = await getTranslations('Docs');
    const docs = getDocs(resolvedParams.locale);

    return (
        <div className="container mx-auto px-4 py-8 pb-32 max-w-4xl min-h-screen">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-full mb-4">
                    <BookOpen className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-4xl font-bold bg-tech-gradient bg-clip-text text-transparent mb-4">
                    {t('title')}
                </h1>
                <p className="text-default-500 max-w-2xl mx-auto">
                    {t('description')}
                </p>
            </div>

            {docs.length === 0 ? (
                <div className="text-center py-20 text-default-400 bg-default-50 rounded-2xl border border-default-200 border-dashed">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('noArticles')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {docs.map((doc) => (
                        <Link 
                            key={doc.slug} 
                            href={`/docs/${doc.slug}`}
                            className="block group"
                        >
                            <div className="h-full bg-white dark:bg-default-50 border border-default-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-brand-300 hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <Chip 
                                            size="sm" 
                                            color="primary" 
                                            variant="flat"
                                            className="font-medium"
                                        >
                                            {doc.frontmatter.category}
                                        </Chip>
                                    </div>
                                    
                                    <h2 className="text-xl font-bold text-default-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                                        {doc.frontmatter.title}
                                    </h2>
                                    
                                    <p className="text-default-500 mb-6 line-clamp-3 text-sm">
                                        {doc.frontmatter.excerpt}
                                    </p>
                                    
                                    <div className="flex items-center text-xs text-default-400 mt-auto pt-4 border-t border-default-100">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{doc.frontmatter.readTime} {t('readTime')}</span>
                                        <span className="mx-2">•</span>
                                        <span>{doc.frontmatter.date}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
