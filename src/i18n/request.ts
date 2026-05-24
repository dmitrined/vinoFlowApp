/**
 * НАЗНАЧЕНИЕ: Конфигурация запроса i18n для динамического импорта сообщений
 * ЗАВИСИМОСТИ: next-intl/server, @/i18n/routing
 * ОСОБЕННОСТИ: Определение текущей локали и подгрузка соответствующего JSON файла перевода
 */

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Соответствует сегменту [locale]
    let locale = await requestLocale;

    // Проверка корректности локали
    if (!locale || !routing.locales.includes(locale as 'en' | 'de' | 'ru')) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
