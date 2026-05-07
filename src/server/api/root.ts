import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { ok: true };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
