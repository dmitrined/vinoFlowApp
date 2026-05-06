/**
 * НАЗНАЧЕНИЕ: Страница Impressum (Юридические данные владельца)
 * ЗАВИСИМОСТИ: next-intl, lucide-react
 * ОСОБЕННОСТИ: Обязательная страница для немецкого рынка. Минималистичный премиум-дизайн.
 */

import { getTranslations } from 'next-intl/server';
import { User, MapPin, Mail, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function ImpressumPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    await params;
    const t = await getTranslations('Impressum');
    const tCommon = await getTranslations('Layout');

    const details = [
        {
            icon: <User className="w-5 h-5 text-brand-400" />,
            label: t('owner'),
            value: t('placeholder-name')
        },
        {
            icon: <MapPin className="w-5 h-5 text-brand-400" />,
            label: t('address'),
            value: t('placeholder-address')
        },
        {
            icon: <Mail className="w-5 h-5 text-brand-400" />,
            label: t('contact'),
            value: t('placeholder-email')
        },
        {
            icon: <User className="w-5 h-5 text-brand-400" />,
            label: t('responsible'),
            value: t('placeholder-name')
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors mb-12 group text-sm font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    {tCommon('menu.home')}
                </Link>

                <header className="mb-16">
                    <h1 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 text-lg">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="space-y-8">
                        {details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    {detail.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                                        {detail.label}
                                    </p>
                                    <p className="text-zinc-900 dark:text-zinc-100 text-lg font-medium">
                                        {detail.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 p-6 bg-brand-50 border border-brand-100 rounded-2xl">
                    <p className="text-sm text-slate-500 leading-relaxed italic">
                        {t('disclaimer-note')}
                    </p>
                </div>
            </div>
        </div>
    );
}
