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


## 🏛 Layout Architecture (Next.js 15 App Router)
- **`src/app/layout.tsx`** (Root): MUST contain `<html>`, `<body>`, `globals.css`, fonts. NO business logic or providers.
- **`src/app/[locale]/layout.tsx`** (Local): ONLY providers and navigation. NO `<html>` or `<body>`.
- **`src/app/providers.tsx`**: MUST wrap all providers (including `HeroUIProvider`) in `framer-motion`'s `<LazyMotion features={domAnimation}>` to prevent runtime crashes.

## 🚀 Performance & UI
- Wrap list item components in `React.memo`.
- Wrap complex calculations and array filtering in `useMemo`.
- Avoid anonymous functions in props (use `useCallback`) to prevent render cascades.
- Provide Loading states using HeroUI `Skeleton` or spinners.

## 🧪 Testing
- **Unit-тесты (Vitest)**: Обязательны для всех математических формул в `src/tests`.
- **E2E-тесты (Playwright)**: Проверка доступности страниц и базового взаимодействия в `tests/`.

## 📚 Knowledge Hub (MDX)
- Статьи в `src/content/docs/[locale]/`.
- Frontmatter: `title`, `excerpt`, `category`, `relatedTools`.
- Таблицы в MDX: Писать на чистом HTML для стабильности рендеринга.

## 🛠 Refactoring & Commit Algorithm
1. Extract all strings to `messages/*.json` before committing code.
2. **Clean up**: Remove all unused imports, variables, and commented code.
3. **Local Verification**: `npm run typecheck && npm run lint`.
4. **Commit**: Use Conventional Commits (e.g., `feat(fermentation): add new barrel field`).