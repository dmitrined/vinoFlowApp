/**
 * НАЗНАЧЕНИЕ: Маппинг MDX (Markdown) тегов в компоненты с Tailwind CSS
 * ЗАВИСИМОСТИ: React
 * ОСОБЕННОСТИ: Исключительно Server Component (без use client). 
 * Таблицы поддерживаются через стандартные теги.
 */

import React from 'react';
import { Link } from '@/i18n/routing';

export const MdxComponents: Record<string, React.ElementType> = {
    h1: (props) => (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-default-900" {...props} />
    ),
    h2: (props) => (
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-default-800 border-b border-default-200 pb-2" {...props} />
    ),
    h3: (props) => (
        <h3 className="text-xl font-medium mt-5 mb-2 text-default-800" {...props} />
    ),
    p: (props) => (
        <p className="text-base leading-relaxed text-default-700 mb-4" {...props} />
    ),
    ul: (props) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-default-700 ml-4" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-default-700 ml-4" {...props} />
    ),
    li: (props) => (
        <li className="text-base" {...props} />
    ),
    a: ({ href, children, ...props }) => {
        const isInternal = href && href.startsWith('/');
        if (isInternal) {
            return (
                <Link href={href} className="text-brand-600 hover:text-brand-700 hover:underline" {...props}>
                    {children}
                </Link>
            );
        }
        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-600 hover:text-brand-700 hover:underline"
                {...props}
            >
                {children}
            </a>
        );
    },
    blockquote: (props) => (
        <blockquote className="border-l-4 border-brand-500 bg-brand-50/50 p-4 rounded-r-lg my-4 italic text-default-700" {...props} />
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
        // Проверка: это инлайн-код или блок? (block code usually has className language-*)
        const isInline = !className;
        if (isInline) {
            return (
                <code className="bg-default-100 text-default-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
            );
        }
        return (
            <code className={`block bg-default-100 p-4 rounded-xl text-sm font-mono overflow-x-auto ${className || ''}`} {...props} />
        );
    },
    pre: (props) => (
        <pre className="mb-4" {...props} />
    ),
    // Таблицы - чистый HTML
    table: (props) => (
        <div className="w-full overflow-x-auto mb-6 rounded-xl border border-default-200">
            <table className="w-full text-left border-collapse text-sm" {...props} />
        </div>
    ),
    thead: (props) => (
        <thead className="bg-default-100 border-b border-default-200" {...props} />
    ),
    th: (props) => (
        <th className="p-3 font-semibold text-default-800 text-sm whitespace-nowrap" {...props} />
    ),
    tbody: (props) => (
        <tbody className="divide-y divide-default-100" {...props} />
    ),
    tr: (props) => (
        <tr className="hover:bg-default-50 transition-colors" {...props} />
    ),
    td: (props) => (
        <td className="p-3 text-default-700 align-middle" {...props} />
    ),
    hr: (props) => (
        <hr className="my-8 border-default-200" {...props} />
    ),
    strong: (props) => (
        <strong className="font-semibold text-default-900" {...props} />
    ),
    // Кастомный компонент заметки
    Note: ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' | 'danger' }) => {
        const colors = {
            info: 'bg-blue-50 border-blue-200 text-blue-800',
            warning: 'bg-warning-50 border-warning-200 text-warning-800',
            danger: 'bg-danger-50 border-danger-200 text-danger-800'
        };
        
        return (
            <div className={`p-4 rounded-xl border-l-4 my-4 ${colors[type]}`}>
                {children}
            </div>
        );
    }
};
