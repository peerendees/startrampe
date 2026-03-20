# STARTRAMPE

## Projektübersicht

Die Startrampe ist ein interaktives Single-Page-Werkzeug, das Benutzer Schritt für Schritt durch das Deployment eines neuen Webprojekts führt – von der lokalen Entwicklung über GitHub und Vercel bis zur fertigen Subdomain auf Cloudflare. Die App generiert personalisierte Anleitungen basierend auf den Eingaben des Benutzers.

**Subdomain:** `startrampe.berent.ai`
**Repository:** `peerendees/startrampe`
**Typ:** Öffentliches Self-Service-Tool (auch für Workshop-Teilnehmer und Kunden)

## Architektur

- **Single-File Frontend:** `index.html` — gesamte App (HTML, CSS, JS) in einer Datei
- **Kein Backend in Stufe 1:** Rein clientseitige Template-Generierung
- **Stufe 2 (spätere Erweiterung):** `api/troubleshoot.js` — Vercel Serverless Function für KI-gestützten Troubleshooting-Dialog
- **Kein Build-Prozess:** Keine npm-Dependencies in Stufe 1

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | Vanilla HTML/CSS/JS (kein Framework) |
| Fonts | Lokal gehostet: Bebas Neue, Lora, JetBrains Mono |
| Template-Engine | Vanilla JS (String-Replacement in vordefinierten Textblöcken) |
| Deployment | Vercel (statisch in Stufe 1) |

## Ausbaustufen

### Stufe 1 (Initial-Release)
- Formular mit Benutzereingaben
- Clientseitige Template-Generierung (JS ersetzt Platzhalter in Anleitungstexten)
- Personalisierte Schritt-für-Schritt-Anleitung wird im Browser gerendert
- Copy-Buttons für Terminal-Befehle
- Kein API-Key erforderlich, kein Backend
- Kein Datenschutz-Problem, weil nichts den Browser verlässt

### Stufe 2 (spätere Erweiterung)
- KI-gestützter Troubleshooting-Dialog pro Schritt
- Benutzer bringt eigenen API-Key mit (Anthropic oder Google Gemini als kostenlose Alternative)
- Serverless API Proxy unter `api/troubleshoot.js`
- Transparenz-Block auf der Seite ("Dein API-Key verlässt deinen Browser nicht")
- Multi-Provider-Support: Dropdown zur Auswahl des KI-Anbieters

## Corporate Identity — BERENT.AI

Die App folgt der BERENT.AI CI (Skill `berent-ci`). Dieses CI gilt NUR für das Erscheinungsbild der Startrampe selbst – NICHT für die Beispiel-Dateien in der Anleitung (z.B. die Beispiel-`index.html`, die der Benutzer erstellt).

- **Farben:** Warmes Dunkel (#090806 Hintergrund, #110e0a Cards) + Kupfer-Akzent (#B5742A) + Gold nur für Plus-Symbol (#E8C98A)
- **Typografie:** Bebas Neue (Headlines, uppercase), Lora (Fließtext, font-weight 300), JetBrains Mono (Code, Labels, Befehle)
- **Fonts DSGVO-konform lokal hosten** – kein Google Fonts CDN
- **Plus-Symbol:** Obligatorisches BERENT.AI-Markenelement im Header, bei Sektions-Headern und als Bullet-Ersatz
- **CSS-Variablen:** `--bg: #090806`, `--card: #110e0a`, `--border: #2a2118`, `--copper: #B5742A`, `--gold: #E8C98A`, `--text: #C4BCB1`, `--muted: #7A6A58`
- **Kein Ampersand:** In UI-Texten immer „und" statt „&"
- **Footer-Pflichtlinks:** Impressum (`https://berent.ai/impressum.html`) + Zurück zur Hauptseite (`https://berent.ai`)
- **Logo:** `logo_farbe_v3.webp` (Nav 32px, Footer 24px), `BE_Farbe_V3.png` (Favicon)

## Vorbilder

| Aspekt | Vorbild | Was übernehmen |
|--------|---------|----------------|
| App-Struktur und UI | Textschmiede (`textschmiede-5tc.berent.ai`) | Step-Progress-Bar, Card-basiertes Layout, Single-File-Architektur, Dark Mode als Standard |
| Thema und Design | Relaunch Guide (`relaunch-guide.berent.ai`) | Guide-Charakter, Anleitungston, Informationsarchitektur |

## App-Ablauf

### Eingabe (Schritt 1)
Der Benutzer füllt ein Formular aus. Einige Felder werden automatisch abgeleitet:

**Pflichtfelder:**
- Projektbeschreibung (Freitext, 1–2 Sätze, z.B. "Ein Kalorien-Rechner für meine Ernährungsberatung")
- GitHub-Benutzername
- Betriebssystem (macOS / Windows / Linux)
- Entwicklungsumgebung (Cursor / Claude Code / VS Code / Terminal)

**Abgeleitete Felder (editierbar):**
- Projektname / Repo-Name (aus Beschreibung abgeleitet: Kebab-Case, Sonderzeichen entfernt)
- Subdomain (aus Projektname abgeleitet)
- Hauptdomain (vorbelegt: `berent.ai`, überschreibbar für eigene Domains)

**Optional:**
- Erfahrungslevel (Einsteiger / Fortgeschritten) – steuert Detailgrad der Anleitung

### Anleitung (Schritte 2–6)
Personalisierte Schritt-für-Schritt-Anleitung mit eingesetzten Variablen. Jeder Schritt enthält:
- Erklärungstext (angepasst an Erfahrungslevel)
- Konkrete Terminal-Befehle mit Copy-Button
- Hinweise und Warnungen wo nötig
- Visuellen Fortschrittsindikator (Step-Progress-Bar)

Die Schritte sind im Detail im `BRIEFING.md` beschrieben.

### Ergebnis
Am Ende sieht der Benutzer eine Zusammenfassung:
- Repository-URL
- Vercel-Projekt-URL
- Live-URL der Subdomain
- Checkliste der erledigten Schritte

## Wichtige Mechanismen

### Template-Generierung
- Anleitungstexte liegen als JS-Template-Strings mit Platzhaltern vor (z.B. `${repoName}`, `${subdomain}`)
- Bei Klick auf "Anleitung generieren" werden alle Platzhalter durch Benutzereingaben ersetzt
- Das Ergebnis wird als formatiertes HTML in den Anleitungsbereich gerendert
- Keine externen API-Calls in Stufe 1

### Namensableitung
- Aus "Kalorien-Rechner für Ernährungsberatung" wird: `kalorien-rechner` (Repo), `kalorien-rechner` (Subdomain)
- Logik: Lowercase → Umlaute ersetzen (ä→ae, ö→oe, ü→ue, ß→ss) → Sonderzeichen entfernen → Leerzeichen zu Bindestrichen → max. 30 Zeichen → Trailing-Bindestriche entfernen
- Benutzer kann abgeleitete Werte jederzeit überschreiben

### Copy-Buttons
- Jeder Terminal-Befehl hat einen "Kopieren"-Button
- Visuelles Feedback: Button zeigt kurz "Kopiert!" (Kupfer-Highlight)
- `navigator.clipboard.writeText()` mit Fallback

### Step-Progress-Bar
- 6 Schritte: Eingabe → Projekt → Git/GitHub → Vercel → Cloudflare → Live
- Visuell wie bei der Textschmiede (Buttons, aber nicht klickbar, rein informativer Status)
- Aktueller Schritt kupferfarben hervorgehoben

### Responsive Design
- Desktop (>1024px): Volles Layout, max-width 960px
- Tablet (≤1024px): Kompaktere Abstände
- Smartphone (≤640px): Einspaltig, Step-Labels ausgeblendet

## Konventionen

- **Sprache der UI:** Deutsch
- **Sprache der Terminal-Befehle:** Englisch (git, npm, etc.)
- **Commit-Sprache:** Englisch
- **CSS:** Custom Properties in `:root`, keine Preprocessoren
- **JS:** Vanilla JS, keine Module, globale Funktionen
- **Naming:** camelCase (JS), kebab-case (CSS)
- **Kein Ampersand:** `&` niemals als Konjunktion in UI-Texten
- **Fonts:** DSGVO-konform lokal gehostet (kein Google Fonts CDN)
- **Alle Änderungen** betreffen primär `index.html`

## Projektstart: Template-Repo als Basis

Dieses Projekt basiert auf dem `peerendees/berent-website-template`. Das Template
enthält bereits die komplette BERENT-CI-Grundstruktur:
- Fonts (lokal gehostet, DSGVO-konform)
- Logo-Dateien
- CSS-Setup mit allen CI-Variablen
- Header mit Plus-Symbol und Branding
- Footer mit Pflichtlinks
- Responsive Grundgerüst
- `.cursor`-Submodul mit CI-Rules (`peerendees/berent-website-rules`)

**Vorgehen:**
1. Template-Repo auf GitHub als Vorlage nutzen ("Use this template" → neues Repo `startrampe` erstellen)
2. Lokal klonen
3. `CLAUDE.md`, `BRIEFING.md`, `references/` und `vercel.json` ins Repo-Root legen
4. Die vorhandene `index.html` aus dem Template wird durch die Startrampe-App ersetzt
5. Alles, was das Template mitbringt (Fonts, Logos, CSS-Grundgerüst), wird beibehalten und erweitert

## Dateien

```
index.html              # Komplette Frontend-App (ersetzt die Template-index.html)
vercel.json             # Vercel-Konfiguration
CLAUDE.md               # Diese Datei — Projektdokumentation
BRIEFING.md             # Inhaltliches Briefing (Eingabefelder, Schritte, Templates)
references/
  deploy-steps.md       # Befehlsvorlagen pro Schritt mit Platzhaltern
assets/                 # Aus dem Template-Repo übernommen
  fonts/                # Lokal gehostete Fonts (Bebas Neue, Lora, JetBrains Mono)
  images/
    logo_farbe_v3.webp  # BERENT Wortschriftzug
    BE_Farbe_V3.png     # BERENT Signet (Favicon)
.cursor/                # Submodul: berent-website-rules (CI-Rules für Cursor)
```

## Hinweise für Entwicklung

- Das Template-Repo liefert die CI-Grundstruktur — nicht von Grund auf neu bauen
- `index.html` wird komplett neu geschrieben, nutzt aber die vorhandenen Fonts und Assets
- In Stufe 1 gibt es kein Backend — alles läuft im Browser
- Die Beispiel-Dateien in der Anleitung (z.B. die `index.html`, die der Benutzer erstellt) haben KEIN BERENT CI — sie sind neutral und generisch
- Das BERENT CI gilt nur für die Startrampe-App selbst (Farben, Fonts, Layout, Plus-Symbol, Footer)
- Template-Texte für die Anleitungsschritte stehen in `BRIEFING.md` und `references/deploy-steps.md`
