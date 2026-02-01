# FCWO Mannschaftsfahrt

Eine moderne Web-Anwendung zur Verwaltung von Zahlungen und Teilnehmern für Mannschaftsfahrten. Die App ermöglicht es, Teilnehmer hinzuzufügen, deren Zahlungsstatus zu verfolgen und alle Finanzen übersichtlich zu verwalten.

## ✨ Features

- **Zahlungstracking**: Übersichtliche Verwaltung aller Zahlungen pro Teilnehmer
- **Teilnehmerliste**: Hinzufügen, Bearbeiten und Entfernen von Teilnehmern
- **Statusanzeige**: Visuelle Darstellung des Zahlungsstatus (Nicht gezahlt, Teilweise gezahlt, Vollständig gezahlt, Überzahlung)
- **Automatische Berechnungen**: Berechnung von Restbeträgen, Gesamtsummen und offenen Beträgen
- **PostgreSQL Datenbank**: Persistente Speicherung mit Prisma ORM
- **Export & Import**: Daten als CSV oder JSON exportieren und importieren
- **Responsive Design**: Moderne, mobile-freundliche Benutzeroberfläche mit Nuxt UI

## 🚀 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) - Vue.js Meta-Framework
- **Datenbank**: [PostgreSQL](https://www.postgresql.org/) mit [Prisma](https://www.prisma.io/) ORM
- **State Management**: [Pinia](https://pinia.vuejs.org/) - Vue State Management
- **UI Framework**: [Nuxt UI](https://ui.nuxt.com/) - Vue Component Library
- **Tabellen**: [@tanstack/vue-table](https://tanstack.com/table/latest) - Headless Table Library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- **Icons**: [Iconify](https://iconify.design/) mit Lucide Icons
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typisierte JavaScript Superset
- **Linting**: [ESLint](https://eslint.org/) mit [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) - Pre-commit Hooks

## 📦 Installation

### Voraussetzungen

**Lokale Entwicklung:**

- Node.js (Version 18 oder höher)
- pnpm (Version 10.28.2 oder höher)
- PostgreSQL (Version 16 oder höher) - oder Docker für die Datenbank

**Docker (empfohlen):**

- Docker (Version 20.10 oder höher)
- Docker Compose (Version 2.0 oder höher)

### Setup

**Lokale Installation:**

```bash
# Repository klonen
git clone <repository-url>
cd fcwo-mannschaftsfahrt

# Dependencies installieren
pnpm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# DATABASE_URL in .env anpassen

# Datenbank-Schema erstellen
pnpm prisma db push
```

**Docker Setup (empfohlen):**

```bash
# Repository klonen
git clone <repository-url>
cd fcwo-mannschaftsfahrt

# Development-Umgebung starten (App + PostgreSQL + Prisma Studio)
docker-compose -f docker-compose.dev.yml up
```

## 🛠️ Entwicklung

### Scripts

- `pnpm dev` - Startet den Development Server (standardmäßig auf http://localhost:3000)
- `pnpm build` - Baut die Anwendung für Production
- `pnpm preview` - Vorschau der Production Build
- `pnpm lint` - Führt ESLint aus
- `pnpm lint:fix` - Führt ESLint aus und behebt automatisch Fehler
- `pnpm typecheck` - Führt TypeScript Type Checking aus
- `pnpm postinstall` - Führt `nuxt prepare` und `prisma generate` nach Installation aus
- `pnpm prepare` - Initialisiert Husky Git Hooks

### Development Server starten

**Lokale Entwicklung:**

```bash
# PostgreSQL muss laufen und DATABASE_URL in .env konfiguriert sein
pnpm dev
```

**Docker Development (empfohlen):**

```bash
# Alle Services starten (PostgreSQL, Nuxt App, Prisma Studio)
docker-compose -f docker-compose.dev.yml up

# Im Hintergrund starten
docker-compose -f docker-compose.dev.yml up -d

# Logs anzeigen
docker-compose -f docker-compose.dev.yml logs -f app

# Nur Datenbank starten (für lokale Entwicklung)
docker-compose -f docker-compose.dev.yml up db
```

Die Anwendung ist dann unter `http://localhost:3000` erreichbar.
Prisma Studio ist unter `http://localhost:5555` erreichbar.

### Docker Development Features

- **Hot-Reload**: Änderungen am Code werden automatisch übernommen
- **PostgreSQL**: Datenbank läuft im Container (Port 5433)
- **Prisma Studio**: Grafische Datenbank-Oberfläche
- **Isolierte Umgebung**: Keine lokale Node.js/PostgreSQL Installation nötig

## 🐳 Docker Deployment

### Production Build

```bash
# Production Image bauen und starten
docker-compose -f docker-compose.production.yml up -d --build

# Status prüfen
docker-compose -f docker-compose.production.yml ps

# Logs anzeigen
docker-compose -f docker-compose.production.yml logs -f app

# Container stoppen
docker-compose -f docker-compose.production.yml down
```

### Docker Compose Dateien

Das Projekt verwendet separate Compose-Dateien für verschiedene Umgebungen:

**`docker-compose.dev.yml`** - Development:

- **`db`**: PostgreSQL 16 Datenbank (Port 5433)
- **`app`**: Nuxt Development Server mit Hot-Reload (Port 3000)
- **`prisma-studio`**: Grafische Datenbank-Oberfläche (Port 5555)

**`docker-compose.production.yml`** - Production:

- **`db`**: PostgreSQL 16 Datenbank (nur intern erreichbar)
- **`app`**: Optimierter Nuxt Production Build

### Netzwerk-Konfiguration

- **Development**: Alle Services laufen mit exponierten Ports für lokalen Zugriff
- **Production**: Nutzt ein externes Netzwerk (`lruesche-shared-network`) für Nginx Reverse Proxy Integration

## 📁 Projektstruktur

```
fcwo-mannschaftsfahrt/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Globale Styles
│   ├── components/                # Vue Komponenten
│   ├── composables/               # Vue Composables
│   │   ├── useFileExport.ts      # Export/Import Funktionalität
│   │   └── usePaymentUtils.ts    # Zahlungs-Utilities
│   ├── pages/                     # Nuxt Pages
│   │   ├── index.vue             # Startseite
│   │   └── zahlungen.vue         # Zahlungstracking-Seite
│   ├── stores/                    # Pinia Stores
│   │   └── payment.ts            # Payment Store
│   ├── types/                     # TypeScript Typen
│   │   └── payment.ts            # Payment Typen
│   ├── app.config.ts
│   └── app.vue
├── server/
│   ├── api/
│   │   └── payments/             # Payment API Endpoints
│   │       ├── index.get.ts      # GET /api/payments
│   │       └── index.post.ts     # POST /api/payments
│   └── utils/
│       └── db.ts                 # Prisma Client Instanz
├── prisma/
│   ├── schema.prisma             # Datenbank-Schema
│   └── migrations/               # Datenbank-Migrationen
├── public/                        # Statische Assets
├── Dockerfile                     # Multi-stage Docker Build
├── docker-compose.dev.yml         # Docker Compose für Development
├── docker-compose.production.yml  # Docker Compose für Production
├── .dockerignore                  # Docker Build Excludes
├── nuxt.config.ts                 # Nuxt Konfiguration
├── tsconfig.json                  # TypeScript Konfiguration
└── package.json
```

## 📋 Dependencies

### Production Dependencies

- `nuxt` (^4.3.0) - Nuxt Framework
- `@nuxt/ui` (^4.4.0) - Nuxt UI Komponenten
- `@nuxt/image` (^2.0.0) - Nuxt Image Optimierung
- `@nuxtjs/tailwindcss` (6.14.0) - Tailwind CSS Integration für Nuxt
- `tailwindcss` (^4.1.18) - Tailwind CSS Framework
- `@pinia/nuxt` (^0.11.3) - Pinia Integration für Nuxt
- `pinia` (^3.0.4) - Vue State Management
- `@prisma/client` (^7.3.0) - Prisma Database Client
- `@prisma/adapter-pg` (^7.3.0) - Prisma PostgreSQL Adapter
- `pg` (^8.18.0) - PostgreSQL Client
- `@tanstack/vue-table` (^8.21.3) - Headless Table Library
- `@iconify-json/lucide` (^1.2.87) - Lucide Icons für Iconify
- `@iconify-json/simple-icons` (^1.2.68) - Simple Icons für Iconify

### Development Dependencies

- `typescript` (^5.9.3) - TypeScript Support
- `vue-tsc` (^3.2.4) - Vue TypeScript Compiler
- `prisma` (^7.3.0) - Prisma CLI
- `eslint` (^9.39.2) - ESLint Linter
- `@nuxt/eslint` (^1.13.0) - Nuxt ESLint Integration
- `@antfu/eslint-config` (^7.2.0) - ESLint Konfiguration von Anthony Fu
- `eslint-plugin-format` (^1.3.1) - ESLint Format Plugin
- `eslint-plugin-tailwindcss` (4.0.0-beta.0) - Tailwind CSS ESLint Plugin
- `husky` (^9.1.7) - Git Hooks

## ⚙️ Konfiguration

### Umgebungsvariablen

Erstelle eine `.env` Datei basierend auf `.env.example`:

```bash
# Development (lokal mit Docker)
DATABASE_URL="postgresql://fcwo_user:fcwo_dev_password@localhost:5433/fcwo_mannschaftsfahrt"

# Production
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### ESLint

Konfiguriert mit `@antfu/eslint-config`, aktiviert Formatters, Vue Support und Tailwind CSS Plugin.

### TypeScript

Konfiguriert mit Nuxt TypeScript References für optimale Type-Safety.

### Package Manager

Verwendet `pnpm@10.28.2` als Package Manager.

### Docker

Die Anwendung ist vollständig containerisiert mit:

- **Multi-stage Dockerfile**: Optimiert für minimale Image-Größe
- **Docker Compose**: Separate Dateien für Development und Production
- **PostgreSQL**: Datenbank läuft als Container
- **Healthchecks**: Automatische Überwachung der Services

## 💾 Datenverwaltung

Die Anwendung speichert alle Daten in einer PostgreSQL-Datenbank. Die Datenbank wird über Prisma ORM verwaltet.

### Prisma Befehle

```bash
# Schema zur Datenbank pushen (Development)
pnpm prisma db push

# Migration erstellen (Production)
pnpm prisma migrate dev --name <name>

# Prisma Client generieren
pnpm prisma generate

# Prisma Studio öffnen
pnpm prisma studio
```

### Export-Formate

Zusätzlich können Daten als CSV oder JSON exportiert und wieder importiert werden:

- **CSV**: Enthält Name, Gezahlter Betrag, Restbetrag und Status
- **JSON**: Vollständige Datenstruktur inklusive Metadaten (Version, Export-Zeitpunkt)

## 📄 Lizenz

Siehe [LICENSE](LICENSE) Datei für Details.
