/**
 * НАЗНАЧЕНИЕ: Роутер авторизации и управления сессиями
 * ЗАВИСИМОСТИ: zod, next/headers, @/lib/auth
 * ОСОБЕННОСТИ: HTTP-only cookies, JWT auth, CI-fallback
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signAuthToken } from "@/lib/auth";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input }) => {
      let correctPassword = process.env.ADMIN_PASSWORD;

      // В среде CI или тестах разрешаем тестовый пароль как запасной вариант
      if ((process.env.CI || process.env.NODE_ENV === 'test') && !correctPassword) {
        correctPassword = "test-password";
      }

      if (process.env.CI || process.env.NODE_ENV === 'test') {
        console.log("CI/Test Debug: Auth attempt. Expected pwd set:", !!correctPassword);
      }

      if (!correctPassword || input.password !== correctPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Неверный пароль",
        });
      }

      // Generate the token
      const token = await signAuthToken();
      
      // Set HTTP-only cookie using Next.js cookies API
      const isProd = process.env.NODE_ENV === "production";
      const isTest = process.env.CI || process.env.NODE_ENV === 'test';
      
      const cookieStore = await cookies();
      cookieStore.set("vinoflow_auth_token", token, {
        httpOnly: true,
        secure: isProd && !isTest, // Don't use secure cookies in CI/Test over HTTP
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return { success: true };
    }),
    
  check: publicProcedure.query(({ ctx }) => {
    return { isAuthenticated: ctx.isAuthenticated };
  }),

  logout: publicProcedure.mutation(async () => {
    const cookieStore = await cookies();
    cookieStore.delete("vinoflow_auth_token");
    return { success: true };
  })
});
