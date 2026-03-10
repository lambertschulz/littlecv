import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { SortableList } from '../shared/SortableList'
import type { Skill } from '../../types/cv'

export function SkillsSection() {
  const [data, setData] = useAtom(cvDataAtom)

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  const updateItem = (index: number, field: string, value: string) => {
    setData((prev) => {
      const next = [...prev.skills]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, skills: next }
    })
  }

  const createItem = (): Skill => ({
    id: crypto.randomUUID(),
    label: '',
  })

  return (
    <CollapsiblePanel title="Kenntnisse">
      <SortableList
        items={data.skills}
        onChange={(items) => setData((prev) => ({ ...prev, skills: items }))}
        createItem={createItem}
        addLabel="Kenntnis hinzufügen"
        renderItem={(item, i) => (
          <div className="space-y-2 pr-16">
            <input
              className={inputClass}
              placeholder="Bezeichnung"
              value={item.label}
              onChange={(e) => updateItem(i, 'label', e.target.value)}
            />
            <select
              className={inputClass}
              value={item.level ?? ''}
              onChange={(e) => updateItem(i, 'level', e.target.value)}
            >
              <option value="">Kein Level</option>
              <option value="beginner">Anfänger</option>
              <option value="intermediate">Mittelstufe</option>
              <option value="advanced">Fortgeschritten</option>
              <option value="expert">Experte</option>
            </select>
          </div>
        )}
      />
    </CollapsiblePanel>
  )
}
