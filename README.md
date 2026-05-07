# VinoFlow 🍷

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-blue?style=flat-square&logo=trpc)](https://trpc.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![HeroUI](https://img.shields.io/badge/UI-HeroUI-purple?style=flat-square)](https://heroui.com/)
[![i18n](https://img.shields.io/badge/i18n-EN_DE_RU-green?style=flat-square)](https://next-intl-docs.vercel.app/)

---

> 🇷🇺 [Русский](#русский) · 🇩🇪 [Deutsch](#deutsch) · 🇬🇧 [English](#english)

---

## English

### What is VinoFlow?

**VinoFlow** is a high-precision, **stateless enology toolkit** designed for winemakers who value speed, privacy, and technical excellence. It provides professional-grade calculation tools that run entirely on the client side, ensuring your data never leaves your device.

### Key Features

| Feature | Description |
|---|---|
| **Enological Tools** | Professional calculators: SO₂, Blending (Verschnitt), Alcohol Conversion, Acid Management, and Chaptalization. |
| **Stateless Architecture** | Zero database dependencies. Calculations are performed in real-time. No login, no tracking, total privacy. |
| **Knowledge Hub & SEO** | Fully localized MDX-based documentation with professional enological guides and technical SEO optimization. |
| **PWA Support** | Works offline as a standalone mobile application. Ideal for use in cellars with poor connectivity. |
| **Modern UI** | Premium "Tech SaaS" aesthetic built with HeroUI and Framer Motion for smooth, hardware-accelerated interactions. |

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15.3 (App Router) |
| **API Layer** | tRPC v11 (Internal logic orchestration) |
| **State** | Functional (Lightweight client-side state) |
| **UI** | HeroUI + Tailwind CSS 4 + Framer Motion |
| **i18n** | next-intl (Full EN/DE/RU support) |
| **PWA** | @ducanh2912/next-pwa (Offline Ready) |
| **Testing** | Vitest (Unit) + Playwright (E2E) |

### Project Structure

```
vinoFlowApp/
├── messages/                     # i18n translations (EN/DE/RU)
├── public/                       # Static assets & PWA manifest
├── src/
│   ├── app/[locale]/             # Localized routes
│   │   ├── [calculators]/        # Oenology tools (SO2, SR, Acid, etc.)
│   │   └── api/trpc/[trpc]/      # tRPC internal endpoints
│   ├── components/
│   │   ├── layout/               # Header, Footer, and Navigation
│   │   └── ui/                   # Reusable HeroUI components
│   ├── lib/
│   │   └── calculations/         # Core enological formulas (Strict Math)
│   ├── content/docs/             # MDX Knowledge Hub articles
│   ├── types/                    # Domain-driven TypeScript definitions
│   └── middleware.ts             # i18n routing
```

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests (Vitest)
npm run test

# Run E2E tests (Playwright)
npx playwright test

# Build for production
npm run build
```

---

## Русский

### Что такое VinoFlow?

**VinoFlow** — это высокоточный **автономный набор инструментов** для энологов. Приложение ориентировано на скорость, приватность и техническое совершенство, предоставляя профессиональные калькуляторы, которые работают полностью на стороне клиента.

### Основные возможности

| Функция | Описание |
|---|---|
| **Энологические инструменты** | Профессиональные расчеты: SO₂, купаж, конвертация алкоголя, управление кислотностью и шаптализация. |
| **Stateless-архитектура** | Полное отсутствие базы данных. Все расчеты происходят мгновенно и локально. Никаких паролей и сбора данных. |
| **База знаний (Knowledge Hub)** | Мультиязычные статьи на MDX с профессиональными рекомендациями по виноделию. |
| **Поддержка PWA** | Приложение работает оффлайн и устанавливается на смартфон, что удобно для работы в погребе. |
| **Премиальный UI** | Современный дизайн в стиле "Tech SaaS" с плавными анимациями на базе Framer Motion. |

---

## Deutsch

### Was ist VinoFlow?

**VinoFlow** ist ein hochpräzises, **zustandsloses Önologie-Toolkit** für Winzer. Es bietet professionelle Kalkulationstools, die vollständig clientseitig laufen, wodurch Ihre Daten privat und sicher auf Ihrem Gerät bleiben.

### Hauptfunktionen

| Funktion | Beschreibung |
|---|---|
| **Önologische Tools** | Profi-Rechner: SO₂, Verschnitt, Alkohol-Konverter, Säuremanagement und Chaptalisierung. |
| **Stateless Architektur** | Keine Datenbank-Abhängigkeiten. Berechnungen erfolgen in Echtzeit. Kein Login, kein Tracking, absolute Privatsphäre. |
| **Wissensdatenbank (MDX)** | Mehrsprachige Fachartikel mit önologischen Leitfäden и technischer SEO-Optimierung. |
| **PWA-Unterstützung** | Funktioniert offline als eigenständige App – ideal für den Einsatz im Weinkeller. |
| **Modernes UI** | Premium "Tech SaaS" Ästhetik mit HeroUI und Framer Motion für flüssige Interaktionen. |

---

Developed with ❤️ by **Dmitri Nedioglo**
