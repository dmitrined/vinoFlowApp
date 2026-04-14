import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth";

/**
 * 1. CONTEXT
 * This section defines the "contexts" that are available in the backend API.
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
export const createTRPCContext = async (opts: { headers: Headers; token?: string }) => {
  const isAuthenticated = await verifyAuthToken(opts.token);

  return {
    db,
    isAuthenticated,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 * This is where the tRPC API is initialized, connecting the context and transformer.
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
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the context.isAuthenticated flag and throws an error if false.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `isAuthenticated` as non-nullable
      isAuthenticated: true,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
