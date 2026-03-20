# Deploy Steps – Befehlsvorlagen

Dieses Dokument enthält die konkreten Befehlsvorlagen für jeden Schritt
der Startrampe. Platzhalter sind in `${...}`-Syntax.

Alle Vorlagen existieren in Varianten für jede Kombination aus
Betriebssystem und Entwicklungsumgebung.

---

## Platzhalter-Referenz

| Platzhalter | Quelle | Beispiel |
|-------------|--------|----------|
| `${projektName}` | Abgeleitet aus Beschreibung oder manuell | `kalorien-rechner` |
| `${subdomain}` | Abgeleitet oder manuell | `kalorien-rechner` |
| `${domain}` | Eingabefeld (Default: berent.ai) | `berent.ai` |
| `${githubUser}` | Eingabefeld | `maxmustermann` |
| `${projektBeschreibung}` | Eingabefeld | `Ein Kalorien-Rechner für meine Praxis` |

---

## Schritt 1: Lokales Projekt aufsetzen

### macOS / Linux

#### Claude Code
```bash
mkdir ~/Projekte/${projektName}
cd ~/Projekte/${projektName}
claude
```
In Claude Code eingeben:
> Erstelle eine einfache index.html mit dem Titel "${projektName}" und einer Überschrift, die das Projekt beschreibt.

#### Cursor
```bash
mkdir ~/Projekte/${projektName}
cursor ~/Projekte/${projektName}
```
In Cursor: Neue Datei → `index.html` → HTML5-Grundgerüst einfügen.

#### VS Code
```bash
mkdir ~/Projekte/${projektName}
cd ~/Projekte/${projektName}
code .
```
In VS Code: Neue Datei → `index.html` → `!` + Tab für Emmet-Grundgerüst.

#### Terminal
```bash
mkdir ~/Projekte/${projektName}
cd ~/Projekte/${projektName}
cat > index.html << 'EOF'
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
EOF
```

### Windows (PowerShell)

#### Claude Code
```powershell
mkdir C:\Users\$env:USERNAME\Projekte\${projektName}
cd C:\Users\$env:USERNAME\Projekte\${projektName}
claude
```

#### Cursor
```powershell
mkdir C:\Users\$env:USERNAME\Projekte\${projektName}
cursor C:\Users\$env:USERNAME\Projekte\${projektName}
```

#### VS Code
```powershell
mkdir C:\Users\$env:USERNAME\Projekte\${projektName}
cd C:\Users\$env:USERNAME\Projekte\${projektName}
code .
```

#### Terminal (PowerShell)
```powershell
mkdir C:\Users\$env:USERNAME\Projekte\${projektName}
cd C:\Users\$env:USERNAME\Projekte\${projektName}
@"
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
"@ | Out-File -Encoding utf8 index.html
```

---

## Schritt 2: Git initialisieren und nach GitHub pushen

### macOS / Linux
```bash
cd ~/Projekte/${projektName}
git init
git add .
git commit -m "Initial commit"
```

### Windows (PowerShell)
```powershell
cd C:\Users\$env:USERNAME\Projekte\${projektName}
git init
git add .
git commit -m "Initial commit"
```

### GitHub-Repository erstellen (alle OS)

1. Öffne https://github.com/new
2. Repository name: **${projektName}**
3. Visibility: Public
4. **NICHTS ankreuzen** (kein README, kein .gitignore, keine Lizenz)
5. "Create repository" klicken

### Remote verbinden und pushen (alle OS)
```bash
git remote add origin https://github.com/${githubUser}/${projektName}.git
git branch -M main
git push -u origin main
```

### Verifizierung
Öffne `https://github.com/${githubUser}/${projektName}` — deine `index.html` sollte dort sichtbar sein.

---

## Schritt 3: Vercel-Projekt verbinden

### Vorgehensweise (alle OS, browserbasiert)

1. Öffne https://vercel.com/new
2. Klicke "Import Git Repository"
3. Autorisiere GitHub falls noch nicht geschehen
4. Wähle **${githubUser}/${projektName}**
5. Einstellungen:
   - Framework Preset: **Other**
   - Root Directory: `.` (Standard)
   - Build Command: leer lassen
   - Output Directory: leer lassen
6. Klicke **"Deploy"**
7. Warte auf grünes Häkchen

### Verifizierung
Öffne die angezeigte Preview-URL (`${projektName}-[hash].vercel.app`).
Deine Seite sollte sichtbar sein.

---

## Schritt 4: Subdomain in Vercel hinzufügen

### Vorgehensweise (browserbasiert)

1. Im Vercel-Dashboard: Klicke auf dein Projekt **${projektName}**
2. Gehe zu **Settings → Domains**
3. Im Eingabefeld: **${subdomain}.${domain}**
4. Klicke **"Add"**
5. Vercel zeigt **"Invalid Configuration"** — das ist erwartungsgemäß

### Merken
Vercel zeigt das CNAME-Ziel an: `cname.vercel-dns.com`
Diesen Wert brauchst du im nächsten Schritt.

---

## Schritt 5: DNS in Cloudflare konfigurieren

### Vorgehensweise (browserbasiert)

1. Öffne https://dash.cloudflare.com
2. Wähle die Zone **${domain}**
3. Gehe zu **DNS → Records**
4. Klicke **"Add Record"**
5. Felder:

| Feld | Wert |
|------|------|
| Type | **CNAME** |
| Name | **${subdomain}** |
| Target | **cname.vercel-dns.com** |
| Proxy status | **DNS only** (graue Wolke klicken bis grau!) |
| TTL | **Auto** |

6. Klicke **"Save"**

### Wichtig: Warum "DNS only" (graue Wolke)?
Vercel stellt eigene SSL-Zertifikate aus (Let's Encrypt). Cloudflare-Proxy
(orangene Wolke) würde dazwischenfunken und einen SSL-Konflikt auslösen.
"DNS only" bedeutet: Cloudflare leitet nur weiter, ohne sich einzumischen.

---

## Schritt 6: Verifizieren und live gehen

### SSL-Check in Vercel
1. Zurück im Vercel-Dashboard: **Settings → Domains**
2. Warte bis neben **${subdomain}.${domain}** ein **grünes Häkchen** erscheint
3. Das dauert 1–5 Minuten

### Browser-Check
Öffne: **https://${subdomain}.${domain}**
Deine Seite sollte erscheinen.

### Ergebnis-Zusammenfassung

```
Live-URL:        https://${subdomain}.${domain}
Repository:      https://github.com/${githubUser}/${projektName}
Vercel-Projekt:  https://vercel.com/${githubUser}/${projektName}
```

### Nächste Schritte (als Hinweis am Ende)
- Jeder `git push` auf den `main`-Branch aktualisiert die Seite automatisch
- Design anpassen: Einfach `index.html` bearbeiten, committen, pushen
- Weitere Seiten hinzufügen: Neue HTML-Dateien im Projektordner anlegen

---

## Troubleshooting-Referenz

Diese Tabelle wird als ausklappbarer Bereich am Ende von Schritt 6 angezeigt.

| Problem | Ursache | Lösung |
|---------|---------|--------|
| "Invalid Configuration" bleibt in Vercel | DNS nicht propagiert | 5 Min. warten, Cloudflare-Eintrag prüfen |
| ERR_TOO_MANY_REDIRECTS | Cloudflare Proxy aktiv (orangene Wolke) | Auf "DNS only" (graue Wolke) umstellen |
| 404 Not Found (Vercel) | Kein Production-Deployment | `git push origin main` oder manuell "Redeploy" |
| Seite zeigt altes Design | Vercel-Cache | Im Dashboard "Redeploy" klicken |
| SSL-Zertifikat fehlt nach 10 Min. | Proxy aktiv oder DNS falsch | Proxy-Status und CNAME-Ziel prüfen |
| "Domain is already in use" (Vercel) | Domain bei anderem Vercel-Projekt | Dort erst entfernen |
| Git push schlägt fehl | Remote nicht korrekt | `git remote -v` prüfen, ggf. `git remote set-url origin ...` |
| GitHub-Repo ist nicht leer | README/gitignore automatisch erstellt | Repo löschen, neu ohne Dateien erstellen |

---

## Namensableitungs-Algorithmus (JavaScript-Referenz)

```javascript
function deriveProjectName(beschreibung) {
  const stopwords = ['ein', 'eine', 'einer', 'der', 'die', 'das', 'für',
    'und', 'oder', 'mit', 'von', 'zu', 'im', 'am', 'an', 'auf', 'in',
    'mein', 'meine', 'meiner', 'meinem', 'meinen', 'ich', 'wir', 'unser',
    'unsere', 'ist', 'sind', 'wird', 'soll', 'kann', 'hat', 'haben'];

  return beschreibung
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .split(/\s+/)
    .filter(w => !stopwords.includes(w))
    .slice(0, 4)
    .join('-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
    .replace(/-$/g, '');
}
```
