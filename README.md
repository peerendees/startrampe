# BERENT Website Template

Starter-Template für neue BERENT-Webseiten (Subdomains, etc.).

## Voraussetzungen

- Node.js (v20+)
- Git

## Neues Projekt starten

### Option A: Von diesem Template

1. Auf GitHub: **Use this template** → neues Repo erstellen
2. Lokal klonen **mit Submodules**:
   ```bash
   git clone --recurse-submodules https://github.com/peerendees/DEIN-REPO-NAME.git
   cd DEIN-REPO-NAME
   ```
3. Dependencies installieren:
   ```bash
   npm install
   ```
4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

### Option B: Submodule nachträglich

Falls du ohne `--recurse-submodules` geklont hast:

```bash
git submodule update --init
```

## Build & Deployment

```bash
npm run build
```

Output liegt in `./public/` – bereit für Vercel, IONOS oder anderes Hosting.

## Cursor Rules

Die BERENT CI-Rules liegen als Submodule in `.cursor/rules/`. Updates:

```bash
git submodule update --remote .cursor/rules
git add .cursor/rules
git commit -m "Rules aktualisiert"
```

## Vercel

1. Repo mit Vercel verbinden
2. Build Command: `npm run build`
3. Output Directory: `public`
4. **Include Git submodules** aktivieren (Vercel Project Settings)
