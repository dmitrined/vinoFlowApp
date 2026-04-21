/**
 * НАЗНАЧЕНИЕ: Утилиты для тестирования с поддержкой i18n и моками роутинга
 * ЗАВИСИМОСТИ: @testing-library/react, next-intl, vitest
 * ОСОБЕННОСТИ: Обертка renderWithProviders для корректной работы компонентов с переводами
 */

import React, { ReactElement, ReactNode, ComponentPropsWithoutRef } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';
import enMessages from '../../../messages/en.json';

// Мок роутинга Next.js
vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
        };
    },
    usePathname() {
        return '';
    },
    useParams() {
        return {};
    },
    useSearchParams() {
        return new URLSearchParams();
    }
}));

// Мок локализованного роутинга приложения
vi.mock('@/i18n/routing', () => ({
    Link: ({ children, href, ...props }: ComponentPropsWithoutRef<'a'>) => <a href={href} {...props}>{children}</a>,
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => ''
}));

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
        <NextIntlClientProvider locale="en" messages={enMessages}>
            {children}
        </NextIntlClientProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Реэкспорт всего функционала RTL
export * from '@testing-library/react';
// Переопределение метода render
export { customRender as render };
