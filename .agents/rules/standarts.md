---
trigger: always_on
---

# 📜 VinoFlowApp Development Standards (Strict Rules)

## 🚨 CORE GUIDELINES (Zero Tolerance)
1. **No `any` or `as any`**: Strict types and exact literals only. A GitHub Action automatically blocks merges if `any` is detected.
2. **Verification**: ALWAYS run `npm run typecheck && npm run lint` locally via terminal and ensure 0 errors before reporting task completion.
3. **Documentation**: EVERY file must start with a Russian documentation block: `НАЗНАЧЕНИЕ`, `ЗАВИСИМОСТИ`, `ОСОБЕННОСТИ`. Complex logic must be commented in Russian. Delete existing English comments.
4. **i18n**: STRICT PROHIBITION on hardcoded text in components. Use `next-intl`. Update `ru.json`, `de.json`, and `en.json` simultaneously and atomically to preserve nested keys.
5. **Mobile First**: Design for iPhone SE (375px) first using Tailwind CSS 4. Use base classes for mobile; apply `md:`, `lg:`, `xl:` only for larger screens. Use `brand-600` and `bg-tech-gradient`. Interactive elements must inherit from HeroUI.

## 🔄 Data & Sync Pipeline (Chain of Responsibility)
**Source of Truth:** Local Zustand store synchronized to Turso via tRPC (`protectedProcedure`).
When adding a new field (e.g., to Barrels, Readings, Additions), update ALL layers:
1. **DB Layer**: `prisma/schema.prisma`
2. **Sync Types**: `src/types/sync.ts` (Sync... interfaces)
3. **Zod Schema**: `src/server/api/routers/sync.ts`
4. **Mapping Layer**: `src/lib/sync/mapping.ts` (Functions `map...ToSync` - CRITICAL POINT!)
5. **Store Layer**: `useFermentationStore.ts` (Update interface & `hydrateFromServer`)
*Rule of "Clean Data"*: Store pure values in DB and Stores (e.g. `42`). Decorative labels (`Бочка №42`) must be added in components via i18n. Do NOT hardcode prefixes in mapping logic.

## 🏛 Layout Architecture (Next.js 15 App Router)
- **`src/app/layout.tsx`** (Root): MUST contain `<html>`, `<body>`, `globals.css`, fonts. NO business logic or providers.
- **`src/app/[locale]/layout.tsx`** (Local): ONLY providers and navigation. NO `<html>` or `<body>`.
- **`src/app/providers.tsx`**: MUST wrap all providers (including `HeroUIProvider`) in `framer-motion`'s `<LazyMotion features={domAnimation}>` to prevent runtime crashes.

## 🚀 Performance & UI
- Maintain UI smoothness for 200+ barrels.
- Wrap list item components in `React.memo`.
- Wrap complex calculations and array filtering in `useMemo`.
- Avoid anonymous functions in props (use `useCallback`) to prevent render cascades.
- Provide Loading states using HeroUI `Skeleton` or spinners.

## 🛠 Refactoring & Commit Algorithm
1. Check Prisma schema vs Zustand types.
2. Update Zod schema in `syncRouter` first.
3. Extract all strings to `messages/*.json` before committing code.
4. **Clean up**: Remove all unused imports, variables, and commented code.
5. **Local Verification**: `npm run typecheck && npm run lint`.
6. **Commit**: Use Conventional Commits (e.g., `feat(fermentation): add new barrel field`).