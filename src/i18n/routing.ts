/**
 * НАЗНАЧЕНИЕ: Конфигурация маршрутизации и i18n навигации
 * ЗАВИСИМОСТИ: next-intl
 * ОСОБЕННОСТИ: Определение локалей ('en', 'de', 'ru') и экспорт типизированных методов навигации
 */

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'de', 'ru'],

    // Used when no locale matches
    defaultLocale: 'de'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
