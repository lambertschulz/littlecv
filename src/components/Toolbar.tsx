import { useAtom } from 'jotai'
import { activeTemplateKeyAtom, activeViewAtom } from '../state/atoms'
import { templateRegistry } from '../templates/registry'
import type { ExportScope } from '../types/cv'

interface ToolbarProps {
  onExportPdf: (scope: ExportScope) => void
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

      <select
        className="border rounded px-2 py-1 text-sm"
        value={templateKey}
        onChange={(e) => setTemplateKey(e.target.value)}
      >
        {templateRegistry.map((t) => (
          <option key={t.key} value={t.key}>{t.label}</option>
        ))}
      </select>

      <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50" onClick={onToggleTheme}>
        Theme
      </button>

      <select
        className="border rounded px-2 py-1 text-sm"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) onExportPdf(e.target.value as ExportScope)
          e.target.value = ''
        }}
      >
        <option value="" disabled>PDF Export ▾</option>
        <option value="all">Alles</option>
        <option value="cv">Nur Lebenslauf</option>
        <option value="coverLetter">Nur Anschreiben</option>
        <option value="coverPage">Nur Deckblatt</option>
      </select>

      <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50" onClick={onExportJson}>
        Speichern
      </button>
      <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50" onClick={onImportJson}>
        Laden
      </button>

      <button
        className="md:hidden ml-auto text-sm px-3 py-1 border rounded"
        onClick={() => setActiveView((v) => (v === 'editor' ? 'preview' : 'editor'))}
      >
        {activeView === 'editor' ? 'Vorschau' : 'Editor'}
      </button>
    </header>
  )
}
