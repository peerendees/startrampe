# BRIEFING – Startrampe

Dieses Dokument beschreibt die inhaltliche Struktur der Startrampe-App.
Es ist die Hauptreferenz für den Aufbau der `index.html`.

---

## Seitentitel und Branding

- **App-Name:** Startrampe
- **Tagline:** "Dein Projekt. Von lokal bis live."
- **Subdomain:** `startrampe.berent.ai`
- **Kontext:** Teil des BERENT.AI Ökosystems, unter "Guides" eingeordnet

---

## Seitenstruktur

Die App besteht aus drei Hauptbereichen, die nacheinander sichtbar werden:

### Bereich 1: Eingabe
Formular mit Benutzerdaten. Sichtbar beim Laden der Seite.

### Bereich 2: Anleitung
Personalisierte Schritt-für-Schritt-Anleitung. Erscheint nach Klick auf "Starten".

### Bereich 3: Zusammenfassung
Ergebnis-Übersicht mit Links und Checkliste. Erscheint am Ende der Anleitung.

---

## Bereich 1: Eingabeformular

### Pflichtfelder

**Projektbeschreibung** (Textarea)
- Label: "Beschreib dein Projekt in 1–2 Sätzen"
- Placeholder: "z.B. Ein Kalorien-Rechner für meine Ernährungsberatungspraxis"
- Zweck: Daraus werden Projektname, Repo-Name und Subdomain abgeleitet
- Validierung: Mindestens 10 Zeichen

**GitHub-Benutzername** (Text-Input)
- Label: "Dein GitHub-Benutzername"
- Placeholder: "z.B. maxmustermann"
- Validierung: Nur alphanumerisch und Bindestriche, kein Leerzeichen

**Betriebssystem** (Select)
- Optionen: macOS / Windows / Linux
- Beeinflusst: Terminal-Bezeichnung, Pfadtrenner, Installationshinweise

**Entwicklungsumgebung** (Select)
- Optionen: Claude Code / Cursor / VS Code / Terminal (nur Editor)
- Beeinflusst: Projektstart-Anleitung, Öffnungsbefehle

### Abgeleitete Felder (automatisch befüllt, editierbar)

**Projektname** (Text-Input)
- Automatisch abgeleitet aus Projektbeschreibung
- Ableitungslogik:
  1. Ersten 3–4 sinntragende Wörter extrahieren
  2. Lowercase
  3. Umlaute: ä→ae, ö→oe, ü→ue, ß→ss
  4. Sonderzeichen entfernen (nur a-z, 0-9, Bindestriche)
  5. Leerzeichen → Bindestriche
  6. Max. 30 Zeichen, Trailing-Bindestriche entfernen
- Benutzer kann jederzeit manuell überschreiben
- Wird verwendet als: Repo-Name, Vercel-Projektname, lokaler Ordnername

**Subdomain** (Text-Input)
- Initial identisch mit Projektname
- Benutzer kann abweichend wählen
- Vorschau daneben: `[subdomain].berent.ai`

**Hauptdomain** (Text-Input)
- Vorbelegt: `berent.ai`
- Überschreibbar für Benutzer mit eigener Domain
- Hinweistext: "Wenn du keine eigene Domain hast, nutze berent.ai als Subdomain."

### Optionales Feld

**Erfahrungslevel** (Toggle oder Select)
- Optionen: Einsteiger / Fortgeschritten
- Default: Einsteiger
- Einsteiger: Mehr Erklärtext, Hinweise, Warnungen, Screenshots-Empfehlungen
- Fortgeschritten: Kompakte Befehle, weniger Prosa

### Button

**"Startrampe zünden"** (primärer Kupfer-Button)
- Validiert alle Pflichtfelder
- Generiert die personalisierte Anleitung
- Scrollt sanft zum Anleitungsbereich
- Step-Progress-Bar springt auf Schritt 2

---

## Bereich 2: Anleitungsschritte

Jeder Schritt wird als Card dargestellt (wie bei der Textschmiede).
Jede Card enthält:
- Schrittnummer und Titel (Bebas Neue, Kupfer)
- Erklärungstext (Lora, angepasst an Erfahrungslevel)
- Terminal-Befehle in Code-Blöcken (JetBrains Mono) mit Copy-Button
- Hinweis-Boxen wo nötig (kupferfarbener linker Rand)
- Warnungen wo nötig (dunkelroter linker Rand)

Die konkreten Befehlsvorlagen stehen in `references/deploy-steps.md`.

### Schritt 1: Lokales Projekt aufsetzen

**Titel:** "Projekt lokal anlegen"

**Inhalt (variiert nach IDE und OS):**

Für Claude Code:
```
mkdir ${projektName}
cd ${projektName}
claude
```
Dann in Claude Code: "Erstelle eine einfache index.html mit einer Überschrift '${projektBeschreibung}'"

Für Cursor:
- Cursor öffnen → "Open Folder" → Neuen Ordner `${projektName}` erstellen
- In Cursor: Neue Datei `index.html`
- Grundgerüst einfügen (generisches HTML5-Template)

Für VS Code:
```
mkdir ${projektName}
cd ${projektName}
code .
```
Neue Datei `index.html`, Grundgerüst einfügen.

Für Terminal:
```
mkdir ${projektName}
cd ${projektName}
touch index.html
```
Grundgerüst mit `cat > index.html << 'EOF'` einfügen.

**Generische Beispiel-index.html** (KEIN BERENT CI!):
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projektName}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>${projektName}</h1>
  <p>Willkommen! Diese Seite wird bald unter <strong>${subdomain}.${domain}</strong> erreichbar sein.</p>
</body>
</html>
```

**Hinweis-Box (Einsteiger):**
"Dieser HTML-Code ist nur ein Startpunkt. Du kannst das Design und den Inhalt jederzeit ändern — die Startrampe kümmert sich nur um das Deployment."

### Schritt 2: Git initialisieren und nach GitHub pushen

**Titel:** "Projekt in GitHub sichern"

**Inhalt:**

```
cd ${pfad}/${projektName}
git init
git add .
git commit -m "Initial commit"
```

Dann auf GitHub:
1. Öffne https://github.com/new
2. Repository-Name: `${projektName}`
3. Sichtbarkeit: Public (oder Private)
4. KEIN README, KEIN .gitignore, KEINE Lizenz (Repo muss leer bleiben)
5. "Create repository" klicken

Zurück im Terminal:
```
git remote add origin https://github.com/${githubUser}/${projektName}.git
git branch -M main
git push -u origin main
```

**Hinweis-Box (Einsteiger):**
"Falls du noch nie mit Git gearbeitet hast: Git ist ein Versionskontrollsystem. Es merkt sich jeden Stand deines Projekts. GitHub ist die Online-Plattform, auf der dein Code gespeichert wird — und von dort holt Vercel ihn sich automatisch."

**Warnung:**
"Erstelle das GitHub-Repository OHNE README und OHNE .gitignore. Wenn GitHub automatisch Dateien anlegt, kollidiert das mit deinem lokalen Projekt."

**OS-spezifisch:**
- macOS/Linux: Pfad mit `/` (z.B. `~/Projekte/${projektName}`)
- Windows: Pfad mit `\` (z.B. `C:\Users\[Name]\Projekte\${projektName}`), PowerShell-Befehle

### Schritt 3: Vercel-Projekt verbinden

**Titel:** "Projekt auf Vercel deployen"

**Inhalt:**

1. Öffne https://vercel.com/new
2. Klicke "Import Git Repository"
3. Wähle `${githubUser}/${projektName}`
4. Framework Preset: "Other" (da kein Framework)
5. Klicke "Deploy"
6. Warte bis der Build erfolgreich durchläuft (grünes Häkchen)

**Ergebnis:**
Dein Projekt ist jetzt unter `${projektName}.vercel.app` erreichbar.

**Hinweis-Box (Einsteiger):**
"Vercel ist ein Hosting-Dienst, der dein Projekt automatisch aus GitHub holt und ins Internet stellt. Jedes Mal, wenn du neuen Code nach GitHub pushst, aktualisiert Vercel automatisch deine Seite."

### Schritt 4: Subdomain in Vercel hinzufügen

**Titel:** "Custom Domain einrichten (Vercel)"

**Inhalt:**

1. Öffne dein Vercel-Projekt → Settings → Domains
2. Trage ein: `${subdomain}.${domain}`
3. Klicke "Add"
4. Vercel zeigt "Invalid Configuration" — das ist korrekt, der DNS-Eintrag fehlt noch

**Hinweis:**
Vercel zeigt als CNAME-Ziel `cname.vercel-dns.com` an. Diesen Wert brauchen wir im nächsten Schritt.

### Schritt 5: DNS in Cloudflare konfigurieren

**Titel:** "DNS-Eintrag in Cloudflare setzen"

**Inhalt:**

1. Öffne das Cloudflare-Dashboard für deine Domain `${domain}`
2. Gehe zu DNS → Records → Add Record
3. Trage ein:

| Feld | Wert |
|------|------|
| Type | `CNAME` |
| Name | `${subdomain}` |
| Target | `cname.vercel-dns.com` |
| Proxy status | **DNS only** (graue Wolke!) |
| TTL | Auto |

4. Klicke "Save"

**Warnung:**
"Setze den Proxy-Status auf 'DNS only' (graue Wolke). Wenn die orangene Wolke aktiv ist, entsteht ein SSL-Konflikt mit Vercel. Vercel stellt eigene SSL-Zertifikate aus und braucht direkten Zugriff."

**Hinweis-Box (Einsteiger):**
"Cloudflare ist ein DNS-Dienst. DNS ist wie ein Telefonbuch für das Internet — es sagt dem Browser, wo deine Seite liegt. Der CNAME-Eintrag sagt: 'Wenn jemand ${subdomain}.${domain} aufruft, leite ihn zu Vercel weiter.'"

### Schritt 6: Verifizieren und live gehen

**Titel:** "Deine Seite ist live!"

**Inhalt:**

1. Warte 1–5 Minuten (SSL-Zertifikat wird erstellt)
2. Prüfe im Vercel-Dashboard (Settings → Domains): Grünes Häkchen neben `${subdomain}.${domain}`?
3. Öffne im Browser: `https://${subdomain}.${domain}`

**Ergebnis-Card:**
- Live-URL: `https://${subdomain}.${domain}`
- Repository: `https://github.com/${githubUser}/${projektName}`
- Vercel-Dashboard: `https://vercel.com/${githubUser}/${projektName}`

**Troubleshooting** (als ausklappbarer Bereich):

| Problem | Ursache | Lösung |
|---------|---------|--------|
| "Invalid Configuration" in Vercel | CNAME noch nicht propagiert | 5 Minuten warten |
| ERR_TOO_MANY_REDIRECTS | Cloudflare Proxy aktiv | Proxy auf "DNS only" (graue Wolke) stellen |
| 404 Not Found von Vercel | Kein Production-Deployment | `git push` auf main-Branch oder manuell deployen |
| Seite zeigt altes Design | Vercel-Cache | "Redeploy" im Vercel-Dashboard klicken |
| SSL-Zertifikat fehlt | Proxy aktiv oder DNS zu frisch | Proxy prüfen, 10 Minuten warten |

---

## Step-Progress-Bar

6 Schritte, visuell identisch zur Textschmiede:

1. **Eingabe** — Formular ausfüllen
2. **Projekt** — Lokal anlegen
3. **GitHub** — Repo erstellen und pushen
4. **Vercel** — Projekt importieren und deployen
5. **DNS** — Cloudflare CNAME setzen
6. **Live** — Verifizieren und feiern

Aktueller Schritt: Kupfer-Highlight. Erledigte Schritte: Dezentes Häkchen. Zukünftige: Ausgegraut.

---

## UI-Elemente

### Copy-Button
- Neben jedem Code-Block
- Icon: Clipboard (SVG oder Unicode ⎘)
- Klick: Kopiert den Befehl, Button zeigt "Kopiert!" für 2 Sekunden
- Farbe: Kupfer-Akzent bei Hover

### Hinweis-Box
- Linker Rand: 3px solid Kupfer (#B5742A)
- Hintergrund: Card-Farbe (#110e0a)
- Icon: Plus-Symbol in Gold
- Nur bei Erfahrungslevel "Einsteiger" sichtbar (bei "Fortgeschritten" ausgeblendet)

### Warnung-Box
- Linker Rand: 3px solid #8B3A3A (gedecktes Dunkelrot)
- Immer sichtbar (unabhängig von Erfahrungslevel)
- Icon: Ausrufezeichen

### Code-Block
- Hintergrund: #0a0908 (minimal dunkler als Card)
- Font: JetBrains Mono, 14px
- Border: 1px solid var(--border)
- Zeilennummern: optional, nur bei mehrzeiligen Blöcken

### Abgeleitete Felder
- Wenn Projektbeschreibung eingegeben wird: Abgeleitete Felder füllen sich live (oninput-Event)
- Abgeleitete Felder haben dezenten "Automatisch"-Hinweis (verschwindet bei manuellem Edit)
- Bearbeitungs-Icon (Stift) neben abgeleiteten Feldern

---

## Vercel-Konfiguration

`vercel.json` für Stufe 1 (nur statisch):
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

## Stufe-2-Dokumentation (spätere Erweiterung)

Für die spätere Integration des KI-Troubleshooting-Dialogs:

### Provider-Auswahl
- Dropdown: Anthropic (Claude) / Google Gemini
- Gemini als kostenlose Option hervorheben

### API-Key-Eingabe
- Wie bei der Textschmiede: Modal bei erstem Troubleshooting-Klick
- Optional in localStorage speicherbar
- Transparenz-Text: "Dein API-Key wird ausschließlich für die direkte Kommunikation mit dem KI-Anbieter verwendet. Er wird nicht auf unseren Servern gespeichert. Der Quellcode dieser App ist auf GitHub einsehbar."

### Troubleshooting-Widget
- Unterhalb jedes Schritts: Ausklappbarer Bereich "Problem bei diesem Schritt?"
- Textarea für Fehlerbeschreibung
- "Hilfe anfordern"-Button → API-Call → Antwort inline gerendert
- System-Prompt enthält den Kontext des jeweiligen Schritts

### Serverless Function
```
api/troubleshoot.js
```
- Nimmt Provider, API-Key, Schritt-Kontext und Fehlerbeschreibung entgegen
- Routet an den jeweiligen Provider (Anthropic / Google)
- Gibt die Antwort zurück

---

## Wichtig für die Entwicklung

- Das Projekt basiert auf `peerendees/berent-website-template` — Fonts, Logos, CSS-Grundgerüst und CI-Rules sind bereits vorhanden
- Die `index.html` wird komplett neu geschrieben, nutzt aber die vorhandenen Assets aus dem Template
- Die Beispiel-`index.html` in der Anleitung hat KEIN BERENT CI — sie ist bewusst neutral und generisch
- Das BERENT CI gilt nur für die Startrampe-App selbst (Farben, Fonts, Layout, Plus-Symbol, Footer)
- Die Textschmiede (`textschmiede-5tc.berent.ai`) dient als visuelles und strukturelles Vorbild — studiere deren Step-Progress-Bar, Card-Layout, Dark Mode und Button-Stile
- Der Relaunch Guide (`relaunch-guide.berent.ai`) dient als inhaltliches Vorbild für den Guide-Charakter und Ton
