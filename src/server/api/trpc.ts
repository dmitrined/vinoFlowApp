/**
 * НАЗНАЧЕНИЕ: Конфигурация контекста и инициализация tRPC сервера
 * ЗАВИСИМОСТИ: @trpc/server, superjson, zod
 * ОСОБЕННОСТИ: Форматирование ошибок Zod и экспорт базовых процедур (publicProcedure)
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * 1. CONTEXT
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
