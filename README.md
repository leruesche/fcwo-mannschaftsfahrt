# FCWO Mannschaftsfahrt

Eine moderne Web-Anwendung zur Verwaltung von Zahlungen und Teilnehmern für Mannschaftsfahrten. Die App ermöglicht es, Spieler hinzuzufügen, deren Zahlungsstatus zu verfolgen und alle Finanzen übersichtlich zu verwalten.

## ✨ Features

- **Zahlungstracking**: Übersichtliche Verwaltung aller Zahlungen pro Spieler
- **Spielerliste**: Hinzufügen, Bearbeiten und Entfernen von Teilnehmern
- **Statusanzeige**: Visuelle Darstellung des Zahlungsstatus (Nicht gezahlt, Teilweise gezahlt, Vollständig gezahlt, Überzahlung)
- **Automatische Berechnungen**: Berechnung von Restbeträgen, Gesamtsummen und offenen Beträgen
- **Persistenz**: Automatische Speicherung im Browser (LocalStorage)
- **Export & Import**: Daten als CSV oder JSON exportieren und importieren
- **Responsive Design**: Moderne, mobile-freundliche Benutzeroberfläche mit Nuxt UI

## 🚀 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) - Vue.js Meta-Framework
- **State Management**: [Pinia](https://pinia.vuejs.org/) - Vue State Management
- **UI Framework**: [Nuxt UI](https://ui.nuxt.com/) - Vue Component Library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- **Icons**: [Iconify](https://iconify.design/) mit Lucide Icons
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typisierte JavaScript Superset
- **Linting**: [ESLint](https://eslint.org/) mit [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## 📦 Installation

### Voraussetzungen

**Lokale Entwicklung:**

- Node.js (Version 18 oder höher)
- pnpm (Version 10.28.1 oder höher)

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
```

**Docker Setup:**

```bash
# Repository klonen
git clone <repository-url>
cd fcwo-mannschaftsfahrt

# Keine manuelle Installation nötig - Docker übernimmt alles
```

## 🛠️ Entwicklung

### Scripts

- `pnpm dev` - Startet den Development Server (standardmäßig auf http://localhost:3000)
- `pnpm build` - Baut die Anwendung für Production
- `pnpm preview` - Vorschau der Production Build
- `pnpm lint` - Führt ESLint aus
- `pnpm lint:fix` - Führt ESLint aus und behebt automatisch Fehler
- `pnpm typecheck` - Führt TypeScript Type Checking aus
- `pnpm postinstall` - Führt `nuxt prepare` nach Installation aus

### Development Server starten

**Lokale Entwicklung:**

```bash
pnpm dev
```

**Docker Development (empfohlen):**

```bash
# Development Container starten
docker-compose up fcwo-mannschaftsfahrt-dev

# Im Hintergrund starten
docker-compose up -d fcwo-mannschaftsfahrt-dev

# Logs anzeigen
docker-compose logs -f fcwo-mannschaftsfahrt-dev
```

Die Anwendung ist dann unter `http://localhost:3000` erreichbar.

### Docker Development Features

- **Hot-Reload**: Änderungen am Code werden automatisch übernommen
- **Isolierte Umgebung**: Keine lokale Node.js Installation nötig
- **Konsistente Umgebung**: Gleiche Bedingungen wie im Production-Build

## 🐳 Docker Deployment

### Production Build

```bash
# Production Image bauen
docker-compose build fcwo-mannschaftsfahrt

# Production Container starten
docker-compose up -d fcwo-mannschaftsfahrt

# Status prüfen
docker-compose ps

# Logs anzeigen
docker-compose logs -f fcwo-mannschaftsfahrt

# Container stoppen
docker-compose down
```

### Docker Services

Die `docker-compose.yml` enthält zwei Services:

- **`fcwo-mannschaftsfahrt`**: Production-Service mit optimiertem Build
- **`fcwo-mannschaftsfahrt-dev`**: Development-Service mit Hot-Reload

Beide Services nutzen das Netzwerk `fcwo-network`, wodurch später einfach eine Datenbank hinzugefügt werden kann.

### Port-Konfiguration

Standardmäßig läuft die App auf Port `3000`. Um einen anderen Port zu verwenden, passe die Port-Mapping in der `docker-compose.yml` an:

```yaml
ports:
  - '8080:3000' # Externer Port:Interner Port
```

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
├── public/                        # Statische Assets
├── Dockerfile                     # Multi-stage Docker Build
├── docker-compose.yml             # Docker Compose Konfiguration
├── .dockerignore                  # Docker Build Excludes
├── nuxt.config.ts                 # Nuxt Konfiguration
├── tsconfig.json                  # TypeScript Konfiguration
└── package.json
```

## 📋 Dependencies

### Production Dependencies

- `nuxt` (^4.2.2) - Nuxt Framework
- `@nuxt/ui` (^4.4.0) - Nuxt UI Komponenten
- `@nuxtjs/tailwindcss` (6.14.0) - Tailwind CSS Integration für Nuxt
- `tailwindcss` (^4.1.18) - Tailwind CSS Framework
- `@pinia/nuxt` (^0.11.3) - Pinia Integration für Nuxt
- `pinia` (^3.0.4) - Vue State Management
- `@iconify-json/lucide` (^1.2.86) - Lucide Icons für Iconify
- `@iconify-json/simple-icons` (^1.2.67) - Simple Icons für Iconify

### Development Dependencies

- `typescript` (^5.9.3) - TypeScript Support
- `vue-tsc` (^3.2.2) - Vue TypeScript Compiler
- `eslint` (^9.39.2) - ESLint Linter
- `@nuxt/eslint` (^1.12.1) - Nuxt ESLint Integration
- `@antfu/eslint-config` (^7.2.0) - ESLint Konfiguration von Anthony Fu
- `eslint-plugin-format` (^1.3.1) - ESLint Format Plugin

## ⚙️ Konfiguration

### ESLint

Konfiguriert mit `@antfu/eslint-config`, aktiviert Formatters und Vue Support.

### TypeScript

Konfiguriert mit Nuxt TypeScript References für optimale Type-Safety.

### Package Manager

Verwendet `pnpm@10.28.1` als Package Manager.

### Docker

Die Anwendung ist vollständig containerisiert mit:

- **Multi-stage Dockerfile**: Optimiert für minimale Image-Größe
- **Docker Compose**: Separate Services für Development und Production
- **Healthchecks**: Automatische Überwachung des Production-Services

## 💾 Datenverwaltung

Die Anwendung speichert alle Daten automatisch im Browser-LocalStorage. Zusätzlich können Daten als CSV oder JSON exportiert und wieder importiert werden.

### Export-Formate

- **CSV**: Enthält Name, Gezahlter Betrag, Restbetrag und Status
- **JSON**: Vollständige Datenstruktur inklusive Metadaten (Version, Export-Zeitpunkt)

## 📄 Lizenz

Siehe [LICENSE](LICENSE) Datei für Details.
