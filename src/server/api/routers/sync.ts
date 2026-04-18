/**
 * НАЗНАЧЕНИЕ: Серверный роутер для синхронизации данных (tRPC)
 * ЗАВИСИМОСТИ: zod, @/server/api/trpc, Prisma
 * ОСОБЕННОСТИ: Реализует логику Upsert и разрешение конфликтов "Last Write Wins" через updatedAt
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// Zod-схемы, соответствующие моделям Prisma и интерфейсам фронтенда
const barrelSchema = z.object({
  id: z.string(),
  name: z.string(),
  volume: z.number().nullable().optional(),
  status: z.string(),
  notes: z.string().nullable().optional(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  synced: z.boolean().optional(),
});

const readingSchema = z.object({
  id: z.string(),
  barrelId: z.string(),
  date: z.string(),
  oechsle: z.number().nullable().optional(),
  temperature: z.number().nullable().optional(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  synced: z.boolean().optional(),
});

const additionSchema = z.object({
  id: z.string(),
  barrelId: z.string(),
  date: z.string(),
  name: z.string(),
  dosage: z.string(),
  unit: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  synced: z.boolean().optional(),
});

const calculationSchema = z.object({
  id: z.string(),
  type: z.string(),
  date: z.number(),
  result: z.string(),
  unit: z.string().nullable().optional(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  synced: z.boolean().optional(),
});

export const syncRouter = createTRPCRouter({
  
  /**
   * Загрузка измененных данных пользователя для синхронизации (Delta Sync)
   */
  pullAll: protectedProcedure
    .input(z.object({ since: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const sinceDate = input?.since ? new Date(input.since) : new Date(0);
      const now = new Date();

      const [barrels, readings, additions, history] = await Promise.all([
        ctx.db.barrel.findMany({ where: { updatedAt: { gt: sinceDate } } }),
        ctx.db.reading.findMany({ where: { updatedAt: { gt: sinceDate } } }),
        ctx.db.addition.findMany({ where: { updatedAt: { gt: sinceDate } } }),
        ctx.db.calculationRecord.findMany({ where: { updatedAt: { gt: sinceDate } } }),
      ]);

      // Форматирование дат и BigInt в JSON-совместимые типы
      return {
        barrels: barrels.map(b => ({ ...b, updatedAt: b.updatedAt.toISOString(), synced: true })),
        readings: readings.map(r => ({ ...r, updatedAt: r.updatedAt.toISOString(), synced: true })),
        additions: additions.map(a => ({ ...a, updatedAt: a.updatedAt.toISOString(), synced: true })),
        history: history.map(h => ({ ...h, updatedAt: h.updatedAt.toISOString(), date: Number(h.date), synced: true })),
        serverTime: now.toISOString(),
      };
    }),

  /**
   * Синхронизация бочек (Upsert)
   */
  pushBarrels: protectedProcedure
    .input(z.array(barrelSchema))
    .mutation(async ({ ctx, input }) => {
      const syncedIds: string[] = [];
      const dbIds = input.map(i => i.id);
      
      const existing = await ctx.db.barrel.findMany({
        where: { id: { in: dbIds } },
        select: { id: true, updatedAt: true }
      });
      const existingMap = new Map(existing.map(e => [e.id, e.updatedAt.getTime()]));

      for (const barrel of input) {
        const incomingTime = new Date(barrel.updatedAt).getTime();
        const existingTime = existingMap.get(barrel.id) || 0;

        // Обновляем только если входящие данные новее серверных
        if (incomingTime > existingTime) {
          const data = {
            name: barrel.name,
            volume: barrel.volume || null,
            status: barrel.status,
            notes: barrel.notes || null,
            updatedAt: new Date(barrel.updatedAt),
            isDeleted: barrel.isDeleted,
          };
          
          await ctx.db.barrel.upsert({
            where: { id: barrel.id },
            update: data,
            create: { id: barrel.id, ...data }
          });
        }
        syncedIds.push(barrel.id);
      }
      return { syncedIds };
    }),

  /**
   * Синхронизация замеров (Upsert)
   */
  pushReadings: protectedProcedure
    .input(z.array(readingSchema))
    .mutation(async ({ ctx, input }) => {
      const syncedIds: string[] = [];
      const dbIds = input.map(i => i.id);
      
      const existing = await ctx.db.reading.findMany({
        where: { id: { in: dbIds } },
        select: { id: true, updatedAt: true }
      });
      const existingMap = new Map(existing.map(e => [e.id, e.updatedAt.getTime()]));

      for (const item of input) {
        const incomingTime = new Date(item.updatedAt).getTime();
        const existingTime = existingMap.get(item.id) || 0;

        if (incomingTime > existingTime) {
          const data = {
            barrelId: item.barrelId,
            date: item.date,
            oechsle: item.oechsle || null,
            temperature: item.temperature || null,
            updatedAt: new Date(item.updatedAt),
            isDeleted: item.isDeleted,
          };
          
          await ctx.db.reading.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data }
          });
        }
        syncedIds.push(item.id);
      }
      return { syncedIds };
    }),

  /**
   * Синхронизация добавок (Upsert)
   */
  pushAdditions: protectedProcedure
    .input(z.array(additionSchema))
    .mutation(async ({ ctx, input }) => {
      const syncedIds: string[] = [];
      const dbIds = input.map(i => i.id);
      
      const existing = await ctx.db.addition.findMany({
        where: { id: { in: dbIds } },
        select: { id: true, updatedAt: true }
      });
      const existingMap = new Map(existing.map(e => [e.id, e.updatedAt.getTime()]));

      for (const item of input) {
        const incomingTime = new Date(item.updatedAt).getTime();
        const existingTime = existingMap.get(item.id) || 0;

        if (incomingTime > existingTime) {
          const data = {
            barrelId: item.barrelId,
            date: item.date,
            name: item.name,
            dosage: item.dosage,
            unit: item.unit,
            updatedAt: new Date(item.updatedAt),
            isDeleted: item.isDeleted,
          };
          
          await ctx.db.addition.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data }
          });
        }
        syncedIds.push(item.id);
      }
      return { syncedIds };
    }),

  /**
   * Синхронизация истории расчетов калькуляторов (Upsert)
   */
  pushHistory: protectedProcedure
    .input(z.array(calculationSchema))
    .mutation(async ({ ctx, input }) => {
      const syncedIds: string[] = [];
      const dbIds = input.map(i => i.id);
      
      const existing = await ctx.db.calculationRecord.findMany({
        where: { id: { in: dbIds } },
        select: { id: true, updatedAt: true }
      });
      const existingMap = new Map(existing.map(e => [e.id, e.updatedAt.getTime()]));

      for (const item of input) {
        const incomingTime = new Date(item.updatedAt).getTime();
        const existingTime = existingMap.get(item.id) || 0;

        if (incomingTime > existingTime) {
          const data = {
            type: item.type,
            date: BigInt(item.date),
            result: item.result,
            unit: item.unit || null,
            updatedAt: new Date(item.updatedAt),
            isDeleted: item.isDeleted,
          };
          
          await ctx.db.calculationRecord.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data }
          });
        }
        syncedIds.push(item.id);
      }
      return { syncedIds };
    }),
});
