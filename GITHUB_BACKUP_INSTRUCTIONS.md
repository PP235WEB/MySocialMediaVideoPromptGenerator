# GitHub Repository Backup - Anleitung

## Problem: Git-Lock auf Replit

Das Git-Repository ist auf Replit gesperrt (`.git/index.lock` Problem). Dies ist eine bekannte Einschränkung der Replit-Plattform.

## Lösung 1: Replit GitHub Integration (Empfohlen)

Nutzen Sie die integrierte Replit-GitHub-Synchronisation:

1. **Über das Replit-Interface**:
   - Öffnen Sie die linke Seitenleiste in Replit
   - Klicken Sie auf das "Version Control" Symbol (Git-Icon)
   - Wählen Sie "Connect to GitHub" 
   - Autorisieren Sie Replit für GitHub-Zugriff

2. **Repository verbinden**:
   - Ihr GitHub-Repository: `https://github.com/AxYx235/SocialPromptMaster.git`
   - In der Git-Seitenleiste: "Connect to existing repo"
   - Repository-URL eingeben: `https://github.com/AxYx235/SocialPromptMaster.git`
   - Auf "Connect" klicken

3. **Erste Synchronisation**:
   - Alle Änderungen werden automatisch erkannt
   - Commit-Message eingeben: "Initial commit: Complete Social Media Video Prompt Generator"
   - Auf "Commit & Push" klicken

## Schnelle Anleitung für Ihr Repository

**Ihr GitHub-Repository**: `https://github.com/AxYx235/SocialPromptMaster.git`

**Sofortige Schritte**:
1. In Replit: Linke Seitenleiste → Git-Symbol anklicken
2. "Connect to GitHub" → Repository-URL eingeben
3. Ersten Commit mit allen Projektdateien durchführen

## Lösung 2: Manuelle Dateierstellung auf GitHub (Fallback)

Da automatische Git-Operationen eingeschränkt sind, folgen Sie dieser Anleitung für die manuelle Sicherung:

### 1. Neues GitHub Repository erstellen

1. Gehen Sie zu https://github.com
2. Klicken Sie auf "New repository"
3. Repository-Name: `social-media-video-prompt-generator`
4. Beschreibung: `Deutsche Social Media Video Prompt Generator Webanwendung mit OpenAI GPT-4o Integration`
5. Wählen Sie "Public" oder "Private"
6. Erstellen Sie das Repository

### 2. Lokales Repository initialisieren

```bash
# Im Projekt-Verzeichnis
git init
git add .
git commit -m "Initial commit: Complete Social Media Video Prompt Generator

Features:
- OpenAI GPT-4o integration for video prompt generation
- German speech-to-text functionality
- PIN-protected history access (PIN: 55555)
- Translation functionality (German to English)
- JSON export capability
- Dual API key fallback system
- PostgreSQL database with Drizzle ORM
- Modern React/TypeScript frontend
- Express.js backend"
```

### 3. Remote Repository verbinden

```bash
git remote add origin https://github.com/DEIN_USERNAME/social-media-video-prompt-generator.git
git branch -M main
git push -u origin main
```

## Aktuelle Features (Stand: 26. Januar 2025)

### Vollständig implementiert:
- ✅ Plattform-spezifische Video-Prompt-Generierung (YouTube, TikTok, Instagram, Facebook, LinkedIn)
- ✅ Deutsche Speech-to-Text Funktionalität mit visuellen Feedback-Animationen
- ✅ PIN-geschützter Verlauf (PIN: 55555)
- ✅ Deutsche zu englische Übersetzung mit separaten Kopieren-Buttons
- ✅ JSON-Format-Export für strukturierte Datenübertragung
- ✅ Fallback-System für OpenAI API-Keys (OPENAI_API_KEY + REPLIT_APP_VPG)
- ✅ PostgreSQL Datenbankintegration mit Neon Database
- ✅ Moderne React/TypeScript Frontend mit shadcn/ui
- ✅ Express.js Backend mit umfassender Fehlerbehandlung

### Technische Spezifikationen:
- **Frontend**: React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Datenbank**: PostgreSQL mit Drizzle ORM
- **AI**: OpenAI GPT-4o für Prompt-Generierung und Übersetzung
- **Deployment**: Replit-optimiert mit automatischem Build

## Repository-Inhalt

```
social-media-video-prompt-generator/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # shadcn/ui Komponenten
│   │   ├── pages/          # home.tsx, history.tsx
│   │   ├── hooks/          # Custom React Hooks
│   │   └── lib/            # Utilities und Query Client
├── server/                 # Express.js Backend
│   ├── services/           # OpenAI Integration
│   ├── db.ts              # Datenbankverbindung
│   ├── routes.ts          # API Endpoints
│   └── storage.ts         # Datenbankoperationen
├── shared/                 # Geteilte TypeScript Typen
│   └── schema.ts          # Zod Schemas und Drizzle Models
├── attached_assets/        # Projekt-Dokumentation
├── README.md              # Vollständige Projektdokumentation
├── replit.md              # Projekt-Architektur und Verlauf
└── package.json           # Dependencies und Scripts
```

## Umgebungsvariablen

Für die Funktionalität werden folgende Environment Variables benötigt:

```env
DATABASE_URL=your_neon_postgresql_url
OPENAI_API_KEY=your_primary_openai_api_key
REPLIT_APP_VPG=your_fallback_openai_api_key
```

## Nächste Schritte nach GitHub-Upload

1. **Repository-Beschreibung aktualisieren**
2. **Topics hinzufügen**: `react`, `typescript`, `openai`, `social-media`, `video-prompts`, `german`
3. **README.md überprüfen** und bei Bedarf anpassen
4. **Lizenz hinzufügen** (empfohlen: MIT License)
5. **Issues/Discussions aktivieren** für Community-Feedback

## Deployment-Bereitschaft

Das Projekt ist vollständig deployment-ready für:
- Replit Deployments (empfohlen)
- Vercel
- Netlify
- Heroku
- Digitale Ocean App Platform

Die Anwendung ist produktionsreif und alle Features wurden erfolgreich getestet.