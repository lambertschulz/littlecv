import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { SortableList } from '../shared/SortableList'
import { Input } from '@/components/ui/input'
import type { Skill } from '../../types/cv'

export function SkillsSection() {
  const [data, setData] = useAtom(cvDataAtom)

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
            <Input
              placeholder="Bezeichnung"
              value={item.label}
              onChange={(e) => updateItem(i, 'label', e.target.value)}
            />
            <Input
              placeholder="Level (z.B. Fortgeschritten, 5 Jahre, C1)"
              value={item.level ?? ''}
              onChange={(e) => updateItem(i, 'level', e.target.value)}
            />
          </div>
        )}
      />
    </CollapsiblePanel>
  )
}
