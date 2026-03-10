import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { SortableList } from '../shared/SortableList'
import type { Section, SectionEntry } from '../../types/cv'

const inputClass =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

function SectionPanel({
  section,
  onUpdate,
  onRemove,
}: {
  section: Section
  onUpdate: (s: Section) => void
  onRemove: () => void
}) {
  const updateEntry = (index: number, field: string, value: string) => {
    const next = [...section.entries]
    next[index] = { ...next[index], [field]: value }
    onUpdate({ ...section, entries: next })
  }

  const createEntry = (): SectionEntry => ({
    id: crypto.randomUUID(),
    title: '',
    subtitle: '',
    period: '',
  })

  return (
    <CollapsiblePanel
      title={section.name || 'Neue Kategorie'}
      actions={
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="text-red-400 hover:text-red-600 text-xs px-2"
        >
          Entfernen
        </button>
      }
    >
      <div className="mb-3">
        <input
          className={inputClass}
          placeholder="Kategorie-Name (z.B. Berufserfahrung, Ausbildung, Projekte)"
          value={section.name}
          onChange={(e) => onUpdate({ ...section, name: e.target.value })}
        />
      </div>
      <SortableList
        items={section.entries}
        onChange={(entries) => onUpdate({ ...section, entries })}
        createItem={createEntry}
        addLabel="Eintrag hinzufügen"
        renderItem={(item, i) => (
          <div className="space-y-2 pr-16">
            <input
              className={inputClass}
              placeholder="Titel (z.B. Position, Abschluss)"
              value={item.title}
              onChange={(e) => updateEntry(i, 'title', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Untertitel (z.B. Unternehmen, Institution)"
              value={item.subtitle}
              onChange={(e) => updateEntry(i, 'subtitle', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Zeitraum"
              value={item.period}
              onChange={(e) => updateEntry(i, 'period', e.target.value)}
            />
            <textarea
              className={inputClass}
              placeholder="Beschreibung (optional)"
              value={item.description ?? ''}
              rows={3}
              onChange={(e) => updateEntry(i, 'description', e.target.value)}
            />
          </div>
        )}
      />
    </CollapsiblePanel>
  )
}

export function SectionsEditor() {
  const [data, setData] = useAtom(cvDataAtom)
  const sections = data.sections ?? []

  const addSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      name: '',
      entries: [],
    }
    setData((prev) => ({ ...prev, sections: [...(prev.sections ?? []), newSection] }))
  }

  const updateSection = (index: number, section: Section) => {
    setData((prev) => {
      const next = [...(prev.sections ?? [])]
      next[index] = section
      return { ...prev, sections: next }
    })
  }

  const removeSection = (index: number) => {
    setData((prev) => ({
      ...prev,
      sections: (prev.sections ?? []).filter((_, i) => i !== index),
    }))
  }

  return (
    <div>
      {sections.map((section, i) => (
        <SectionPanel
          key={section.id}
          section={section}
          onUpdate={(s) => updateSection(i, s)}
          onRemove={() => removeSection(i)}
        />
      ))}
      <button
        type="button"
        onClick={addSection}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Kategorie hinzufügen
      </button>
    </div>
  )
}
