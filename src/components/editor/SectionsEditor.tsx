import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { SortableList } from '../shared/SortableList'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Section, SectionEntry } from '../../types/cv'

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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="text-red-400 hover:text-red-600 text-xs"
        >
          Entfernen
        </Button>
      }
    >
      <div className="mb-3">
        <Input
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
            <Input
              placeholder="Titel (z.B. Position, Abschluss)"
              value={item.title}
              onChange={(e) => updateEntry(i, 'title', e.target.value)}
            />
            <Input
              placeholder="Untertitel (z.B. Unternehmen, Institution)"
              value={item.subtitle}
              onChange={(e) => updateEntry(i, 'subtitle', e.target.value)}
            />
            <Input
              placeholder="Zeitraum"
              value={item.period}
              onChange={(e) => updateEntry(i, 'period', e.target.value)}
            />
            <Textarea
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
      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="w-full border-dashed text-muted-foreground hover:text-foreground"
      >
        + Kategorie hinzufügen
      </Button>
    </div>
  )
}
