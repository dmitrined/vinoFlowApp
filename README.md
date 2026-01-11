# VinoFlow App 🍷

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![HeroUI](https://img.shields.io/badge/UI-HeroUI-orange?style=flat-square)](https://heroui.com/)
[![i18n](https://img.shields.io/badge/i18n-next--intl-green?style=flat-square)](https://next-intl-docs.vercel.app/)

**VinoFlow** — это профессиональный набор инструментов для энологов и виноделов, обеспечивающий высокую точность расчетов в погребе и современный пользовательский опыт.

---

## 📂 Структура проекта (Полный список файлов)

```text
vinoFlowApp/
├── messages/                    # Словари i18n
│   ├── de.json                  # Немецкий язык
│   ├── en.json                  # Английский язык
│   └── ru.json                  # Русский язык
├── public/                      # Статические ресурсы
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── manifest.json            # PWA конфигурация
│   ├── favicon.ico
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # Интернационализированные роуты
│   │   │   ├── alkohol-umrechner/
│   │   │   │   ├── page.tsx     # Страница конвертера спирта
│   │   │   │   └── FormulAlcCalculation.tsx
│   │   │   ├── mehrfach-verschnitt/
│   │   │   │   ├── page.tsx     # Страница сложного купажа
│   │   │   │   └── FormulMultiCalc.tsx
│   │   │   ├── sr-rechner-auf-in/
│   │   │   │   ├── page.tsx     # Страница расчета сахара
│   │   │   │   └── FormulPercentSRCalc.tsx
│   │   │   ├── sr-verschnitt-rechner/
│   │   │   │   ├── page.tsx     # Страница купажа SR
│   │   │   │   └── FormulSRCalc.tsx
│   │   │   ├── globals.css      # Глобальные стили (Tailwind 4)
│   │   │   ├── layout.tsx       # Макет локали
│   │   │   └── page.tsx         # Главная страница (Localized)
│   │   ├── layout.tsx           # Корневой макет
│   │   └── providers.tsx        # HeroUI & NextThemes провайдеры
│   ├── components/              # React компоненты
│   │   └── layout/              # Элементы интерфейса
│   │       ├── BottomHeader.tsx # Мобильная навигация
│   │       ├── footer.tsx       # Футер
│   │       └── header.tsx       # Шапка с выбором языка
│   ├── i18n/                    # Конфигурация next-intl
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── lib/                     # Бизнес-логика
│   │   └── calculations.ts      # Модуль математических расчетов
│   ├── tests/                   # Тестирование (Vitest)
│   │   ├── calculations.test.ts # Тесты для калькуляторов
│   │   └── setup.ts             # Настройка окружения
│   └── middleware.ts            # Middleware для i18n роутинга
├── DEVELOPMENT_STANDARDS.md      # Стандарты разработки
├── next.config.mjs              # Конфигурация Next.js + PWA
├── package.json                 # Зависимости и скрипты
├── tailwind.config.ts           # Настройки Tailwind
├── tsconfig.json                # Настройки TypeScript
├── vitest.config.ts             # Настройки Vitest
└── README.md                    # Этот файл
```

---

## ✨ Основные возможности

- **SR Rechner (Auf/In)**: Расчет добавления Süßreserve двумя способами.
- **Alkohol-Umrechner**: Конвертация между г/л и % об. спирта.
- **SR-Verschnitt**: Достижение целевого сахара по правилу смешивания.
- **Mehrfach-Verschnitt**: Ассамбляж любого количества партий вина.

---

## 🛠 Технологический стек

*   **Framework**: Next.js 15
*   **UI**: HeroUI (v2)
*   **Animations**: Framer Motion
*   **i18n**: next-intl
*   **Testing**: Vitest

---

Developed by **Dmitri Nedioglo**.
