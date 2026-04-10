# VinoFlow 🍷

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![HeroUI](https://img.shields.io/badge/UI-HeroUI-purple?style=flat-square)](https://heroui.com/)
[![i18n](https://img.shields.io/badge/i18n-EN_DE_RU-green?style=flat-square)](https://next-intl-docs.vercel.app/)
[![PWA](https://img.shields.io/badge/PWA-ready-orange?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Tests](https://img.shields.io/badge/Tests-Vitest-yellow?style=flat-square)](https://vitest.dev/)

---

> 🇷🇺 [Русский](#русский) · 🇩🇪 [Deutsch](#deutsch) · 🇬🇧 [English](#english)

---

## English

### What is VinoFlow?

**VinoFlow** is a precision enology toolkit for winemakers and cellar masters. It provides professional-grade calculation tools for everyday winemaking tasks — from SO₂ additions and alcohol conversion to complex multi-batch blending.

### Calculators

| Tool | Description |
|---|---|
| **SO₂ Calculator** | Calculates the required SO₂ addition (gas, powder, or liquid) based on target delta and volume |
| **SR Calculator (Auf/In)** | Computes Süßreserve dosage in two modes: as a percentage added or as a percentage of final volume |
| **SR Blending** | Determines blending volumes to hit a target sugar content using the lever rule |
| **Multi-Batch Blending** | Assembles any number of wine batches to achieve a desired final alcohol or sugar target |
| **Alcohol Converter** | Converts between g/L and % vol alcohol |

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2 (App Router) |
| Language | TypeScript 5 |
| UI Library | HeroUI v2 + Tailwind CSS v4 |
| Animations | Framer Motion |
| State Management | Zustand |
| i18n | next-intl (EN / DE / RU) |
| PWA | @ducanh2912/next-pwa |
| Testing | Vitest + Testing Library |

### Project Structure

```
vinoFlowApp/
├── messages/                     # i18n translations
│   ├── en.json                   # English
│   ├── de.json                   # German
│   └── ru.json                   # Russian
├── public/                       # Static assets
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── favicon.ico
│   └── manifest.json             # PWA manifest
├── src/
│   ├── app/
│   │   ├── [locale]/             # Localized routes (EN/DE/RU)
│   │   │   ├── so2-rechner/      # SO₂ Calculator
│   │   │   ├── sr-rechner-auf-in/# SR Calculator (Auf/In)
│   │   │   ├── sr-verschnitt-rechner/ # SR Blending
│   │   │   ├── mehrfach-verschnitt/   # Multi-Batch Blending
│   │   │   ├── alkohol-umrechner/     # Alcohol Converter
│   │   │   └── layout.tsx        # Root layout + metadata
│   │   └── providers.tsx         # HeroUI & theme providers
│   ├── components/
│   │   ├── layout/               # Header, Footer, BottomNav
│   │   └── ui/                   # Shared components (ProductTypeSelector, SaveFeedback)
│   ├── lib/
│   │   ├── calculations.ts       # All enological math functions
│   │   └── store/                # Zustand stores (history)
│   ├── hooks/                    # Custom React hooks
│   ├── tests/
│   │   └── calculations.test.ts  # 19+ edge-case unit tests
│   ├── types/                    # Shared TypeScript types
│   └── middleware.ts             # i18n routing middleware
├── next.config.mjs               # Next.js + PWA config
├── tailwind.config.ts
├── vitest.config.ts
└── package.json
```

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

---

## Русский

### Что такое VinoFlow?

**VinoFlow** — это профессиональный набор инструментов, разработанный для энологов и виноделов. Приложение обеспечивает точные расчеты для ежедневных задач в погребе: от добавления SO₂ и конвертации спирта до сложного купажа из нескольких партий.

### Калькуляторы

| Инструмент | Описание |
|---|---|
| **Калькулятор SO₂** | Рассчитывает необходимую дозу SO₂ (газ, порошок или жидкость) по целевому значению ΔSO₂ и объему |
| **SR Калькулятор (Auf/In)** | Вычисляет дозировку Süßreserve двумя способами: как процент добавки или как процент конечного объема |
| **Купаж SR** | Определяет объемы купажа для достижения целевого содержания сахара по правилу рычага |
| **Многокомпонентный купаж** | Ассамбляж любого количества партий вина для получения заданного конечного показателя |
| **Конвертер спирта** | Перевод между г/л и % об. для содержания спирта |

### Технологии

| Уровень | Технология |
|---|---|
| Фреймворк | Next.js 15.2 (App Router) |
| Язык | TypeScript 5 |
| UI | HeroUI v2 + Tailwind CSS v4 |
| Анимации | Framer Motion |
| Состояние | Zustand |
| Локализация | next-intl (EN / DE / RU) |
| PWA | @ducanh2912/next-pwa |
| Тесты | Vitest + Testing Library |

### Запуск проекта

```bash
# Установка зависимостей
npm install

# Сервер разработки
npm run dev

# Запуск тестов
npm test

# Продакшн сборка
npm run build
```

---

## Deutsch

### Was ist VinoFlow?

**VinoFlow** ist ein professionelles Berechnungswerkzeug für Önologen und Kellermeister. Es bietet präzise Kalkulationstools für den täglichen Kellerbetrieb — von SO₂-Zugaben und Alkohol-Umrechnung bis hin zur Verschnittberechnung für mehrere Chargen.

### Kalkulatoren

| Werkzeug | Beschreibung |
|---|---|
| **SO₂-Rechner** | Berechnet die benötigte SO₂-Menge (Gas, Pulver oder Flüssig) anhand des Zielwerts und Volumens |
| **SR-Rechner (Auf/In)** | Berechnet die Süßreserve-Dosierung auf zwei Arten: als Prozentsatz der Zugabe oder des Endvolumens |
| **SR-Verschnitt** | Ermittelt Verschnittmengen zur Erreichung eines Zielzuckergehalts nach der Kreuzmethode |
| **Mehrfach-Verschnitt** | Assemblage aus beliebig vielen Chargen zum Erreichen eines gewünschten Endwerts |
| **Alkohol-Umrechner** | Umrechnung zwischen g/L und Vol.-% für Alkohol |

### Technologie-Stack

| Ebene | Technologie |
|---|---|
| Framework | Next.js 15.2 (App Router) |
| Sprache | TypeScript 5 |
| UI | HeroUI v2 + Tailwind CSS v4 |
| Animationen | Framer Motion |
| State Management | Zustand |
| Internationalisierung | next-intl (EN / DE / RU) |
| PWA | @ducanh2912/next-pwa |
| Tests | Vitest + Testing Library |

### Erste Schritte

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Tests ausführen
npm test

# Produktions-Build
npm run build
```

---

Developed with ❤️ by **Dmitri Nedioglo**
