# UI Restructure Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure littlecv from a toolbar-driven split-pane layout to a tab-based, mobile-first, native-app-like experience with shadcn/ui (Base UI variant) components.

**Architecture:** Replace the current Toolbar + SplitPane layout with a slim header + tabbed interface. Desktop shows a left panel (Editor/Style tabs) + persistent preview. Mobile shows bottom tab bar (Editor/Style/Preview). All custom UI primitives become shadcn/ui components.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Jotai, shadcn/ui (Base UI variant), Embla Carousel, @react-pdf/renderer

**Spec:** `docs/superpowers/specs/2026-03-11-ui-restructure-design.md`

---

## Chunk 1: shadcn/ui Foundation

### Task 1: Install and configure shadcn/ui with Base UI

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.app.json`
- Create: `src/lib/utils.ts`
- Create: `components.json`

- [ ] **Step 1: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init
```

When prompted:
- Style: **New York**
- Base color: **Neutral**
- CSS variables: **yes**
- When asked about the component library/primitives, select **Base UI** (not Radix). This installs `@base-ui-components/react` as the underlying primitive layer.

This creates `components.json` and `src/lib/utils.ts` (with `cn()` helper).

- [ ] **Step 2: Verify path alias configuration**

After `shadcn init`, verify that the `@/` import alias is properly configured. Check:

1. `tsconfig.app.json` should have:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

2. `vite.config.ts` should have the matching resolve alias:
```typescript
import path from 'path'
// ...
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

If `shadcn init` did not add these, add them manually. All subsequent imports in this plan use the `@/` alias (e.g., `@/components/ui/button`).

- [ ] **Step 3: Verify Tailwind CSS v4 compatibility**

shadcn/ui v2+ supports Tailwind v4. Verify that `src/index.css` still works — it should now have shadcn's CSS variable definitions appended to the existing `@import "tailwindcss"`.

Run:
```bash
npm run dev
```

Expected: App loads without CSS errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: initialize shadcn/ui with Base UI variant"
```

### Task 2: Add core shadcn/ui components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/tabs.tsx`
- Create: `src/components/ui/collapsible.tsx`
- Create: `src/components/ui/dropdown-menu.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/label.tsx`

- [ ] **Step 1: Add all needed shadcn components**

Run each:
```bash
npx shadcn@latest add button input textarea select tabs collapsible dropdown-menu card sheet label
```

This generates component files in `src/components/ui/`.

- [ ] **Step 2: Verify components installed**

Check that all files exist in `src/components/ui/` and that the app still builds:
```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ package.json package-lock.json
git commit -m "chore: add shadcn/ui components (button, input, textarea, select, tabs, collapsible, dropdown-menu, card, sheet, label)"
```

### Task 3: Migrate ProfileSection to shadcn/ui

**Files:**
- Modify: `src/components/editor/ProfileSection.tsx`

- [ ] **Step 1: Replace native inputs with shadcn components**

Replace all `<input>` elements with shadcn `<Input>`, `<textarea>` with `<Textarea>`, and wrap each field with `<Label>`. Import from `@/components/ui/input`, `@/components/ui/textarea`, `@/components/ui/label`.

The current ProfileSection uses native HTML inputs with Tailwind classes like `className="w-full border rounded px-2 py-1 text-sm"`. Replace each with the shadcn equivalent which has its own styling.

- [ ] **Step 2: Verify the form renders correctly**

Run: `npm run dev`

Navigate to the Editor panel. Verify all profile fields (name, title, email, phone, address, website) render with shadcn styling and remain functional (typing updates state).

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/ProfileSection.tsx
git commit -m "refactor: migrate ProfileSection to shadcn/ui inputs"
```

### Task 4: Migrate SectionsEditor to shadcn/ui

**Files:**
- Modify: `src/components/editor/SectionsEditor.tsx`

- [ ] **Step 1: Replace native inputs with shadcn components**

Replace all `<input>` with `<Input>`, `<textarea>` with `<Textarea>`, `<button>` with `<Button>`. The SectionsEditor has:
- Text inputs for section name, entry title, subtitle, period
- Textarea for entry description
- Buttons for add section, add entry, remove

Import Button from `@/components/ui/button`, Input from `@/components/ui/input`, Textarea from `@/components/ui/textarea`.

- [ ] **Step 2: Verify sections editor works**

Run: `npm run dev`

Test: add a section, add entries, edit fields, reorder entries, remove entries. All should work with shadcn styling.

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/SectionsEditor.tsx
git commit -m "refactor: migrate SectionsEditor to shadcn/ui components"
```

### Task 5: Migrate SkillsSection to shadcn/ui

**Files:**
- Modify: `src/components/editor/SkillsSection.tsx`

- [ ] **Step 1: Replace native inputs and buttons**

Replace `<input>` with `<Input>`, `<select>` with shadcn `<Select>` (for skill level), `<button>` with `<Button>`.

- [ ] **Step 2: Verify skills section works**

Run: `npm run dev`

Test: add skills, edit label, change level, remove skills.

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/SkillsSection.tsx
git commit -m "refactor: migrate SkillsSection to shadcn/ui components"
```

### Task 6: Migrate CoverLetterSection to shadcn/ui

**Files:**
- Modify: `src/components/editor/CoverLetterSection.tsx`

- [ ] **Step 1: Replace native inputs**

Replace all `<input>` with `<Input>`, `<textarea>` with `<Textarea>`, `<button>` with `<Button>`. The cover letter section has fields for recipient, recipientAddress, subject, date, body.

- [ ] **Step 2: Verify cover letter form works**

Run: `npm run dev`

Test: toggle cover letter on, fill all fields, verify data persists.

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/CoverLetterSection.tsx
git commit -m "refactor: migrate CoverLetterSection to shadcn/ui components"
```

### Task 7: Migrate CoverPageSection to shadcn/ui

**Files:**
- Modify: `src/components/editor/CoverPageSection.tsx`

- [ ] **Step 1: Replace native inputs**

Replace `<input>` with `<Input>`, `<button>` with `<Button>`. Fields: company, position, date.

- [ ] **Step 2: Verify cover page form works**

Run: `npm run dev`

Test: toggle cover page on, fill fields, verify data persists.

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/CoverPageSection.tsx
git commit -m "refactor: migrate CoverPageSection to shadcn/ui components"
```

### Task 8: Migrate CollapsiblePanel to shadcn/ui Collapsible

**Files:**
- Modify: `src/components/shared/CollapsiblePanel.tsx`

- [ ] **Step 1: Replace custom collapsible with shadcn Collapsible**

The current CollapsiblePanel uses manual state + conditional rendering. Replace with shadcn's `<Collapsible>`, `<CollapsibleTrigger>`, `<CollapsibleContent>`. Keep the `actions` prop support and the existing expand/collapse icon toggle.

Import from `@/components/ui/collapsible`.

- [ ] **Step 2: Verify all accordion sections work**

Run: `npm run dev`

Test: click each section header to expand/collapse. Verify actions buttons still appear in headers that have them.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/CollapsiblePanel.tsx
git commit -m "refactor: migrate CollapsiblePanel to shadcn/ui Collapsible"
```

### Task 9: Migrate SortableList buttons to shadcn/ui

**Files:**
- Modify: `src/components/shared/SortableList.tsx`

- [ ] **Step 1: Replace native buttons**

Replace `<button>` elements (move up, move down, remove) with shadcn `<Button variant="ghost" size="icon">`.

- [ ] **Step 2: Verify sortable list works**

Run: `npm run dev`

Test: reorder items, remove items in SectionsEditor.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/SortableList.tsx
git commit -m "refactor: migrate SortableList buttons to shadcn/ui"
```

### Task 10: Migrate PhotoUpload to shadcn/ui

**Files:**
- Modify: `src/components/shared/PhotoUpload.tsx`

- [ ] **Step 1: Replace native inputs and buttons**

Replace the file input styling and buttons with shadcn `<Button>` and `<Input type="file">`. The zoom slider can remain native or use a shadcn Slider if available.

- [ ] **Step 2: Verify photo upload and crop works**

Run: `npm run dev`

Test: upload a photo, crop it, adjust zoom, save crop.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/PhotoUpload.tsx
git commit -m "refactor: migrate PhotoUpload to shadcn/ui components"
```

---

## Chunk 2: Layout Restructure

### Task 11: Update state types and atoms

**Files:**
- Modify: `src/types/cv.ts`
- Modify: `src/state/atoms.ts`

- [ ] **Step 1: Expand ActiveView type**

In `src/types/cv.ts`, change:
```typescript
export type ActiveView = 'editor' | 'preview'
```
to:
```typescript
export type ActiveView = 'editor' | 'style' | 'preview'
```

- [ ] **Step 2: Add favoriteTemplatesAtom**

In `src/state/atoms.ts`, add:
```typescript
export const favoriteTemplatesAtom = atomWithStorage<string[]>('favorite-templates', [])
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/cv.ts src/state/atoms.ts
git commit -m "feat: expand ActiveView type, add favoriteTemplatesAtom"
```

### Task 12: Create Header component (replaces Toolbar)

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Create slim Header component**

Create `src/components/Header.tsx` with:
- App name/logo on the left
- Export PDF dropdown (using shadcn DropdownMenu) on the right — same 4 scope options as current Toolbar
- JSON Save/Load buttons (inside the dropdown on mobile, visible on desktop)
- No template selector, no theme toggle, no mobile view toggle

```typescript
// Rough structure:
// <header className="h-14 border-b flex items-center justify-between px-4">
//   <span className="font-semibold text-lg">Bewerbungsmappe</span>
//   <div className="flex items-center gap-2">
//     <DropdownMenu> ... export options + save/load ... </DropdownMenu>
//   </div>
// </header>
```

Use shadcn `<Button>`, `<DropdownMenu>`, `<DropdownMenuTrigger>`, `<DropdownMenuContent>`, `<DropdownMenuItem>`.

The export handlers currently live in `App.tsx` as `handleExportPdf`, `handleExportJson`, and `handleImportJson`. Pass them as props to Header (e.g., `onExportPdf`, `onExportJson`, `onImportJson`).

- [ ] **Step 2: Verify Header renders**

Temporarily render Header in App.tsx alongside existing Toolbar to verify it looks correct.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: create slim Header component with export dropdown"
```

### Task 13: Create BottomTabBar component

**Files:**
- Create: `src/components/BottomTabBar.tsx`

- [ ] **Step 1: Create BottomTabBar component**

Create `src/components/BottomTabBar.tsx`:
- Three tabs: Editor, Style, Preview
- Each tab is a button that sets `activeViewAtom`
- Active tab is visually highlighted
- Fixed to bottom of screen
- Only visible on mobile (`md:hidden`)

```typescript
// Structure:
// <nav className="fixed bottom-0 left-0 right-0 h-14 border-t bg-background flex md:hidden">
//   <button onClick={() => setView('editor')} className={active === 'editor' ? 'text-primary' : ''}>
//     Editor
//   </button>
//   <button onClick={() => setView('style')} className={active === 'style' ? 'text-primary' : ''}>
//     Style
//   </button>
//   <button onClick={() => setView('preview')} className={active === 'preview' ? 'text-primary' : ''}>
//     Preview
//   </button>
// </nav>
```

Use appropriate icons (e.g., inline SVG or simple text labels). Use shadcn Button variant="ghost" for each tab.

- [ ] **Step 2: Commit**

```bash
git add src/components/BottomTabBar.tsx
git commit -m "feat: create BottomTabBar component for mobile navigation"
```

### Task 14: Create MainLayout component

**Files:**
- Create: `src/components/MainLayout.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create MainLayout component**

Create `src/components/MainLayout.tsx` that replaces SplitPane with the new layout logic:

**Desktop (md+):**
- Left panel with shadcn `<Tabs>` component: "Editor" and "Style" tabs
- Editor tab shows `<EditorPanel />`
- Style tab shows `<StylePanel />` (placeholder for now, will be built in Chunk 3)
- Right panel shows `<Preview />`
- Both panels side by side (`md:flex`)

**Mobile (<md):**
- Full-width content driven by `activeViewAtom`
- `'editor'` → `<EditorPanel />`
- `'style'` → `<StylePanel />`
- `'preview'` → `<Preview />`
- Bottom padding to account for BottomTabBar (`pb-14`)

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAtom } from 'jotai'
import { activeViewAtom } from '../state/atoms'
import { EditorPanel } from './editor/EditorPanel'
import { Preview } from './Preview'

export function MainLayout() {
  const [activeView, setActiveView] = useAtom(activeViewAtom)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-1">
        <div className="w-1/2 overflow-y-auto border-r">
          <Tabs defaultValue="editor">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <EditorPanel />
            </TabsContent>
            <TabsContent value="style">
              {/* StylePanel placeholder */}
              <div>Style panel coming soon</div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/2 overflow-y-auto">
          <Preview />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex-1 md:hidden pb-14 overflow-y-auto">
        {activeView === 'editor' && <EditorPanel />}
        {activeView === 'style' && <div>Style panel coming soon</div>}
        {activeView === 'preview' && <Preview />}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire up App.tsx**

Modify `src/App.tsx`:
- Replace `<Toolbar>` import and usage with `<Header>`
- Remove the `const [showTheme, setShowTheme] = useState(false)` state variable and the `onToggleTheme` callback
- Remove the conditional `{showTheme && (<ThemeEditor />...<FontManager />...)}` block (these now live in StylePanel)
- Replace `<SplitPane>` with `<MainLayout>`
- Add `<BottomTabBar />` at the end

The export handlers stay in App.tsx and get passed to Header.

```typescript
export default function App() {
  // ... existing export handlers ...

  return (
    <div className="flex flex-col h-screen">
      <Header onExportPdf={handleExportPdf} onExportJson={handleExportJson} onImportJson={handleImportJson} />
      <MainLayout />
      <BottomTabBar />
    </div>
  )
}
```

- [ ] **Step 3: Verify layout works**

Run: `npm run dev`

Test on desktop: left panel with Editor/Style tabs visible, preview on right.
Test with browser dev tools mobile viewport: bottom tab bar visible, switching between tabs works.

- [ ] **Step 4: Commit**

```bash
git add src/components/MainLayout.tsx src/App.tsx
git commit -m "feat: replace SplitPane with MainLayout (tabbed left panel + bottom tab bar)"
```

### Task 15: Remove old layout components

**Files:**
- Delete: `src/components/Toolbar.tsx`
- Delete: `src/components/SplitPane.tsx`

- [ ] **Step 1: Remove old components**

Delete `Toolbar.tsx` and `SplitPane.tsx`. They are fully replaced by Header, MainLayout, and BottomTabBar.

- [ ] **Step 2: Clean up imports**

Search for any remaining imports of Toolbar or SplitPane and remove them.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: No import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove old Toolbar and SplitPane components"
```

---

## Chunk 3: Style Tab (Template Carousel + Theme Controls)

### Task 16: Install Embla Carousel

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install embla-carousel-react**

```bash
npm install embla-carousel-react
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install embla-carousel-react"
```

### Task 17: Create TemplateCarousel component

**Files:**
- Create: `src/components/style/TemplateCarousel.tsx`

- [ ] **Step 1: Create TemplateCarousel**

Create `src/components/style/TemplateCarousel.tsx`:
- Uses `embla-carousel-react` for swipeable carousel
- Each slide shows the template's SVG thumbnail via `t.thumbnail` from the registry (resolves to e.g. `/thumbnails/modern.svg` at runtime — Vite serves `/public/` as root) with the template name overlaid
- Currently selected template is highlighted (border/ring)
- Tapping a slide selects that template (sets `activeTemplateKeyAtom`)
- Heart icon button on each slide to toggle favorite (reads/writes `favoriteTemplatesAtom`)
- Filter toggle at the top: "All" / "Favorites"

```typescript
import useEmblaCarousel from 'embla-carousel-react'
import { useAtom } from 'jotai'
import { activeTemplateKeyAtom, favoriteTemplatesAtom } from '../../state/atoms'
import { templateRegistry } from '../../templates/registry'
import { Button } from '../ui/button'
import { useState } from 'react'

export function TemplateCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: false })
  const [activeKey, setActiveKey] = useAtom(activeTemplateKeyAtom)
  const [favorites, setFavorites] = useAtom(favoriteTemplatesAtom)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const templates = showFavoritesOnly
    ? templateRegistry.filter(t => favorites.includes(t.key))
    : templateRegistry

  const toggleFavorite = (key: string) => {
    setFavorites(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  return (
    <div>
      {/* Filter toggle */}
      <div className="flex gap-2 p-4">
        <Button
          variant={showFavoritesOnly ? 'outline' : 'default'}
          size="sm"
          onClick={() => setShowFavoritesOnly(false)}
        >Alle</Button>
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFavoritesOnly(true)}
        >Favoriten</Button>
      </div>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {templates.map(t => (
            <div key={t.key} className="flex-[0_0_80%] min-w-0 px-2">
              <div
                onClick={() => setActiveKey(t.key)}
                className={`relative cursor-pointer rounded-lg border-2 p-2 ${
                  activeKey === t.key ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                <img src={t.thumbnail} alt={t.label} className="w-full" />
                <div className="absolute bottom-4 left-4 bg-background/80 px-2 py-1 rounded text-sm font-medium">
                  {t.label}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(t.key) }}
                >
                  {favorites.includes(t.key) ? '♥' : '♡'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify carousel renders**

Temporarily render `<TemplateCarousel />` in the Style tab placeholder in MainLayout.

Run: `npm run dev`

Test: swipe through templates, tap to select, tap heart to favorite, filter toggle works.

- [ ] **Step 3: Commit**

```bash
git add src/components/style/TemplateCarousel.tsx
git commit -m "feat: create TemplateCarousel with swipe, favorites, and filter"
```

### Task 18: Migrate ThemeEditor into Style tab

**Files:**
- Create: `src/components/style/StylePanel.tsx`
- Modify: `src/components/theme/ThemeEditor.tsx`
- Modify: `src/components/theme/FontManager.tsx`

- [ ] **Step 1: Migrate ThemeEditor to use shadcn components**

Update `src/components/theme/ThemeEditor.tsx`:
- Replace native `<input type="color">` with shadcn `<Input type="color">`
- Replace native `<select>` with shadcn `<Select>`
- Replace native `<label>` with shadcn `<Label>`

- [ ] **Step 2: Migrate FontManager to use shadcn components**

Update `src/components/theme/FontManager.tsx`:
- Replace native `<textarea>` with shadcn `<Textarea>`
- Replace native `<button>` with shadcn `<Button>`

- [ ] **Step 3: Create StylePanel component**

Create `src/components/style/StylePanel.tsx` that composes:
1. `<TemplateCarousel />` at the top
2. `<ThemeEditor />` below
3. `<FontManager />` below that

On mobile, ThemeEditor and FontManager render inside a shadcn `<Sheet>` (bottom sheet) triggered by a "Customize" button below the carousel. On desktop, they render inline below the carousel.

```typescript
import { TemplateCarousel } from './TemplateCarousel'
import { ThemeEditor } from '../theme/ThemeEditor'
import { FontManager } from '../theme/FontManager'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'

export function StylePanel() {
  return (
    <div>
      <TemplateCarousel />

      {/* Desktop: inline theme controls */}
      <div className="hidden md:block p-4 space-y-4">
        <ThemeEditor />
        <FontManager />
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">Anpassen</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
            <div className="space-y-4 p-4">
              <ThemeEditor />
              <FontManager />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Wire StylePanel into MainLayout**

Replace the Style tab placeholder in `MainLayout.tsx` with `<StylePanel />`.

- [ ] **Step 5: Remove ThemeEditor/FontManager from App.tsx**

Remove the `showTheme` state and conditional rendering of ThemeEditor/FontManager from App.tsx. These now live exclusively in StylePanel.

- [ ] **Step 6: Verify Style tab works end-to-end**

Run: `npm run dev`

Test desktop: switch to Style tab, browse templates in carousel, select one, customize theme colors/fonts below.
Test mobile viewport: switch to Style tab via bottom bar, browse carousel, tap "Anpassen" to open bottom sheet with theme controls.

- [ ] **Step 7: Commit**

```bash
git add src/components/style/ src/components/theme/ src/components/MainLayout.tsx src/App.tsx
git commit -m "feat: create StylePanel with template carousel and theme controls"
```

---

## Chunk 4: Polish and Cleanup

### Task 19: Responsive polish

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/MainLayout.tsx`
- Modify: `src/components/BottomTabBar.tsx`

- [ ] **Step 1: Polish Header for mobile**

Ensure the Header:
- Uses compact layout on mobile (smaller text, icon-only export button)
- Export dropdown includes JSON save/load on mobile
- Doesn't overlap with bottom tab bar content

- [ ] **Step 2: Polish MainLayout spacing**

Ensure:
- Mobile content has `pb-14` to avoid bottom tab bar overlap
- Desktop tabs panel has appropriate padding
- Scrolling works correctly in both panels

- [ ] **Step 3: Polish BottomTabBar**

Add:
- Icons for each tab (simple inline SVGs: pencil for Editor, palette for Style, eye for Preview)
- Safe area padding for devices with home indicators (`pb-safe` or env(safe-area-inset-bottom))
- Smooth transition on active state

- [ ] **Step 4: Test on multiple viewports**

Test with browser dev tools:
- iPhone SE (375px)
- iPhone 14 (390px)
- iPad (768px — breakpoint boundary)
- Desktop (1280px)

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/MainLayout.tsx src/components/BottomTabBar.tsx
git commit -m "fix: responsive polish for header, layout, and bottom tab bar"
```

### Task 20: Clean up unused code

**Files:**
- Modify: `src/App.tsx` (if any remnants of old Toolbar/ThemeEditor wiring remain)
- Verify no dead imports across the codebase

- [ ] **Step 1: Search for dead imports**

Search for imports of deleted/moved components (Toolbar, SplitPane, old ThemeEditor conditional logic). Remove any found.

- [ ] **Step 2: Verify full build**

```bash
npm run build
```

Expected: Clean build, no warnings about unused imports.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove dead imports and unused code"
```

### Task 21: Final verification

- [ ] **Step 1: Full manual test**

Run: `npm run dev`

Test the complete flow:
1. Open app → slim header visible, Editor tab active
2. Fill in profile data → all fields work with shadcn inputs
3. Add sections, skills → sortable list works
4. Switch to Style tab → carousel shows templates
5. Swipe through templates, select one → preview updates
6. Favorite a template, filter to favorites → works
7. Open theme controls → color pickers and font selects work
8. Switch to Preview tab (mobile) → PDF renders correctly
9. Export PDF → all scope options work
10. Save/Load JSON → data persists correctly

- [ ] **Step 2: Test mobile viewport**

Repeat the above in a mobile viewport (375px width). Verify:
- Bottom tab bar is visible and functional
- No horizontal overflow
- Bottom sheet for theme controls works
- Content doesn't overlap with tab bar

- [ ] **Step 3: Build for production**

```bash
npm run build
```

Expected: Clean build, production bundle generated.
