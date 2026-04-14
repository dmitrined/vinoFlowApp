# VinoFlow 🍷

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-blue?style=flat-square&logo=trpc)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Turso](https://img.shields.io/badge/Turso-LibSQL-4fd1c5?style=flat-square)](https://turso.tech/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![HeroUI](https://img.shields.io/badge/UI-HeroUI-purple?style=flat-square)](https://heroui.com/)
[![i18n](https://img.shields.io/badge/i18n-EN_DE_RU-green?style=flat-square)](https://next-intl-docs.vercel.app/)

---

> 🇷🇺 [Русский](#русский) · 🇩🇪 [Deutsch](#deutsch) · 🇬🇧 [English](#english)

---

## English

### What is VinoFlow?

**VinoFlow** is a precision enology toolkit and cellar management platform. It combines professional-grade calculation tools with a **Secure Cloud Sync Engine** for real-time fermentation tracking across all your devices.

### Key Features

| Feature | Description |
|---|---|
| **Fermentation Tracker** | Dynamic monitoring of Oechsle and Temperature with real-time charting. |
| **Secure Sync (LWW)** | Backend synchronization via tRPC and Turso (libSQL). "Last Write Wins" resolution for offline-first reliability. |
| **Enological Tools** | Professional calculators: SO₂, SR, Blending, Acid Management, and Chaptalization. |
| **Protected Access** | Secure administrative area gated by JWT-based authentication. |

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15.3 (App Router) |
| **API Layer** | tRPC v11 (Type-safe client-server communication) |
| **Database** | Turso (libSQL) + Prisma ORM |
| **Auth** | JWT (Jose) + Protected Procedures |
| **State** | Zustand (with persistent LocalStorage) |
| **UI** | HeroUI (NextUI) + Tailwind CSS + Framer Motion |
| **PWA** | @ducanh2912/next-pwa (Offline Ready) |

### Project Structure

```
vinoFlowApp/
├── prisma/                       # Database schema & migrations
├── messages/                     # i18n translations (EN/DE/RU)
├── public/                       # Static assets & PWA manifest
├── src/
│   ├── app/[locale]/             # Localized routes
│   │   ├── fermentation/         # Secured Fermentation Module
│   │   ├── [calculators]/        # Oenology tools (SO2, SR, Acid, etc.)
│   │   └── api/trpc/[trpc]/      # tRPC endpoint
│   ├── components/
│   │   ├── auth/                 # Login & Protection UI
│   │   ├── layout/               # Dynamic Headers & Indicators
│   │   └── SyncEngine.tsx        # Cloud Synchronization Orchestrator
│   ├── server/                   # Backend Logic
│   │   ├── api/                  # tRPC Routers (Sync, Auth)
│   │   └── db.ts                 # Prisma/Turso Client
│   ├── lib/store/                # Zustand Offline Stores
│   ├── types/                    # Domain-driven TypeScript definitions
│   └── middleware.ts             # i18n & Auth guarding
```

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Русский

### Что такое VinoFlow?

**VinoFlow** — это профессиональный набор инструментов для энологов и платформа для управления погребом. Приложение сочетает в себе точные калькуляторы и **синхронизируемый трекер брожения**, работающий на всех ваших устройствах в реальном времени.

### Основные возможности

| Функция | Описание |
|---|---|
| **Мониторинг брожения** | Динамический контроль Oechsle и температуры с графиками в реальном времени. |
| **Облачная синхронизация** | Движок на базе tRPC и Turso (libSQL). Стратегия "Last Write Wins" для надежной работы офлайн. |
| **Энологические инструменты** | Профессиональные расчеты: SO₂, сахара, купажа, кислотности и шаптализации. |
| **Защищенный доступ** | Административный раздел, защищенный авторизацией на базе JWT. |

---

## Deutsch

### Was ist VinoFlow?

**VinoFlow** ist ein Präzisions-Werkzeugsatz für Önologen und eine Plattform für das Kellermanagement. Es kombiniert professionelle Kalkulationstools mit einer **Cloud-Synchronisation** zur Echtzeit-Überwachung der Gärung auf allen Ihren Geräten.

### Hauptfunktionen

| Funktion | Beschreibung |
|---|---|
| **Gärungs-Tracker** | Dynamische Überwachung von Oechsle und Temperatur mit Echtzeit-Diagrammen. |
| **Cloud-Sync (LWW)** | Backend-Synchronisierung via tRPC und Turso (libSQL). "Last Write Wins" Strategie für absolute Datensicherheit. |
| **Önologische Tools** | Profi-Rechner: SO₂, SR, Verschnitt, Säuremanagement und Chaptalisierung. |
| **Geschützter Bereich** | Sicherer Administrationsbereich, geschützt durch JWT-basierte Authentifizierung. |

---

Developed with ❤️ by **Dmitri Nedioglo**
