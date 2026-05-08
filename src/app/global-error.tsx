/**
 * НАЗНАЧЕНИЕ: Глобальный обработчик ошибок для всего приложения
 * ЗАВИСИМОСТИ: @sentry/nextjs, next/error
 * ОСОБЕННОСТИ: Отправляет отчеты о критических ошибках рендеринга в Sentry
 */
'use client';

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* statusCode={0} renders a generic error message */}
        <Error statusCode={0} />
      </body>
    </html>
  );
}
