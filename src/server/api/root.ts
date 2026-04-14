import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { syncRouter } from "./routers/sync";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { ok: true };
  }),
  auth: authRouter,
  sync: syncRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
