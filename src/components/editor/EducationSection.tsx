import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { SortableList } from '../shared/SortableList'
import type { Education } from '../../types/cv'

export function EducationSection() {
  const [data, setData] = useAtom(cvDataAtom)

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  const updateItem = (index: number, field: string, value: string) => {
    setData((prev) => {
      const next = [...prev.education]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, education: next }
    })
  }

  const createItem = (): Education => ({
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    period: '',
  })

  return (
    <CollapsiblePanel title="Ausbildung">
      <SortableList
        items={data.education}
        onChange={(items) => setData((prev) => ({ ...prev, education: items }))}
        createItem={createItem}
        addLabel="Ausbildung hinzufügen"
        renderItem={(item, i) => (
          <div className="space-y-2 pr-16">
            <input
              className={inputClass}
              placeholder="Institution"
              value={item.institution}
              onChange={(e) => updateItem(i, 'institution', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Abschluss / Studiengang"
              value={item.degree}
              onChange={(e) => updateItem(i, 'degree', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Zeitraum"
              value={item.period}
              onChange={(e) => updateItem(i, 'period', e.target.value)}
            />
            <textarea
              className={inputClass}
              placeholder="Beschreibung (optional)"
              value={item.description ?? ''}
              rows={3}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
            />
          </div>
        )}
      />
    </CollapsiblePanel>
  )
}
