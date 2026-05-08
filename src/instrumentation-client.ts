/**
 * НАЗНАЧЕНИЕ: Конфигурация Sentry для клиентской части
 * ЗАВИСИМОСТИ: @sentry/nextjs
 * ОСОБЕННОСТИ: Отслеживание ошибок в браузере пользователя.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Настройка трассировки
  tracesSampleRate: 1.0,

  // Настройка захвата ошибок
  debug: false,
});
