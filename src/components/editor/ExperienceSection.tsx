import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { SortableList } from '../shared/SortableList'
import type { Experience } from '../../types/cv'

export function ExperienceSection() {
  const [data, setData] = useAtom(cvDataAtom)

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  const updateItem = (index: number, field: string, value: string) => {
    setData((prev) => {
      const next = [...prev.experience]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, experience: next }
    })
  }

  const createItem = (): Experience => ({
    id: crypto.randomUUID(),
    company: '',
    role: '',
    period: '',
    description: '',
  })

  return (
    <CollapsiblePanel title="Berufserfahrung">
      <SortableList
        items={data.experience}
        onChange={(items) => setData((prev) => ({ ...prev, experience: items }))}
        createItem={createItem}
        addLabel="Stelle hinzufügen"
        renderItem={(item, i) => (
          <div className="space-y-2 pr-16">
            <input
              className={inputClass}
              placeholder="Unternehmen"
              value={item.company}
              onChange={(e) => updateItem(i, 'company', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Position"
              value={item.role}
              onChange={(e) => updateItem(i, 'role', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Zeitraum"
              value={item.period}
              onChange={(e) => updateItem(i, 'period', e.target.value)}
            />
            <textarea
              className={inputClass}
              placeholder="Beschreibung"
              value={item.description}
              rows={3}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
            />
          </div>
        )}
      />
    </CollapsiblePanel>
  )
}
