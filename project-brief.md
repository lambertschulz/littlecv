# BewerbungsBuilder – Project Brief

## Vision

Lokales, browserbasiertes Tool zum Erstellen professioneller Bewerbungsunterlagen – ohne Account, ohne Server, ohne Word-Gefummel. Der Nutzer gibt seine Daten einmalig ein, wählt ein Template, passt es an und exportiert fertige PDFs.

---

## Hosting & Deployment

- **Hosting:** GitHub Pages
- **Build-Tool:** Vite
- **Deploy:** `gh-pages` Branch via `vite build` + `gh-pages` npm-Paket
- **Kein Backend**, keine API, keine Authentifizierung

---

## Tech Stack

| Layer | Technologie |
|---|---|
| UI Framework | React |
| Styling | Tailwind CSS |
| State Management | Jotai |
| PDF Rendering | `@react-pdf/renderer` |
| Build Tool | Vite |
| Persistenz | `jotai/utils` → `atomWithStorage` (localStorage) + JSON Export/Import |

---

## Unterstützte Dokumente

1. **Lebenslauf (CV)** – mehrseitig
2. **Anschreiben** – einseitig
3. **Deckblatt** – einseitig

---

## App-Struktur

Kein Router. Die aktive Ansicht wird als Jotai Atom verwaltet.

```
┌─────────────────────────────────────────────┐
│  Toolbar                                    │
│  [Template wählen] [Theme] [Export] [Save]  │
├────────────────────┬────────────────────────┤
│                    │                        │
│  Editor            │  Preview               │
│  (Formular-Panels) │  (Live PDF-Vorschau)   │
│                    │  (scrollbar, mehrs.)   │
└────────────────────┴────────────────────────┘
```

### View State

```ts
type ActiveView = 'editor' | 'preview'
const activeViewAtom = atom<ActiveView>('editor')
```

---

## Datenmodell

### `CvData` Interface

```ts
interface CvData {
  profile: {
    name: string
    title: string
    email: string
    phone: string
    address?: string
    website?: string
    photo?: string          // base64-kodiertes Bild, optional
  }
  experience: {
    id: string
    company: string
    role: string
    period: string
    description: string
  }[]
  education: {
    id: string
    institution: string
    degree: string
    period: string
    description?: string
  }[]
  skills: {
    id: string
    label: string
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }[]
  coverLetter?: {
    recipient: string
    recipientAddress?: string
    subject?: string
    body: string
    date: string
  }
  coverPage?: {
    company: string
    position: string
    date: string
  }
}
```

> **Foto als Base64:** `File`-Objekte sind nicht JSON-serialisierbar und können daher nicht in localStorage gespeichert werden. Base64-Strings lösen dieses Problem ohne externen Speicher.

---

## Template-System

### Konzept

Jedes Template ist eine eigenständige React-Komponente. Templates werden in einer zentralen Registry registriert. Neue Templates lassen sich einfach durch Erstellen einer neuen Komponente hinzufügen.

### Generic Template Interface

```ts
type CvTemplate<T extends object = {}> = React.FC<{
  data: CvData
  theme: T
}>
```

### Template Registry

```ts
interface TemplateConfig<T extends object = {}> {
  key: string                  // Eindeutiger Identifier, z.B. 'modern'
  label: string                // Anzeigename, z.B. 'Modern'
  thumbnail: string            // Vorschaubild-URL
  component: CvTemplate<T>
  defaultTheme: T
}

const templateRegistry: TemplateConfig[] = [
  {
    key: 'modern',
    label: 'Modern',
    component: ModernTemplate,
    defaultTheme: modernDefaultTheme,
    thumbnail: '/thumbnails/modern.png'
  },
  {
    key: 'classic',
    label: 'Klassisch',
    component: ClassicTemplate,
    defaultTheme: classicDefaultTheme,
    thumbnail: '/thumbnails/classic.png'
  },
  // weitere Templates...
]
```

### Beispiel: Template-spezifische Themes

Jedes Template definiert sein eigenes Theme-Interface mit den Optionen, die für sein Layout relevant sind:

```ts
// Modern Template
interface ModernTheme {
  primaryColor: string
  accentColor: string
  fontFamily: 'inter' | 'roboto'
  fontSize: 'sm' | 'md' | 'lg'
}

// Classic Template
interface ClassicTheme {
  primaryColor: string
  fontFamily: 'playfair' | 'georgia'
  headerStyle: 'underline' | 'block'
  fontSize: 'sm' | 'md' | 'lg'
}
```

---

## State Management (Jotai)

### Atom-Übersicht

```ts
// Hauptdaten – wird in localStorage persistiert
const cvDataAtom = atomWithStorage<CvData>('cv-data', defaultCvData)

// Aktives Template
const activeTemplateKeyAtom = atomWithStorage<string>('active-template', 'modern')

// Themes pro Template – persistiert, Template-Key → Theme-Objekt
const templateThemesAtom = atomWithStorage<Record<string, object>>(
  'template-themes',
  {
    modern: modernDefaultTheme,
    classic: classicDefaultTheme,
  }
)

// Derived Atom: aktuelles Theme lesen & schreiben
const activeThemeAtom = atom(
  (get) => get(templateThemesAtom)[get(activeTemplateKeyAtom)],
  (get, set, newTheme: object) => {
    const key = get(activeTemplateKeyAtom)
    set(templateThemesAtom, prev => ({ ...prev, [key]: newTheme }))
  }
)

// Aktive Ansicht
const activeViewAtom = atom<'editor' | 'preview'>('editor')
```

### Theme-Persistenz-Verhalten

- Template wechseln → nur `activeTemplateKeyAtom` ändert sich, `templateThemesAtom` bleibt unangetastet
- Theme anpassen → `activeThemeAtom`-Setter schreibt nur in den Key des aktiven Templates
- Zurück zu einem früheren Template → gespeichertes, angepasstes Theme wird automatisch geladen

---

## PDF Export

### Export-Scopes

```ts
type ExportScope = 'all' | 'cv' | 'coverLetter' | 'coverPage'
```

Der Export-Service komponiert das finale PDF aus den relevanten Template-Teilen je nach gewähltem Scope:

| Scope | Enthält |
|---|---|
| `all` | Deckblatt + Anschreiben + Lebenslauf |
| `cv` | Nur Lebenslauf |
| `coverLetter` | Nur Anschreiben |
| `coverPage` | Nur Deckblatt |

### Mehrseitigkeit

- `@react-pdf/renderer` handhabt automatisch Seitenumbrüche
- Der Lebenslauf kann mehrere Seiten umfassen
- Preview zeigt alle Seiten scrollbar untereinander

---

## Datenpersistenz

### localStorage (automatisch)

Alle Atoms mit `atomWithStorage` werden automatisch synchronisiert. Kein manuelles Speichern notwendig.

Gespeicherte Keys:
- `cv-data` – alle Bewerberdaten
- `active-template` – aktives Template
- `template-themes` – alle Theme-Anpassungen pro Template

### JSON Export/Import

- **Export:** Aktuellen State als `.json`-Datei herunterladen
- **Import:** JSON-Datei laden und State vollständig überschreiben
- Format: Alle drei localStorage-Keys in einem Objekt

```json
{
  "cvData": { ... },
  "activeTemplate": "modern",
  "templateThemes": { ... }
}
```

---

## Editor-Panels

Der Editor ist in Sektionen unterteilt, die den `CvData`-Feldern entsprechen:

| Panel | Beschreibung |
|---|---|
| **Profil** | Name, Titel, Kontakt, Foto-Upload |
| **Berufserfahrung** | Liste von Stationen, sortierbar, hinzufügen/entfernen |
| **Ausbildung** | Liste von Abschlüssen, sortierbar |
| **Skills** | Tags mit optionalem Level |
| **Anschreiben** | Empfänger, Betreff, Freitext |
| **Deckblatt** | Firma, Stelle, Datum |

---

## Nicht im Scope (MVP)

- Drag & Drop für Layout-Blöcke
- Eigene Templates im Browser bauen
- Cloud-Sync oder Backend
- Mehrsprachigkeit
- KI-Unterstützung (z.B. Texte generieren)
- Versionsverlauf

---

## Mögliche spätere Erweiterungen (Backlog)

- Theme-Editor: Farbpicker & Schriftauswahl direkt in der UI
- Weitere Templates
- Drag & Drop Sortierung für Erfahrung/Ausbildung
- KI-Integration für Anschreibentexte (lokale API optional)
- Dark Mode für die App-UI

---

## Offene Fragen (vor Entwicklungsstart klären)

1. **Wie viele Templates zum Start?** – Empfehlung: 2 (Modern + Classic), damit das Template-System sauber validiert wird
2. **Thumbnail-Vorschau:** Statische Bilder oder Mini-PDF-Render?
3. **Schriftarten in react-pdf:** Externe Fonts müssen explizit registriert werden – Auswahl vorab festlegen
