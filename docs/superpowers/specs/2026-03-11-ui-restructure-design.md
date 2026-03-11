# UI Restructure Design

## Summary

Restructure the littlecv app from a toolbar-driven split-pane layout to a tab-based, mobile-first, native-app-like experience. Replace all custom UI components with shadcn/ui (Base UI variant).

## Layout — Desktop (md+)

```
┌─────────────────────────────────────────────────┐
│  Logo/Name                    [Export ▾] [Save]  │
├──────────────────────┬──────────────────────────┤
│ [Editor] [Style]     │                          │
│ ─────────────────    │                          │
│                      │                          │
│  Left panel content  │    Live PDF Preview      │
│  (scrollable)        │                          │
│                      │                          │
├──────────────────────┴──────────────────────────┤
```

- **Left panel**: two tabs — Editor and Style
- **Right panel**: persistent live PDF preview, always visible
- **Header**: slim bar with app name/logo on the left, export PDF dropdown + JSON save/load on the right

## Layout — Mobile (<md)

```
┌─────────────────────┐
│  Logo      [Export]  │
├─────────────────────┤
│                     │
│  Full-width content │
│  for active tab     │
│                     │
├─────────────────────┤
│ Editor  Style  Preview │
└─────────────────────┘
```

- **Bottom tab bar** with 3 tabs: Editor, Style, Preview
- Each tab renders full-width content
- Header stays slim — logo + export dropdown (same scope options as desktop: All, CV only, Cover Letter only, Cover Page only). JSON save/load is also in the export dropdown on mobile.

## Editor Tab

Collapsible accordion sections (same as current structure):

1. **Profile** — personal info, contact details, address, photo upload
2. **Sections** — dynamic CV sections (experience, education, projects) with sortable list
3. **Skills** — skills with optional proficiency levels
4. **Cover Letter** — optional cover letter content
5. **Cover Page** — optional cover page configuration

## Style Tab

Combines template selection and theme customization in one view:

1. **Template carousel** — swipeable, full-width. Each slide shows the template's existing SVG thumbnail (from `/public/thumbnails/`) overlaid with the template name. The currently selected template is highlighted. Rendering full live PDFs for every template simultaneously would be too expensive; the live preview in the right panel (desktop) or Preview tab (mobile) already shows the selected template with real data.
2. **Favorite button** — heart icon on each carousel slide to mark/unmark favorites
3. **Filter toggle** — switch between "All" and "Favorites" templates
4. **Theme controls** — on mobile: bottom sheet (shadcn Sheet) that slides up over the carousel, dismissible by swiping down. On desktop: scrollable area below the carousel in the left panel. Controls are dynamically generated from the template's `themeSchema` (color pickers, font selectors).

## Preview Tab (mobile only)

- Full-width PDF preview (same renderer as desktop right panel)
- Export actions accessible from the header

## Component Library

Replace all custom UI primitives with **shadcn/ui (Base UI variant)**:

- shadcn/ui offers a Base UI variant that uses `@base-ui-components/react` as the primitive layer instead of `@radix-ui/*`. Install via `npx shadcn@latest init` and select "base" style when prompted.
- Utility libraries: `tailwind-merge`, `clsx`, `class-variance-authority`
- Components to adopt: Button, Input, Textarea, Select, Tabs, Sheet (bottom sheet on mobile), Collapsible, DropdownMenu, Card
- For the template carousel: use Embla Carousel (`embla-carousel-react`) which is the carousel engine shadcn/ui recommends. Wrap in a custom `TemplateCarousel` component with swipe support built-in.

## Navigation Summary

| Viewport | Navigation | Preview |
|----------|-----------|---------|
| Desktop (md+) | Two tabs (Editor / Style) in left panel header | Always visible in right panel |
| Mobile (<md) | Bottom tab bar: Editor, Style, Preview | Dedicated tab |

## State Changes

- `activeViewAtom` expands from `'editor' | 'preview'` to `'editor' | 'style' | 'preview'`. On desktop, `'preview'` is ignored (preview panel always visible); on mobile, all three values drive the bottom tab bar.
- New `favoriteTemplatesAtom`: `atomWithStorage<string[]>('favorite-templates', [])` — persists favorite template keys to localStorage
- Template selection and theme editing move from Toolbar/ThemeEditor into the Style tab
- Toolbar simplifies to header with logo + export actions only

## Migration Notes

- Toolbar component: strip template selector, theme toggle. Keep export dropdown and JSON save/load.
- SplitPane: refactor to support tabbed left panel on desktop, bottom tabs on mobile.
- ThemeEditor + FontManager: relocate into Style tab as theme controls section.
- All native `<input>`, `<select>`, `<button>`, `<textarea>` elements replaced with shadcn/ui equivalents.
- Remove mobile editor/preview toggle button from Toolbar (replaced by bottom tab bar).
- Desktop left panel width: keep 50/50 split with the preview panel (same as current `md:w-1/2`). Can be adjusted later if needed.
- Breakpoint: `md` = 768px (Tailwind v4 default). This is the single breakpoint separating mobile from desktop layout.
