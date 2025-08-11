# Social Media Video Prompt Generator

> **Deutsche KI-basierte Webanwendung zur Generierung von kreativen Video-Prompts für Social Media Plattformen**

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)

## 📋 Übersicht

Eine vollständige Full-Stack-Webanwendung, die speziell für die deutsche Content-Creation-Community entwickelt wurde. Die Anwendung nutzt OpenAI's GPT-4o Modell zur automatischen Generierung von drei kreativen Video-Prompts basierend auf Plattform-Auswahl, Kategorien, Inhalten und Stil-Präferenzen.

### 🎯 Hauptfunktionen

- **🤖 KI-Powered Prompt Generation**: OpenAI GPT-4o Integration für hochwertige Video-Ideen
- **📱 Multi-Platform Support**: YouTube, TikTok, Instagram, Facebook, LinkedIn
- **🎙️ Speech-to-Text**: Deutsche Spracherkennung für Video-Inhalt-Eingabe
- **🌍 Übersetzungsservice**: Automatische Deutsch-Englisch Übersetzung
- **📊 JSON Export**: Strukturierte Datenausgabe für weitere Verarbeitung
- **🔐 PIN-Sicherheit**: Geschützter Zugang zum Verlauf (PIN: 55555)
- **📚 Vollständiger Verlauf**: Speicherung und Verwaltung aller generierten Prompts
- **🔄 Fallback-System**: Redundante API-Key-Verwaltung für maximale Verfügbarkeit

## 🏗️ Technische Architektur

### Frontend
- **Framework**: React 18 mit TypeScript
- **Build Tool**: Vite für schnelle Entwicklung und optimierte Builds
- **UI Framework**: shadcn/ui auf Radix UI Basis
- **Styling**: Tailwind CSS mit modernem Design-System
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form mit Zod Validation
- **Routing**: Wouter für leichtgewichtige Client-Navigation

### Backend
- **Framework**: Express.js mit TypeScript
- **Runtime**: Node.js mit ES-Modulen
- **API Design**: RESTful mit zentralisierter Route-Registrierung
- **Validation**: Zod-basierte Request/Response-Validierung
- **Error Handling**: Strukturierte Fehlerbehandlung

### Database & Storage
- **Database**: PostgreSQL mit Drizzle ORM
- **Provider**: Neon Database (Serverless PostgreSQL)
- **Migration**: Drizzle Kit für Schema-Management
- **Storage**: DatabaseStorage-Klasse mit vollständigen CRUD-Operationen

### KI & Services
- **Primary AI Model**: OpenAI GPT-4o
- **Fallback System**: Dual API-Key Management
- **Translation Service**: GPT-4o basierte Deutsch-Englisch Übersetzung
- **Speech Recognition**: Web Speech API für deutsche Spracherkennung

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ 
- PostgreSQL Datenbank
- OpenAI API Key

### 1. Repository klonen
```bash
git clone https://github.com/AxYx235/social-video-prompt-ai.git
cd social-video-prompt-ai
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren
```bash
# .env Datei erstellen
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_primary_openai_api_key
REPLIT_APP_VPG=your_fallback_openai_api_key  # Optional für Fallback
```

### 4. Datenbank Setup
```bash
npm run db:push
```

### 5. Anwendung starten
```bash
# Entwicklung
npm run dev

# Produktion
npm run build
npm start
```

Die Anwendung läuft unter `http://localhost:5000`

## 📚 API Dokumentation

### POST /api/generate-prompts
Generiert 3 kreative Video-Prompts basierend auf den Eingabeparametern.

**Request Body:**
```typescript
{
  platform: "youtube" | "tiktok" | "instagram" | "facebook" | "linkedin";
  category: string;
  customCategory?: string; // Erforderlich wenn category = "diverses"
  videoContent: string; // 1-1000 Zeichen
  tones: string[]; // Optional: ["motivierend", "informativ", ...]
  styles: string[]; // Optional: ["dokumentarisch", "cinematisch", ...]
}
```

**Response:**
```typescript
{
  success: boolean;
  prompts: Array<{
    id: number;
    content: string;
    category: string;
  }>;
  generationTime: number; // Sekunden
}
```

### POST /api/translate-prompt
Übersetzt deutschen Prompt-Text ins Englische.

**Request Body:**
```typescript
{
  content: string; // Oder "text"
}
```

**Response:**
```typescript
{
  success: boolean;
  translation: string;
}
```

### GET /api/prompts
Ruft gespeicherte Prompts aus der Datenbank ab.

**Query Parameters:**
- `limit`: Anzahl der Prompts (Standard: 20)

**Response:**
```typescript
{
  success: boolean;
  prompts: Array<{
    id: number;
    content: string;
    platform: string;
    category: string;
    customCategory?: string;
    videoContent: string;
    tones: string[];
    styles: string[];
    generationTime: number;
    createdAt: string;
  }>;
}
```

## 🎨 Platform-Kategorien

### YouTube
- tutorials, vlogs, reviews, gaming, comedy, musik, dokus, howtos, unboxings, storytelling, diverses

### TikTok  
- trends, challenges, dance, memes, hacks, skits, reactions, edits, pov, storytime, diverses

### Instagram
- reels, fashion, food, travel, aesthetics, lifestyle, quotes, stories, diy, fitness, diverses

### Facebook
- community, news, events, memes, groups, reactions, diverses

### LinkedIn
- leadership, networking, insights, careers, skills, trends, events, success, culture, learning, diverses

## 🎭 Stil & Tonarten

### Tonarten
motivierend, informativ, unterhaltsam, seriös, emotional, provokativ, persönlich, dramatisch, inspirativ, vertrauensvoll

### Stilrichtungen
dokumentarisch, cinematisch, minimalistisch, dynamisch, illustrativ, authentisch, ästhetisch, humorvoll, storytelling

## 🔧 Entwicklung

### Projekt-Struktur
```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # shadcn/ui Komponenten
│   │   ├── pages/          # React Seiten (Home, History)
│   │   ├── lib/            # Utilities & Konfiguration
│   │   └── hooks/          # Custom React Hooks
├── server/                 # Express Backend
│   ├── services/           # OpenAI Service
│   ├── db.ts              # Datenbankverbindung
│   ├── routes.ts          # API Routen
│   └── storage.ts         # Datenbank-Operationen
├── shared/                 # Geteilte TypeScript Types
│   └── schema.ts          # Zod Schemas & Drizzle Models
└── dist/                  # Build Output
```

### Scripts
```bash
npm run dev      # Entwicklungsserver starten
npm run build    # Produktions-Build erstellen
npm run start    # Produktionsserver starten  
npm run check    # TypeScript Typ-Prüfung
npm run db:push  # Datenbank-Schema aktualisieren
```

### Code Quality
- **TypeScript**: Vollständige Typisierung für Frontend und Backend
- **Zod Validation**: Laufzeit-Validierung für alle API-Endpunkte
- **Error Handling**: Strukturierte Fehlerbehandlung mit benutzerfreundlichen Nachrichten
- **Hot Reloading**: Vite Dev Server für schnelle Entwicklung

## 🚀 Deployment

### Build Process
1. **Frontend**: Vite erstellt optimierte Assets in `dist/public`
2. **Backend**: esbuild bündelt Server-Code zu `dist/index.js`
3. **Type Checking**: TypeScript Validierung

### Umgebungskonfiguration
- **Development**: tsx für TypeScript Hot-Reloading
- **Production**: Node.js Ausführung des gebündelten Codes
- **Required Env Vars**: DATABASE_URL, OPENAI_API_KEY

### Static Assets
- **Development**: Vite Dev Server mit Middleware
- **Production**: Express Static File Serving

## 🔐 Sicherheit

- **PIN-Schutz**: Verlauf-Zugang über PIN 55555
- **API Key Management**: Sichere Umgebungsvariablen-Speicherung
- **Fallback System**: Redundante API-Schlüssel für Ausfallsicherheit
- **Input Validation**: Zod-basierte Server-seitige Validierung
- **SQL Injection Prevention**: Drizzle ORM Query Builder

## 📊 Performance

- **Response Zeit**: < 2 Sekunden für Prompt-Generierung
- **Caching**: TanStack React Query für optimierte API-Calls
- **Bundle Size**: Optimierte Vite-Builds mit Code-Splitting
- **Database**: Indexierte PostgreSQL-Abfragen über Drizzle

## 🌟 Features im Detail

### Speech-to-Text Integration
- Deutsche Spracherkennung über Web Speech API
- Visuelles Feedback während Aufnahme (rote Pulsation)
- Fehlerbehandlung für nicht-unterstützte Browser
- Tooltip-Anweisungen für Nutzerführung

### Übersetzungsfunktion
- Automatische Deutsch-Englisch Übersetzung
- Separate Kopieren-Buttons für Original und Übersetzung
- Fehlerbehandlung mit Fallback-API-System
- Konsistente UI-Patterns auf allen Seiten

### JSON Export
- Strukturierte Datenausgabe für Prompts
- Kopierbar für externe Weiterverarbeitung
- Vollständige Metadaten (Platform, Kategorie, Timing)

## 🤝 Contributing

Dieses Projekt wurde als MVP entwickelt und ist bereit für Erweiterungen:

1. **Authentication System**: User-basierte Prompt-Verwaltung
2. **Advanced Analytics**: Prompt-Performance-Tracking  
3. **Template System**: Wiederverwendbare Prompt-Vorlagen
4. **Export Features**: PDF/CSV-Export-Funktionen
5. **Multi-Language**: Weitere Sprachen-Unterstützung

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

## 🙏 Acknowledgments

- **OpenAI**: GPT-4o API für KI-Prompt-Generierung
- **Replit**: Entwicklungsumgebung und Hosting-Platform
- **shadcn/ui**: Moderne UI-Komponenten-Bibliothek
- **Neon Database**: Serverless PostgreSQL-Hosting

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues für Bug-Reports
- Replit Community für Entwicklungsunterstützung
- OpenAI Documentation für API-bezogene Fragen

---

**Version**: 1.0.0  
**Letzte Aktualisierung**: Januar 2025  
**Status**: Produktionsbereit (MVP)