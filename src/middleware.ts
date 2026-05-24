/**
 * НАЗНАЧЕНИЕ: Промежуточное ПО (Middleware) для интернационализации (i18n)
 * ЗАВИСИМОСТИ: next-intl/middleware, @/i18n/routing
 * ОСОБЕННОСТИ: Маршрутизация на основе поддерживаемых локалей
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
