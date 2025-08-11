
# Social Media Video Prompt Generator - Technische Dokumentation

## 1. App-Zweck und Zielgruppe

### Was macht die App?
Diese Web-Anwendung generiert **kreative Video-Prompts für Social Media** mit Hilfe von Künstlicher Intelligenz (OpenAI GPT-4o). 

**Hauptfunktionen:**
- Auswahl verschiedener Social Media Plattformen (YouTube, TikTok, Instagram, Facebook, LinkedIn)
- Kategorie-basierte Prompt-Generierung (Tutorials, Reviews, Storytelling, etc.)
- Deutsche Spracherkennung für Eingaben
- Automatische Übersetzung ins Englische
- Vollständiger Verlauf aller generierten Prompts
- JSON-Export-Funktion

### Zielgruppe
- Content Creator und Influencer
- Social Media Manager
- Marketing-Teams
- Personen, die kreative Video-Ideen benötigen
- Deutschsprachige Nutzer (primär)

---

## 2. Verwendete Technologien

### Frontend
- **React 18** mit TypeScript
- **Vite** als Build-Tool und Entwicklungsserver
- **shadcn/ui** - Moderne UI-Komponenten (basiert auf Radix UI)
- **Tailwind CSS** für Styling
- **TanStack React Query** für Server-State-Management
- **React Hook Form** mit Zod-Validierung
- **Wouter** für Client-seitiges Routing

### Backend
- **Express.js** mit TypeScript
- **Node.js** Runtime
- **OpenAI API** (GPT-4o Model)
- **Zod** für Request/Response-Validierung

### Datenbank
- **PostgreSQL** (Neon Database - Serverless)
- **Drizzle ORM** für Datenbankoperationen
- **Drizzle Kit** für Schema-Migrationen

### Besondere Features
- **Web Speech API** für deutsche Spracherkennung
- **Dual API Key System** (Fallback-Mechanismus)
- **PIN-geschützter Verlauf** (PIN: 55555)

---

## 3. Projektstruktur

```
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/ui/     # shadcn/ui Komponenten
│   │   ├── pages/            # Hauptseiten
│   │   │   ├── home.tsx      # Prompt-Generator
│   │   │   ├── history.tsx   # Verlaufsseite
│   │   │   └── not-found.tsx # 404-Seite
│   │   ├── hooks/            # Custom React Hooks
│   │   ├── lib/              # Utilities
│   │   ├── App.tsx           # Haupt-App-Komponente
│   │   └── main.tsx          # React Entry Point
│   └── index.html            # HTML Template
├── server/                   # Express Backend
│   ├── services/
│   │   └── openai.ts        # OpenAI Integration
│   ├── db.ts               # Datenbankverbindung
│   ├── routes.ts           # API Endpunkte
│   ├── storage.ts          # Datenbankoperationen
│   ├── index.ts            # Server Entry Point
│   └── vite.ts             # Vite Integration
├── shared/
│   └── schema.ts           # Geteilte TypeScript Types
└── Konfigurationsdateien
```

---

## 4. Funktionen & Logik

### Frontend-Dateien

#### `client/src/pages/home.tsx`
**Haupt-Prompt-Generator-Seite**
- Formularverwaltung mit React Hook Form
- Plattform- und Kategorie-Auswahl
- Spracherkennung für Video-Inhalt-Eingabe
- Ton- und Stil-Optionen (Checkboxes)
- API-Aufrufe zur Prompt-Generierung
- Copy-to-Clipboard-Funktionalität
- Übersetzungs-Feature

#### `client/src/pages/history.tsx`
**Verlaufsseite für gespeicherte Prompts**
- PIN-geschützter Zugang
- Anzeige aller generierten Prompts
- Filter- und Suchfunktionen
- Copy- und Übersetzungs-Features
- Responsive Design

#### `client/src/components/ui/`
**UI-Komponenten-Bibliothek**
- Wiederverwendbare shadcn/ui Komponenten
- Formulare, Buttons, Dialoge, Toasts
- Konsistentes Design-System

### Backend-Dateien

#### `server/routes.ts`
**API-Endpunkte Definition**
- `POST /api/generate-prompts` - Prompt-Generierung
- `POST /api/translate-prompt` - Übersetzungs-Service
- `GET /api/prompts` - Verlauf abrufen
- Request-Validierung mit Zod-Schemas

#### `server/services/openai.ts`
**OpenAI Integration**
- GPT-4o Model für Prompt-Generierung
- Dual API Key System (Primary + Fallback)
- Plattform-spezifische Prompt-Templates
- Übersetzungs-Service (Deutsch → Englisch)
- Strukturierte JSON-Response-Verarbeitung

#### `server/storage.ts`
**Datenbankoperationen**
- CRUD-Operationen für Prompts
- Benutzer-Management (vorbereitet)
- Drizzle ORM Integration

---

## 5. Datenmodell

### Tabelle: `prompts`
```sql
- id: serial (Primary Key)
- userId: integer (nullable, für zukünftige Auth)
- platform: text (youtube, tiktok, instagram, etc.)
- category: text (tutorial, storytelling, etc.)
- customCategory: text (optional, bei "diverses")
- videoContent: text (Nutzer-Eingabe)
- tones: text[] (Array von Tonarten)
- styles: text[] (Array von Stilarten)
- content: text (generierter Prompt)
- generationTime: integer (Zeit in Millisekunden)
- createdAt: timestamp (Erstellungsdatum)
```

### Tabelle: `users` (vorbereitet)
```sql
- id: serial (Primary Key)
- username: text (unique)
- password: text
- createdAt: timestamp
```

---

## 6. Integrationen

### OpenAI API
- **Model**: GPT-4o (neuestes verfügbares Model)
- **Zweck**: Kreative Prompt-Generierung und Übersetzung
- **Features**: 
  - Plattform-spezifische Optimierung
  - Deutsche Prompts mit englischer Übersetzung
  - Strukturierte JSON-Response

### Neon Database
- **Serverless PostgreSQL**
- **Automatische Skalierung**
- **Connection Pooling**

### Web Speech API
- **Deutsche Spracherkennung**
- **Browser-native Integration**
- **Real-time Transkription**

---

## 7. Besonderheiten & Erweiterungsmöglichkeiten

### Aktuelle Besonderheiten
- **Dual API Key System**: Automatischer Fallback bei API-Fehlern
- **PIN-Schutz**: Sicherer Zugang zum Verlauf
- **Responsive Design**: Optimiert für Desktop und Mobile
- **JSON Export**: Strukturierte Datenausgabe
- **Real-time Validierung**: Sofortige Eingabe-Überprüfung

### Geplante Erweiterungen
1. **Benutzer-Authentifizierung**: 
   - Individuelle Nutzerkonten
   - Persönliche Prompt-Sammlungen
   
2. **Analytics & Tracking**:
   - Prompt-Performance-Messung
   - Nutzungsstatistiken
   
3. **Template-System**:
   - Wiederverwendbare Prompt-Vorlagen
   - Community-Templates
   
4. **Export-Funktionen**:
   - PDF-Export
   - CSV-Download
   - API für Dritt-Tools

5. **Multi-Language Support**:
   - Weitere Sprachen
   - Lokalisierung der UI

---

## 8. Lokale Entwicklung & Setup

### Voraussetzungen
```bash
- Node.js 18+
- PostgreSQL Datenbank
- OpenAI API Key
```

### Environment Variables
```env
DATABASE_URL=your_neon_postgresql_url
OPENAI_API_KEY=your_primary_openai_api_key
REPLIT_APP_VPG=your_fallback_openai_api_key
```

### Entwicklung starten
```bash
# Dependencies installieren
npm install

# Datenbank Schema erstellen
npm run db:push

# Entwicklungsserver starten
npm run dev
```

### Verfügbare Scripts
```bash
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build
npm run start    # Produktionsserver
npm run check    # TypeScript Prüfung
npm run db:push  # Datenbank Update
```

### Projektspezifische Befehle
- **Port**: 5000 (Standard für Replit)
- **Hot Reloading**: Automatisch aktiviert
- **TypeScript**: Vollständige Typisierung
- **Linting**: ESLint konfiguriert

---

## 9. Architektur-Übersicht

### Datenfluss
1. **User Input** → React Form (Zod Validation)
2. **API Request** → Express Backend (Request Validation)
3. **OpenAI Service** → GPT-4o Prompt Generation
4. **Database Storage** → PostgreSQL via Drizzle ORM
5. **Response** → Frontend Update mit TanStack Query
6. **UI Update** → shadcn/ui Components

### Sicherheit
- Input-Validierung auf Frontend und Backend
- SQL-Injection-Schutz durch Drizzle ORM
- Rate-Limiting vorbereitet
- Environment Variables für sensitive Daten

---

## 10. Nützliche Tipps für Weiterentwicklung

### Code-Organisation
- **Shared Types**: Nutze `shared/schema.ts` für gemeinsame Typen
- **Component Library**: shadcn/ui für konsistente UI
- **Error Handling**: Strukturierte Fehlerbehandlung implementiert

### Debug-Tipps
- Console-Logs in `server/index.ts` für API-Debugging
- React DevTools für Frontend-Debugging
- Neon Dashboard für Datenbank-Monitoring

### Performance
- TanStack Query für intelligentes Caching
- Lazy Loading vorbereitet
- Optimierte Bundle-Größe durch Vite

---

**Diese App ist ein vollständiges Beispiel für moderne Full-Stack-Entwicklung mit KI-Integration!** 🚀
