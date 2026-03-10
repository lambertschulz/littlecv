# Bewerbungsmappe Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, browser-based CV/cover letter/cover page builder with live PDF preview, template system, and JSON export — hosted on GitHub Pages.

**Architecture:** Single-page React app with Jotai for state (persisted to localStorage via `atomWithStorage`). Split-pane layout: editor forms on the left, live `@react-pdf/renderer` preview on the right. Template system uses a registry of React components, each with its own theme interface. No router — view state managed via atoms.

**Tech Stack:** React, Vite, Tailwind CSS, Jotai, `@react-pdf/renderer`, TypeScript

---

## File Structure

```
littlecv/
├── public/
│   └── thumbnails/           # Generated SVG template thumbnails (SVG chosen over spec's .png for easy generation and editability)
│       ├── modern.svg
│       └── classic.svg
├── src/
│   ├── main.tsx              # App entry point, render root
│   ├── App.tsx               # Top-level layout: Toolbar + SplitPane
│   ├── types/
│   │   └── cv.ts             # CvData, ExportScope, template interfaces
│   ├── state/
│   │   └── atoms.ts          # All Jotai atoms
│   ├── fonts/
│   │   ├── register.ts       # Font registration (bundled + Google Fonts)
│   │   └── files/            # Bundled .ttf files (Inter, Roboto, Playfair)
│   ├── templates/
│   │   ├── registry.ts       # Template registry + TemplateConfig type
│   │   ├── modern/
│   │   │   ├── ModernTemplate.tsx    # PDF component for Modern
│   │   │   ├── ModernCoverLetter.tsx # Cover letter variant
│   │   │   ├── ModernCoverPage.tsx   # Cover page variant
│   │   │   └── theme.ts             # ModernTheme interface + defaults
│   │   └── classic/
│   │       ├── ClassicTemplate.tsx
│   │       ├── ClassicCoverLetter.tsx
│   │       ├── ClassicCoverPage.tsx
│   │       └── theme.ts
│   ├── components/
│   │   ├── Toolbar.tsx           # Top bar: template picker, theme, export, save/load
│   │   ├── SplitPane.tsx         # Left/right responsive layout
│   │   ├── Preview.tsx           # PDF preview (renders active template)
│   │   ├── editor/
│   │   │   ├── EditorPanel.tsx       # Container for all editor sections
│   │   │   ├── ProfileSection.tsx    # Name, title, contact, photo upload
│   │   │   ├── ExperienceSection.tsx # Work experience list (add/remove/reorder)
│   │   │   ├── EducationSection.tsx  # Education list (add/remove/reorder)
│   │   │   ├── SkillsSection.tsx     # Skills tags with level
│   │   │   ├── CoverLetterSection.tsx # Cover letter fields
│   │   │   └── CoverPageSection.tsx   # Cover page fields
│   │   ├── theme/
│   │   │   ├── ThemeEditor.tsx       # Dynamic theme editor per template
│   │   │   └── FontManager.tsx       # Add custom Google Fonts
│   │   └── shared/
│   │       ├── SortableList.tsx      # Reusable sortable list (experience/education)
│   │       ├── PhotoUpload.tsx       # Image upload → base64
│   │       └── CollapsiblePanel.tsx  # Collapsible accordion section
│   ├── services/
│   │   ├── export-pdf.ts        # PDF blob generation + download
│   │   └── export-json.ts       # JSON export/import
│   └── index.css                # Tailwind directives + global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Pages deploy via gh-pages
```

---

## Chunk 1: Project Scaffolding & Core Types

### Task 1: Initialize Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

Note: Tailwind v4 with `@tailwindcss/vite` does not require `tailwind.config.js` or `postcss.config.js`.

- [ ] **Step 1: Scaffold the project**

```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install jotai @react-pdf/renderer
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Tailwind**

Replace `src/index.css` with:

```css
@import "tailwindcss";
```

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/littlecv/',
})
```

Note: `base` is set for GitHub Pages deployment under the repo name.

- [ ] **Step 4: Set up minimal App.tsx**

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <h1 className="text-2xl font-bold p-4">Bewerbungsmappe</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: App renders with "Bewerbungsmappe" heading, Tailwind styles applied.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript + Tailwind project"
```

---

### Task 2: Define core types

**Files:**
- Create: `src/types/cv.ts`

- [ ] **Step 1: Create the CvData interface and related types**

```ts
// src/types/cv.ts

export interface Profile {
  name: string
  title: string
  email: string
  phone: string
  address?: string
  website?: string
  photo?: string // base64-encoded image
}

export interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  period: string
  description?: string
}

export interface Skill {
  id: string
  label: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface CoverLetter {
  recipient: string
  recipientAddress?: string
  subject?: string
  body: string
  date: string
}

export interface CoverPage {
  company: string
  position: string
  date: string
}

export interface CvData {
  profile: Profile
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  coverLetter?: CoverLetter
  coverPage?: CoverPage
}

export type ExportScope = 'all' | 'cv' | 'coverLetter' | 'coverPage'

export type ActiveView = 'editor' | 'preview'
```

- [ ] **Step 2: Commit**

```bash
git add src/types/cv.ts
git commit -m "feat: add core CvData types and interfaces"
```

---

### Task 3: Define template system types and registry shell

**Files:**
- Create: `src/templates/registry.ts`

- [ ] **Step 1: Create template types and empty registry**

```ts
// src/templates/registry.ts
import type { FC } from 'react'
import type { CvData } from '../types/cv'

export type CvTemplate<T extends object = object> = FC<{
  data: CvData
  theme: T
}>

export type CoverLetterTemplate<T extends object = object> = FC<{
  data: CvData
  theme: T
}>

export type CoverPageTemplate<T extends object = object> = FC<{
  data: CvData
  theme: T
}>

export interface ThemeSchemaEntry {
  key: string
  label: string
  type: 'color' | 'select'
  options?: string[]
}

export interface TemplateConfig<T extends object = object> {
  key: string
  label: string
  thumbnail: string
  cv: CvTemplate<T>
  coverLetter: CoverLetterTemplate<T>
  coverPage: CoverPageTemplate<T>
  defaultTheme: T
  themeSchema: ThemeSchemaEntry[]
}

// Will be populated as templates are added
export const templateRegistry: TemplateConfig[] = []

export function getTemplate(key: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.key === key)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/templates/registry.ts
git commit -m "feat: add template system types and registry"
```

---

### Task 4: Set up Jotai atoms

**Files:**
- Create: `src/state/atoms.ts`

- [ ] **Step 1: Create all atoms with default data**

```ts
// src/state/atoms.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { CvData, ActiveView } from '../types/cv'

const defaultCvData: CvData = {
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
  },
  experience: [],
  education: [],
  skills: [],
}

export const cvDataAtom = atomWithStorage<CvData>('cv-data', defaultCvData)

export const activeTemplateKeyAtom = atomWithStorage<string>(
  'active-template',
  'modern'
)

export const templateThemesAtom = atomWithStorage<Record<string, object>>(
  'template-themes',
  {}
)

export const activeThemeAtom = atom(
  (get) => {
    const themes = get(templateThemesAtom)
    const key = get(activeTemplateKeyAtom)
    return themes[key] ?? {}
  },
  (get, set, newTheme: object) => {
    const key = get(activeTemplateKeyAtom)
    set(templateThemesAtom, (prev) => ({ ...prev, [key]: newTheme }))
  }
)

export const activeViewAtom = atom<ActiveView>('editor')

// Custom Google Fonts registered by the user: { family: string, url: string }[]
export const customFontsAtom = atomWithStorage<
  { family: string; url: string }[]
>('custom-fonts', [])
```

- [ ] **Step 2: Commit**

```bash
git add src/state/atoms.ts
git commit -m "feat: add Jotai atoms for CV data, templates, and themes"
```

---

## Chunk 2: Font System & PDF Foundation

### Task 5: Bundle fonts and create font registration

**Files:**
- Create: `src/fonts/files/` (directory with .ttf files)
- Create: `src/fonts/register.ts`

- [ ] **Step 1: Download bundled font files**

Download TTF files from Google Fonts and commit them to the repo (not via npm — react-pdf needs direct TTF file imports, and bundling them ensures fully offline operation).

Place them in `src/fonts/files/`:
- `Inter-Regular.ttf`, `Inter-Bold.ttf`
- `Roboto-Regular.ttf`, `Roboto-Bold.ttf`
- `PlayfairDisplay-Regular.ttf`, `PlayfairDisplay-Bold.ttf`

Download from Google Fonts: visit each font page, click "Download family", extract the TTF files from the zip.

- [ ] **Step 2: Create font registration module**

```ts
// src/fonts/register.ts
import { Font } from '@react-pdf/renderer'

import InterRegular from './files/Inter-Regular.ttf'
import InterBold from './files/Inter-Bold.ttf'
import RobotoRegular from './files/Roboto-Regular.ttf'
import RobotoBold from './files/Roboto-Bold.ttf'
import PlayfairRegular from './files/PlayfairDisplay-Regular.ttf'
import PlayfairBold from './files/PlayfairDisplay-Bold.ttf'

export function registerBundledFonts() {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: InterRegular, fontWeight: 'normal' },
      { src: InterBold, fontWeight: 'bold' },
    ],
  })

  Font.register({
    family: 'Roboto',
    fonts: [
      { src: RobotoRegular, fontWeight: 'normal' },
      { src: RobotoBold, fontWeight: 'bold' },
    ],
  })

  Font.register({
    family: 'Playfair Display',
    fonts: [
      { src: PlayfairRegular, fontWeight: 'normal' },
      { src: PlayfairBold, fontWeight: 'bold' },
    ],
  })
}

/**
 * Register a Google Font by family name.
 * Fetches the CSS from Google Fonts API, extracts TTF URLs, and registers them.
 */
export async function registerGoogleFont(family: string): Promise<void> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`

  const res = await fetch(url, {
    headers: {
      // Request TTF format (default for non-woff2 user agents)
      'User-Agent':
        'Mozilla/5.0 (compatible; react-pdf font loader)',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch font "${family}" from Google Fonts`)
  }

  const css = await res.text()

  // Extract TTF/woff2 URLs from the CSS
  const fontFaces = css.matchAll(
    /font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)/g
  )

  const fonts: { src: string; fontWeight: string }[] = []
  for (const match of fontFaces) {
    const weight = match[1] === '700' ? 'bold' : 'normal'
    fonts.push({ src: match[2], fontWeight: weight })
  }

  if (fonts.length === 0) {
    throw new Error(`No font files found for "${family}"`)
  }

  Font.register({ family, fonts })
}
```

- [ ] **Step 3: Add Vite config for TTF file imports**

Vite handles static assets by default, but add a type declaration for `.ttf` imports:

Create `src/vite-env.d.ts` (or append to existing):

```ts
/// <reference types="vite/client" />

declare module '*.ttf' {
  const src: string
  export default src
}
```

- [ ] **Step 4: Call registerBundledFonts in main.tsx**

Update `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { registerBundledFonts } from './fonts/register'
import './index.css'

registerBundledFonts()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 5: Verify build succeeds**

```bash
npm run build
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/fonts/ src/vite-env.d.ts src/main.tsx
git commit -m "feat: add font system with bundled fonts and Google Fonts support"
```

---

## Chunk 3: Templates (Modern + Classic)

### Task 6: Modern template — CV

**Files:**
- Create: `src/templates/modern/theme.ts`
- Create: `src/templates/modern/ModernTemplate.tsx`

- [ ] **Step 1: Define Modern theme**

```ts
// src/templates/modern/theme.ts
export interface ModernTheme {
  primaryColor: string
  accentColor: string
  fontFamily: 'Inter' | 'Roboto'
  fontSize: 'sm' | 'md' | 'lg'
}

export const modernDefaultTheme: ModernTheme = {
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'md',
}

export const modernThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'accentColor', label: 'Akzentfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Inter', 'Roboto'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
```

- [ ] **Step 2: Implement Modern CV template**

```tsx
// src/templates/modern/ModernTemplate.tsx
import { Page, View, Text, Image, Document, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ModernTheme } from './theme'

const FONT_SIZES = { sm: 9, md: 10, lg: 11 } as const

export const ModernTemplate: React.FC<{ data: CvData; theme: ModernTheme }> = ({
  data,
  theme,
}) => {
  const fs = FONT_SIZES[theme.fontSize]

  const styles = StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      padding: 40,
      color: '#1f2937',
    },
    header: {
      flexDirection: 'row',
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: theme.primaryColor,
      paddingBottom: 15,
    },
    photo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    name: {
      fontSize: fs + 10,
      fontWeight: 'bold',
      color: theme.primaryColor,
    },
    title: {
      fontSize: fs + 2,
      color: '#6b7280',
      marginTop: 2,
    },
    contactRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 4,
      fontSize: fs - 1,
      color: '#6b7280',
    },
    sectionTitle: {
      fontSize: fs + 2,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginTop: 16,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.accentColor,
      paddingBottom: 3,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    entryTitle: {
      fontWeight: 'bold',
    },
    entryPeriod: {
      color: '#6b7280',
      fontSize: fs - 1,
    },
    entryDescription: {
      marginBottom: 8,
      lineHeight: 1.4,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillTag: {
      backgroundColor: theme.accentColor + '20',
      color: theme.primaryColor,
      padding: '3 8',
      borderRadius: 4,
      fontSize: fs - 1,
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {data.profile.photo && (
          <Image src={data.profile.photo} style={styles.photo} />
        )}
        <View>
          <Text style={styles.name}>{data.profile.name || 'Ihr Name'}</Text>
          <Text style={styles.title}>{data.profile.title}</Text>
          <View style={styles.contactRow}>
            {data.profile.email && <Text>{data.profile.email}</Text>}
            {data.profile.phone && <Text>{data.profile.phone}</Text>}
            {data.profile.address && <Text>{data.profile.address}</Text>}
            {data.profile.website && <Text>{data.profile.website}</Text>}
          </View>
        </View>
      </View>

      {/* Experience */}
      {data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Berufserfahrung</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {exp.role} — {exp.company}
                </Text>
                <Text style={styles.entryPeriod}>{exp.period}</Text>
              </View>
              <Text style={styles.entryDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Ausbildung</Text>
          {data.education.map((edu) => (
            <View key={edu.id} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {edu.degree} — {edu.institution}
                </Text>
                <Text style={styles.entryPeriod}>{edu.period}</Text>
              </View>
              {edu.description && (
                <Text style={styles.entryDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Kenntnisse</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillTag}>
                {skill.label}
                {skill.level ? ` (${skill.level})` : ''}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/templates/modern/
git commit -m "feat: add Modern CV template with theme"
```

---

### Task 7: Modern template — Cover Letter + Cover Page

**Files:**
- Create: `src/templates/modern/ModernCoverLetter.tsx`
- Create: `src/templates/modern/ModernCoverPage.tsx`

- [ ] **Step 1: Implement Modern Cover Letter**

```tsx
// src/templates/modern/ModernCoverLetter.tsx
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ModernTheme } from './theme'

const FONT_SIZES = { sm: 9, md: 10, lg: 11 } as const

export const ModernCoverLetter: React.FC<{ data: CvData; theme: ModernTheme }> = ({
  data,
  theme,
}) => {
  const cl = data.coverLetter
  if (!cl) return null
  const fs = FONT_SIZES[theme.fontSize]

  const styles = StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      padding: 50,
      color: '#1f2937',
    },
    senderBlock: {
      marginBottom: 30,
    },
    senderName: {
      fontSize: fs + 4,
      fontWeight: 'bold',
      color: theme.primaryColor,
    },
    date: {
      marginBottom: 20,
      color: '#6b7280',
    },
    recipient: {
      marginBottom: 20,
    },
    subject: {
      fontWeight: 'bold',
      fontSize: fs + 1,
      marginBottom: 20,
    },
    body: {
      lineHeight: 1.6,
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.senderBlock}>
        <Text style={styles.senderName}>{data.profile.name}</Text>
        {data.profile.address && <Text>{data.profile.address}</Text>}
        <Text>{data.profile.email}</Text>
        <Text>{data.profile.phone}</Text>
      </View>

      <Text style={styles.date}>{cl.date}</Text>

      <View style={styles.recipient}>
        <Text>{cl.recipient}</Text>
        {cl.recipientAddress && <Text>{cl.recipientAddress}</Text>}
      </View>

      {cl.subject && <Text style={styles.subject}>{cl.subject}</Text>}

      <Text style={styles.body}>{cl.body}</Text>
    </Page>
  )
}
```

- [ ] **Step 2: Implement Modern Cover Page**

```tsx
// src/templates/modern/ModernCoverPage.tsx
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ModernTheme } from './theme'

export const ModernCoverPage: React.FC<{ data: CvData; theme: ModernTheme }> = ({
  data,
  theme,
}) => {
  const cp = data.coverPage
  if (!cp) return null

  const styles = StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 200,
      backgroundColor: theme.primaryColor,
    },
    content: {
      alignItems: 'center',
      marginTop: 100,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 4,
    },
    titleText: {
      fontSize: 14,
      color: '#ffffff',
      opacity: 0.9,
    },
    details: {
      marginTop: 60,
      alignItems: 'center',
    },
    label: {
      fontSize: 10,
      color: '#6b7280',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    value: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 20,
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.colorBar} />
      <View style={styles.content}>
        {data.profile.photo && (
          <Image src={data.profile.photo} style={styles.photo} />
        )}
        <Text style={styles.name}>{data.profile.name}</Text>
        <Text style={styles.titleText}>{data.profile.title}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Bewerbung als</Text>
        <Text style={styles.value}>{cp.position}</Text>
        <Text style={styles.label}>Bei</Text>
        <Text style={styles.value}>{cp.company}</Text>
        <Text style={styles.label}>Datum</Text>
        <Text style={styles.value}>{cp.date}</Text>
      </View>
    </Page>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/templates/modern/
git commit -m "feat: add Modern cover letter and cover page templates"
```

---

### Task 8: Classic template — All three documents

**Files:**
- Create: `src/templates/classic/theme.ts`
- Create: `src/templates/classic/ClassicTemplate.tsx`
- Create: `src/templates/classic/ClassicCoverLetter.tsx`
- Create: `src/templates/classic/ClassicCoverPage.tsx`

- [ ] **Step 1: Define Classic theme**

```ts
// src/templates/classic/theme.ts
export interface ClassicTheme {
  primaryColor: string
  fontFamily: 'Playfair Display' | 'Roboto'
  headerStyle: 'underline' | 'block'
  fontSize: 'sm' | 'md' | 'lg'
}

export const classicDefaultTheme: ClassicTheme = {
  primaryColor: '#1e3a5f',
  fontFamily: 'Playfair Display',
  headerStyle: 'underline',
  fontSize: 'md',
}

export const classicThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Playfair Display', 'Roboto'] },
  { key: 'headerStyle', label: 'Überschrift-Stil', type: 'select' as const, options: ['underline', 'block'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
```

- [ ] **Step 2: Implement Classic CV template**

```tsx
// src/templates/classic/ClassicTemplate.tsx
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ClassicTheme } from './theme'

const FONT_SIZES = { sm: 9, md: 10, lg: 11 } as const

export const ClassicTemplate: React.FC<{ data: CvData; theme: ClassicTheme }> = ({
  data,
  theme,
}) => {
  const fs = FONT_SIZES[theme.fontSize]
  const isBlock = theme.headerStyle === 'block'

  const styles = StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      padding: 50,
      color: '#1f2937',
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
    },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 10,
    },
    name: {
      fontSize: fs + 12,
      fontWeight: 'bold',
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    title: {
      fontSize: fs + 1,
      color: '#6b7280',
      marginTop: 4,
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 15,
      marginTop: 6,
      fontSize: fs - 1,
      color: '#6b7280',
    },
    sectionTitleUnderline: {
      fontSize: fs + 2,
      fontWeight: 'bold',
      color: theme.primaryColor,
      marginTop: 18,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
      paddingBottom: 3,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sectionTitleBlock: {
      fontSize: fs + 2,
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: theme.primaryColor,
      marginTop: 18,
      marginBottom: 8,
      padding: '4 8',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    entryTitle: {
      fontWeight: 'bold',
    },
    entryPeriod: {
      color: '#6b7280',
      fontSize: fs - 1,
      fontStyle: 'italic',
    },
    entryDescription: {
      marginBottom: 8,
      lineHeight: 1.5,
    },
    skillsList: {
      lineHeight: 1.6,
    },
  })

  const sectionTitleStyle = isBlock
    ? styles.sectionTitleBlock
    : styles.sectionTitleUnderline

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {data.profile.photo && (
          <Image src={data.profile.photo} style={styles.photo} />
        )}
        <Text style={styles.name}>{data.profile.name || 'Ihr Name'}</Text>
        <Text style={styles.title}>{data.profile.title}</Text>
        <View style={styles.contactRow}>
          {data.profile.email && <Text>{data.profile.email}</Text>}
          {data.profile.phone && <Text>{data.profile.phone}</Text>}
          {data.profile.address && <Text>{data.profile.address}</Text>}
          {data.profile.website && <Text>{data.profile.website}</Text>}
        </View>
      </View>

      {/* Experience */}
      {data.experience.length > 0 && (
        <View>
          <Text style={sectionTitleStyle}>Berufserfahrung</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {exp.role} — {exp.company}
                </Text>
                <Text style={styles.entryPeriod}>{exp.period}</Text>
              </View>
              <Text style={styles.entryDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <View>
          <Text style={sectionTitleStyle}>Ausbildung</Text>
          {data.education.map((edu) => (
            <View key={edu.id} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {edu.degree} — {edu.institution}
                </Text>
                <Text style={styles.entryPeriod}>{edu.period}</Text>
              </View>
              {edu.description && (
                <Text style={styles.entryDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <View>
          <Text style={sectionTitleStyle}>Kenntnisse</Text>
          <Text style={styles.skillsList}>
            {data.skills
              .map((s) => s.label + (s.level ? ` (${s.level})` : ''))
              .join(' · ')}
          </Text>
        </View>
      )}
    </Page>
  )
}
```

- [ ] **Step 3: Implement Classic Cover Letter**

```tsx
// src/templates/classic/ClassicCoverLetter.tsx
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ClassicTheme } from './theme'

const FONT_SIZES = { sm: 9, md: 10, lg: 11 } as const

export const ClassicCoverLetter: React.FC<{ data: CvData; theme: ClassicTheme }> = ({
  data,
  theme,
}) => {
  const cl = data.coverLetter
  if (!cl) return null
  const fs = FONT_SIZES[theme.fontSize]

  const styles = StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      padding: 60,
      color: '#1f2937',
    },
    senderBlock: {
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
      paddingBottom: 15,
    },
    senderName: {
      fontSize: fs + 4,
      fontWeight: 'bold',
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    contactLine: {
      fontSize: fs - 1,
      color: '#6b7280',
      marginTop: 2,
    },
    date: {
      textAlign: 'right',
      marginBottom: 20,
      color: '#6b7280',
      fontStyle: 'italic',
    },
    recipient: {
      marginBottom: 25,
    },
    subject: {
      fontWeight: 'bold',
      fontSize: fs + 1,
      marginBottom: 20,
      color: theme.primaryColor,
    },
    body: {
      lineHeight: 1.7,
      textAlign: 'justify',
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.senderBlock}>
        <Text style={styles.senderName}>{data.profile.name}</Text>
        {data.profile.address && (
          <Text style={styles.contactLine}>{data.profile.address}</Text>
        )}
        <Text style={styles.contactLine}>
          {data.profile.email} · {data.profile.phone}
        </Text>
      </View>

      <Text style={styles.date}>{cl.date}</Text>

      <View style={styles.recipient}>
        <Text>{cl.recipient}</Text>
        {cl.recipientAddress && <Text>{cl.recipientAddress}</Text>}
      </View>

      {cl.subject && <Text style={styles.subject}>{cl.subject}</Text>}

      <Text style={styles.body}>{cl.body}</Text>
    </Page>
  )
}
```

- [ ] **Step 4: Implement Classic Cover Page**

```tsx
// src/templates/classic/ClassicCoverPage.tsx
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ClassicTheme } from './theme'

export const ClassicCoverPage: React.FC<{ data: CvData; theme: ClassicTheme }> = ({
  data,
  theme,
}) => {
  const cp = data.coverPage
  if (!cp) return null

  const styles = StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    },
    rule: {
      width: 80,
      height: 2,
      backgroundColor: theme.primaryColor,
      marginVertical: 20,
    },
    photo: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: 15,
    },
    name: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 3,
    },
    titleText: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 4,
    },
    label: {
      fontSize: 9,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginTop: 15,
    },
    value: {
      fontSize: 16,
      color: '#1f2937',
      marginTop: 4,
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      {data.profile.photo && (
        <Image src={data.profile.photo} style={styles.photo} />
      )}
      <Text style={styles.name}>{data.profile.name}</Text>
      <Text style={styles.titleText}>{data.profile.title}</Text>

      <View style={styles.rule} />

      <Text style={styles.label}>Bewerbung als</Text>
      <Text style={styles.value}>{cp.position}</Text>

      <Text style={styles.label}>Bei</Text>
      <Text style={styles.value}>{cp.company}</Text>

      <View style={styles.rule} />

      <Text style={styles.label}>Datum</Text>
      <Text style={styles.value}>{cp.date}</Text>
    </Page>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/templates/classic/
git commit -m "feat: add Classic template (CV, cover letter, cover page)"
```

---

### Task 9: Register templates and generate SVG thumbnails

**Files:**
- Modify: `src/templates/registry.ts`
- Create: `public/thumbnails/modern.svg`
- Create: `public/thumbnails/classic.svg`
- Modify: `src/state/atoms.ts` (populate default themes)

- [ ] **Step 1: Register both templates in registry**

```ts
// src/templates/registry.ts — update imports and registry
import { ModernTemplate } from './modern/ModernTemplate'
import { ModernCoverLetter } from './modern/ModernCoverLetter'
import { ModernCoverPage } from './modern/ModernCoverPage'
import { modernDefaultTheme, modernThemeSchema } from './modern/theme'
import { ClassicTemplate } from './classic/ClassicTemplate'
import { ClassicCoverLetter } from './classic/ClassicCoverLetter'
import { ClassicCoverPage } from './classic/ClassicCoverPage'
import { classicDefaultTheme, classicThemeSchema } from './classic/theme'

export const templateRegistry: TemplateConfig[] = [
  {
    key: 'modern',
    label: 'Modern',
    thumbnail: '/thumbnails/modern.svg',
    cv: ModernTemplate,
    coverLetter: ModernCoverLetter,
    coverPage: ModernCoverPage,
    defaultTheme: modernDefaultTheme,
    themeSchema: modernThemeSchema,
  },
  {
    key: 'classic',
    label: 'Klassisch',
    thumbnail: '/thumbnails/classic.svg',
    cv: ClassicTemplate,
    coverLetter: ClassicCoverLetter,
    coverPage: ClassicCoverPage,
    defaultTheme: classicDefaultTheme,
    themeSchema: classicThemeSchema,
  },
]
```

- [ ] **Step 2: Create SVG thumbnail for Modern template**

Create `public/thumbnails/modern.svg` — a simplified visual representation of the Modern layout:
- Blue (#2563eb) accent bar at top
- Placeholder for photo circle, name block
- Horizontal lines representing text
- Colored section dividers
- Small tag shapes in the skills area

The SVG should be ~300x400px viewport, clean and recognizable at small sizes.

- [ ] **Step 3: Create SVG thumbnail for Classic template**

Create `public/thumbnails/classic.svg` — a simplified visual representation:
- Centered header area
- Underlined section titles
- Conservative colors (dark navy #1e3a5f)
- Traditional single-column feel

- [ ] **Step 4: Update atoms.ts with default themes from templates**

```ts
// In atoms.ts, import and use template defaults
import { templateRegistry } from '../templates/registry'

const defaultThemes: Record<string, object> = {}
for (const t of templateRegistry) {
  defaultThemes[t.key] = t.defaultTheme
}

export const templateThemesAtom = atomWithStorage<Record<string, object>>(
  'template-themes',
  defaultThemes
)
```

- [ ] **Step 5: Commit**

```bash
git add src/templates/registry.ts public/thumbnails/ src/state/atoms.ts
git commit -m "feat: register templates and add SVG thumbnails"
```

---

## Chunk 4: App Layout & Preview

### Task 10: Build the split-pane layout

**Files:**
- Create: `src/components/SplitPane.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SplitPane component**

A responsive two-column layout:
- Desktop: side-by-side (editor left, preview right)
- Mobile: stacked with view toggle (controlled by `activeViewAtom`)
- Use Tailwind responsive classes (`md:flex-row`, etc.)

```tsx
// src/components/SplitPane.tsx
import { useAtom } from 'jotai'
import { activeViewAtom } from '../state/atoms'
import type { ReactNode } from 'react'

interface SplitPaneProps {
  editor: ReactNode
  preview: ReactNode
}

export function SplitPane({ editor, preview }: SplitPaneProps) {
  const [activeView] = useAtom(activeViewAtom)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Editor */}
      <div
        className={`w-full md:w-1/2 overflow-y-auto border-r border-gray-200 bg-white ${
          activeView === 'preview' ? 'hidden md:block' : ''
        }`}
      >
        {editor}
      </div>

      {/* Preview */}
      <div
        className={`w-full md:w-1/2 overflow-y-auto bg-gray-100 ${
          activeView === 'editor' ? 'hidden md:block' : ''
        }`}
      >
        {preview}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire up App.tsx with layout**

```tsx
// src/App.tsx
import { SplitPane } from './components/SplitPane'

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar placeholder */}
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4">
        <h1 className="text-lg font-bold">Bewerbungsmappe</h1>
      </header>

      <SplitPane
        editor={<div className="p-4">Editor coming soon...</div>}
        preview={<div className="p-4">Preview coming soon...</div>}
      />
    </div>
  )
}

export default App
```

- [ ] **Step 3: Verify layout renders correctly**

```bash
npm run dev
```

Expected: Two-column layout on desktop, app fills viewport height.

- [ ] **Step 4: Commit**

```bash
git add src/components/SplitPane.tsx src/App.tsx
git commit -m "feat: add split-pane layout with responsive editor/preview"
```

---

### Task 11: Build the PDF preview component

**Files:**
- Create: `src/components/Preview.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Preview component**

Uses `@react-pdf/renderer`'s `<Document>` and `<PDFViewer>` (or `<BlobProvider>` for custom rendering). `PDFViewer` renders an iframe with the PDF — simplest approach.

```tsx
// src/components/Preview.tsx
import { useMemo } from 'react'
import { Document, PDFViewer } from '@react-pdf/renderer'
import { useAtomValue } from 'jotai'
import { cvDataAtom, activeTemplateKeyAtom, activeThemeAtom } from '../state/atoms'
import { getTemplate } from '../templates/registry'

export function Preview() {
  const data = useAtomValue(cvDataAtom)
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const template = getTemplate(templateKey)

  const pdfDocument = useMemo(() => {
    if (!template) return null

    const CvPage = template.cv
    const CoverLetterPage = template.coverLetter
    const CoverPagePage = template.coverPage

    return (
      <Document>
        {data.coverPage && <CoverPagePage data={data} theme={theme} />}
        {data.coverLetter && <CoverLetterPage data={data} theme={theme} />}
        <CvPage data={data} theme={theme} />
      </Document>
    )
  }, [data, template, theme])

  if (!pdfDocument) {
    return <div className="p-4 text-gray-500">Kein Template ausgewählt</div>
  }

  return (
    <PDFViewer className="w-full h-full" showToolbar={false}>
      {pdfDocument}
    </PDFViewer>
  )
}
```

- [ ] **Step 2: Wire Preview into App.tsx**

Replace the preview placeholder:

```tsx
import { Preview } from './components/Preview'

// In SplitPane:
<SplitPane
  editor={<div className="p-4">Editor coming soon...</div>}
  preview={<Preview />}
/>
```

- [ ] **Step 3: Verify PDF preview renders**

```bash
npm run dev
```

Expected: PDF viewer shows in right pane with the default (empty) CV template.

- [ ] **Step 4: Commit**

```bash
git add src/components/Preview.tsx src/App.tsx
git commit -m "feat: add live PDF preview with template rendering"
```

---

## Chunk 5: Editor Panels

### Task 12: Shared components (CollapsiblePanel, PhotoUpload, SortableList)

**Files:**
- Create: `src/components/shared/CollapsiblePanel.tsx`
- Create: `src/components/shared/PhotoUpload.tsx`
- Create: `src/components/shared/SortableList.tsx`

- [ ] **Step 1: Create CollapsiblePanel**

A simple accordion-style panel with a title and toggle:

```tsx
// src/components/shared/CollapsiblePanel.tsx
import { useState, type ReactNode } from 'react'

interface CollapsiblePanelProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  children,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 2: Create PhotoUpload**

Handles file → base64 conversion:

```tsx
// src/components/shared/PhotoUpload.tsx
interface PhotoUploadProps {
  value?: string
  onChange: (base64: string | undefined) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <img
          src={value}
          alt="Foto"
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div className="flex gap-2">
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          {value ? 'Ändern' : 'Foto hochladen'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {value && (
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={() => onChange(undefined)}
          >
            Entfernen
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create SortableList**

A generic list with add, remove, and move up/down:

```tsx
// src/components/shared/SortableList.tsx
import type { ReactNode } from 'react'

interface SortableListProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
  createItem: () => T
  addLabel?: string
}

export function SortableList<T extends { id: string }>({
  items,
  onChange,
  renderItem,
  createItem,
  addLabel = 'Hinzufügen',
}: SortableListProps<T>) {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...items]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="relative border border-gray-200 rounded-lg p-3">
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              className="text-gray-400 hover:text-gray-600 text-xs px-1"
              onClick={() => move(i, -1)}
              disabled={i === 0}
            >
              ↑
            </button>
            <button
              className="text-gray-400 hover:text-gray-600 text-xs px-1"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
            >
              ↓
            </button>
            <button
              className="text-red-400 hover:text-red-600 text-xs px-1"
              onClick={() => remove(i)}
            >
              ✕
            </button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
      <button
        className="text-sm text-blue-600 hover:underline"
        onClick={() => onChange([...items, createItem()])}
      >
        + {addLabel}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add shared components (CollapsiblePanel, PhotoUpload, SortableList)"
```

---

### Task 13: Profile editor section

**Files:**
- Create: `src/components/editor/ProfileSection.tsx`

- [ ] **Step 1: Create ProfileSection**

Form fields for profile data, using two-way binding to the `cvDataAtom`:

```tsx
// src/components/editor/ProfileSection.tsx
import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { PhotoUpload } from '../shared/PhotoUpload'

export function ProfileSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { profile } = data

  const update = (field: string, value: string | undefined) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }))
  }

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <CollapsiblePanel title="Profil">
      <div className="space-y-3">
        <PhotoUpload
          value={profile.photo}
          onChange={(v) => update('photo', v)}
        />
        <input
          className={inputClass}
          placeholder="Name"
          value={profile.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Titel / Berufsbezeichnung"
          value={profile.title}
          onChange={(e) => update('title', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="E-Mail"
          type="email"
          value={profile.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Telefon"
          value={profile.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Adresse (optional)"
          value={profile.address ?? ''}
          onChange={(e) => update('address', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Website (optional)"
          value={profile.website ?? ''}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>
    </CollapsiblePanel>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/editor/ProfileSection.tsx
git commit -m "feat: add profile editor section"
```

---

### Task 14: Experience + Education editor sections

**Files:**
- Create: `src/components/editor/ExperienceSection.tsx`
- Create: `src/components/editor/EducationSection.tsx`

- [ ] **Step 1: Create ExperienceSection**

Uses `SortableList` with `Experience` items. Each item has inputs for company, role, period, description. Generates unique IDs with `crypto.randomUUID()`.

The `renderItem` callback renders 4 inputs + a textarea for description. The `createItem` callback returns a new `Experience` with empty strings and a fresh `id`.

- [ ] **Step 2: Create EducationSection**

Same pattern as ExperienceSection but for `Education` items: institution, degree, period, optional description.

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/ExperienceSection.tsx src/components/editor/EducationSection.tsx
git commit -m "feat: add experience and education editor sections"
```

---

### Task 15: Skills, Cover Letter, Cover Page editor sections

**Files:**
- Create: `src/components/editor/SkillsSection.tsx`
- Create: `src/components/editor/CoverLetterSection.tsx`
- Create: `src/components/editor/CoverPageSection.tsx`

- [ ] **Step 1: Create SkillsSection**

Uses `SortableList` but with simpler items: label input + level dropdown (`<select>` with beginner/intermediate/advanced/expert options).

- [ ] **Step 2: Create CoverLetterSection**

Form with: recipient, recipientAddress (optional), subject (optional), date, body (textarea). Wrapped in `CollapsiblePanel`. Has an "Enable Cover Letter" toggle that creates/removes the `coverLetter` object from CvData.

- [ ] **Step 3: Create CoverPageSection**

Form with: company, position, date. Same toggle pattern as CoverLetterSection.

- [ ] **Step 4: Commit**

```bash
git add src/components/editor/SkillsSection.tsx src/components/editor/CoverLetterSection.tsx src/components/editor/CoverPageSection.tsx
git commit -m "feat: add skills, cover letter, and cover page editor sections"
```

---

### Task 16: EditorPanel container + wire into App

**Files:**
- Create: `src/components/editor/EditorPanel.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create EditorPanel**

Composes all sections:

```tsx
// src/components/editor/EditorPanel.tsx
import { ProfileSection } from './ProfileSection'
import { ExperienceSection } from './ExperienceSection'
import { EducationSection } from './EducationSection'
import { SkillsSection } from './SkillsSection'
import { CoverLetterSection } from './CoverLetterSection'
import { CoverPageSection } from './CoverPageSection'

export function EditorPanel() {
  return (
    <div>
      <ProfileSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <CoverLetterSection />
      <CoverPageSection />
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx**

```tsx
import { EditorPanel } from './components/editor/EditorPanel'
import { Preview } from './components/Preview'

// Replace the editor placeholder:
<SplitPane
  editor={<EditorPanel />}
  preview={<Preview />}
/>
```

- [ ] **Step 3: Verify the full editor + preview flow**

```bash
npm run dev
```

Expected: Fill in profile fields → see them appear in the PDF preview in real time.

- [ ] **Step 4: Commit**

```bash
git add src/components/editor/EditorPanel.tsx src/App.tsx
git commit -m "feat: wire up editor panel with all sections and live preview"
```

---

## Chunk 6: Toolbar, Theme Editor & Export

### Task 17: Toolbar component

**Files:**
- Create: `src/components/Toolbar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Toolbar**

Contains:
- Template picker: dropdown or thumbnail buttons showing available templates from registry
- Theme button: toggles theme editor panel
- Export dropdown: PDF export with scope selection (All, CV only, Cover Letter only, Cover Page only)
- Save/Load: JSON export and import buttons
- Mobile: view toggle button (Editor / Preview)

```tsx
// src/components/Toolbar.tsx
import { useAtom, useAtomValue } from 'jotai'
import { activeTemplateKeyAtom, activeViewAtom } from '../state/atoms'
import { templateRegistry } from '../templates/registry'

interface ToolbarProps {
  onExportPdf: (scope: string) => void
  onExportJson: () => void
  onImportJson: () => void
  onToggleTheme: () => void
}

export function Toolbar({
  onExportPdf,
  onExportJson,
  onImportJson,
  onToggleTheme,
}: ToolbarProps) {
  const [templateKey, setTemplateKey] = useAtom(activeTemplateKeyAtom)
  const [activeView, setActiveView] = useAtom(activeViewAtom)

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-3 shrink-0">
      <h1 className="text-lg font-bold mr-4">Bewerbungsmappe</h1>

      {/* Template picker */}
      <select
        className="border rounded px-2 py-1 text-sm"
        value={templateKey}
        onChange={(e) => setTemplateKey(e.target.value)}
      >
        {templateRegistry.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>

      <button
        className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
        onClick={onToggleTheme}
      >
        Theme
      </button>

      {/* Export PDF dropdown */}
      <select
        className="border rounded px-2 py-1 text-sm"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) onExportPdf(e.target.value)
          e.target.value = ''
        }}
      >
        <option value="" disabled>
          PDF Export ▾
        </option>
        <option value="all">Alles</option>
        <option value="cv">Nur Lebenslauf</option>
        <option value="coverLetter">Nur Anschreiben</option>
        <option value="coverPage">Nur Deckblatt</option>
      </select>

      <button
        className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
        onClick={onExportJson}
      >
        Speichern
      </button>
      <button
        className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
        onClick={onImportJson}
      >
        Laden
      </button>

      {/* Mobile view toggle */}
      <button
        className="md:hidden ml-auto text-sm px-3 py-1 border rounded"
        onClick={() =>
          setActiveView((v) => (v === 'editor' ? 'preview' : 'editor'))
        }
      >
        {activeView === 'editor' ? 'Vorschau' : 'Editor'}
      </button>
    </header>
  )
}
```

- [ ] **Step 2: Wire Toolbar into App.tsx**

Replace the header placeholder with `<Toolbar>`, passing handler stubs initially.

- [ ] **Step 3: Commit**

```bash
git add src/components/Toolbar.tsx src/App.tsx
git commit -m "feat: add toolbar with template picker, export, and save/load"
```

---

### Task 18: Theme Editor

**Files:**
- Create: `src/components/theme/ThemeEditor.tsx`
- Create: `src/components/theme/FontManager.tsx`

- [ ] **Step 1: Create ThemeEditor**

Uses the `themeSchema` already defined on each `TemplateConfig` (added in Tasks 6, 8, 9) to dynamically render controls. Reads `activeThemeAtom` and writes back on change.

```tsx
// src/components/theme/ThemeEditor.tsx
import { useAtom, useAtomValue } from 'jotai'
import { activeTemplateKeyAtom, activeThemeAtom } from '../../state/atoms'
import { getTemplate } from '../../templates/registry'

export function ThemeEditor() {
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const [theme, setTheme] = useAtom(activeThemeAtom)
  const template = getTemplate(templateKey)

  if (!template) return null

  const updateField = (key: string, value: string) => {
    setTheme({ ...theme, [key]: value })
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex flex-wrap gap-4 items-end">
        {template.themeSchema.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              {field.label}
            </label>
            {field.type === 'color' ? (
              <input
                type="color"
                value={(theme as Record<string, string>)[field.key] ?? '#000000'}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
              />
            ) : (
              <select
                value={(theme as Record<string, string>)[field.key] ?? ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FontManager**

Simple form to add a Google Font: input for font family name, "Add" button. Calls `registerGoogleFont()` and adds to `customFontsAtom`. Shows list of registered custom fonts with remove option. Registered fonts become available in template theme font selectors.

- [ ] **Step 3: Commit**

```bash
git add src/components/theme/
git commit -m "feat: add dynamic theme editor with font manager"
```

---

### Task 19: PDF Export service

**Files:**
- Create: `src/services/export-pdf.ts`

- [ ] **Step 1: Create export-pdf service**

```ts
// src/services/export-pdf.ts
import { pdf, Document } from '@react-pdf/renderer'
import type { CvData, ExportScope } from '../types/cv'
import type { TemplateConfig } from '../templates/registry'
import { createElement } from 'react'

export async function exportPdf(
  data: CvData,
  template: TemplateConfig,
  theme: object,
  scope: ExportScope
): Promise<void> {
  const pages: React.ReactElement[] = []

  if ((scope === 'all' || scope === 'coverPage') && data.coverPage) {
    pages.push(createElement(template.coverPage, { data, theme, key: 'cp' }))
  }

  if ((scope === 'all' || scope === 'coverLetter') && data.coverLetter) {
    pages.push(createElement(template.coverLetter, { data, theme, key: 'cl' }))
  }

  if (scope === 'all' || scope === 'cv') {
    pages.push(createElement(template.cv, { data, theme, key: 'cv' }))
  }

  if (pages.length === 0) return

  const doc = createElement(Document, {}, ...pages)
  const blob = await pdf(doc).toBlob()

  // Trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bewerbung-${scope}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/export-pdf.ts
git commit -m "feat: add PDF export service with scope selection"
```

---

### Task 20: JSON Export/Import service

**Files:**
- Create: `src/services/export-json.ts`

- [ ] **Step 1: Create export-json service**

```ts
// src/services/export-json.ts
import type { CvData } from '../types/cv'

interface SaveData {
  cvData: CvData
  activeTemplate: string
  templateThemes: Record<string, object>
}

export function exportJson(data: SaveData): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bewerbung-daten.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importJson(): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return reject(new Error('No file selected'))

      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as SaveData
          resolve(data)
        } catch {
          reject(new Error('Invalid JSON file'))
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })
}
```

- [ ] **Step 2: Wire export/import into App.tsx toolbar handlers**

App.tsx needs to import and use atoms to provide the handler values. Here's the full updated App component:

```tsx
// src/App.tsx
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import {
  cvDataAtom,
  activeTemplateKeyAtom,
  activeThemeAtom,
  templateThemesAtom,
} from './state/atoms'
import { getTemplate } from './templates/registry'
import { SplitPane } from './components/SplitPane'
import { Toolbar } from './components/Toolbar'
import { EditorPanel } from './components/editor/EditorPanel'
import { Preview } from './components/Preview'
import { ThemeEditor } from './components/theme/ThemeEditor'
import { exportPdf } from './services/export-pdf'
import { exportJson, importJson } from './services/export-json'
import type { ExportScope } from './types/cv'

function App() {
  const [data, setData] = useAtom(cvDataAtom)
  const [templateKey, setTemplateKey] = useAtom(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const [, setThemes] = useAtom(templateThemesAtom)
  const [showTheme, setShowTheme] = useState(false)

  const handleExportPdf = async (scope: string) => {
    const template = getTemplate(templateKey)
    if (template) {
      await exportPdf(data, template, theme, scope as ExportScope)
    }
  }

  const handleExportJson = () => {
    exportJson({
      cvData: data,
      activeTemplate: templateKey,
      templateThemes: /* get current themes */ {},
    })
  }

  const handleImportJson = async () => {
    try {
      const imported = await importJson()
      setData(imported.cvData)
      setTemplateKey(imported.activeTemplate)
      setThemes(imported.templateThemes)
    } catch (e) {
      console.error('Import failed:', e)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        onExportPdf={handleExportPdf}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onToggleTheme={() => setShowTheme((v) => !v)}
      />
      {showTheme && <ThemeEditor />}
      <SplitPane
        editor={<EditorPanel />}
        preview={<Preview />}
      />
    </div>
  )
}

export default App
```

Note: For `handleExportJson`, the themes need to come from `templateThemesAtom`. Use `useAtomValue(templateThemesAtom)` to read current themes for the export payload.

- [ ] **Step 3: Commit**

```bash
git add src/services/export-json.ts src/App.tsx
git commit -m "feat: add JSON export/import and wire toolbar handlers"
```

---

## Chunk 7: Polish & Deployment

### Task 21: End-to-end manual testing and bug fixes

- [ ] **Step 1: Test the full flow**

1. Start dev server: `npm run dev`
2. Fill in all profile fields — verify they appear in PDF preview
3. Add 3 experience entries — verify order, move up/down, delete works
4. Add 2 education entries
5. Add 5 skills with various levels
6. Enable cover letter — fill in fields — verify PDF shows cover letter page
7. Enable cover page — verify PDF shows all three document types
8. Switch template (Modern → Classic) — verify preview updates
9. Change theme colors — verify PDF reflects changes
10. Switch back to Modern — verify previous theme settings are preserved
11. Export PDF (all scopes) — open and verify each
12. Export JSON — verify file downloads
13. Clear localStorage, import JSON — verify all data restored
14. Test on mobile viewport — verify view toggle works

- [ ] **Step 2: Fix any bugs found**

- [ ] **Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: address issues found during end-to-end testing"
```

---

### Task 22: GitHub Pages deployment setup

**Files:**
- Create: `.github/workflows/deploy.yml`

Note: We use the modern GitHub Pages deployment via Actions artifacts (not the `gh-pages` npm package). This is simpler and doesn't require a separate branch.

- [ ] **Step 1: Create GitHub Actions workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify build works**

```bash
npm run build
```

Expected: `dist/` directory created with all assets.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml package.json
git commit -m "chore: add GitHub Pages deployment workflow"
```

---

## Summary

| Chunk | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Scaffolding & Types | 1–4 | Working Vite project, all types, atoms, template registry shell |
| 2: Font System | 5 | Bundled fonts + Google Fonts runtime registration |
| 3: Templates | 6–9 | Modern + Classic templates (CV, cover letter, cover page), SVG thumbnails |
| 4: Layout & Preview | 10–11 | Split-pane layout, live PDF preview |
| 5: Editor Panels | 12–16 | All 6 editor sections, shared components, full editor ↔ preview flow |
| 6: Toolbar & Export | 17–20 | Toolbar, theme editor, font manager, PDF export, JSON save/load |
| 7: Polish & Deploy | 21–22 | E2E testing, bug fixes, GitHub Pages deployment |

**Total: 22 tasks across 7 chunks.**
