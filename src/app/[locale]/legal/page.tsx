/**
 * НАЗНАЧЕНИЕ: Страница Правовой информации (Legal Notice)
 * ЗАВИСИМОСТИ: next-intl, lucide-react, @heroui/react
 * ОСОБЕННОСТИ: Server Component. Использует премиум-дизайн с карточками и градиентами.
 */

import { getTranslations } from 'next-intl/server';
import { ShieldAlert, Copyright, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function LegalPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    await params;
    const t = await getTranslations('Legal');
    const tCommon = await getTranslations('Layout');

    const sections = [
        {
            id: 'disclaimer',
            icon: <ShieldAlert className="w-6 h-6 text-orange-500" />,
            title: t('disclaimer.title'),
            content: t('disclaimer.content'),
            bg: 'bg-orange-50',
            border: 'border-orange-100'
        },
        {
            id: 'external',
            icon: <ExternalLink className="w-6 h-6 text-purple-500" />,
            title: t('external.title'),
            content: t('external.content'),
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors mb-12 group text-sm font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    {tCommon('menu.home')}
                </Link>

                <header className="mb-16">
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="space-y-8">
                    {sections.map((section) => (
                        <section 
                            key={section.id}
                            className={`p-8 rounded-3xl border ${section.border} ${section.bg} transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50`}
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                                        {section.title}
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-sm italic">
                        &copy; {new Date().getFullYear()} VinoFlow Oenology Hub. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}
