/**
 * НАЗНАЧЕНИЕ: Клиентское инструментирование для отслеживания переходов роутера в Sentry
 * ЗАВИСИМОСТИ: @sentry/nextjs
 * ОСОБЕННОСТИ: Клиентские переходы роутера
 */

import * as Sentry from "@sentry/nextjs";

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
