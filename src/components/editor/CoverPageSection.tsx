import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CoverPage } from '../../types/cv'

export function CoverPageSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { coverPage } = data

  const activate = () => {
    const defaultCoverPage: CoverPage = {
      company: '',
      position: '',
      date: new Date().toLocaleDateString('de-DE'),
    }
    setData((prev) => ({ ...prev, coverPage: defaultCoverPage }))
  }

  const deactivate = () => {
    setData((prev) => ({ ...prev, coverPage: undefined }))
  }

  const update = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      coverPage: prev.coverPage ? { ...prev.coverPage, [field]: value } : prev.coverPage,
    }))
  }

  return (
    <CollapsiblePanel title="Deckblatt">
      {!coverPage ? (
        <Button variant="link" className="px-0 text-sm" onClick={activate}>
          Deckblatt aktivieren
        </Button>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="Unternehmen"
            value={coverPage.company}
            onChange={(e) => update('company', e.target.value)}
          />
          <Input
            placeholder="Position"
            value={coverPage.position}
            onChange={(e) => update('position', e.target.value)}
          />
          <Input
            placeholder="Datum"
            value={coverPage.date}
            onChange={(e) => update('date', e.target.value)}
          />
          <Button variant="link" className="px-0 text-sm text-destructive" onClick={deactivate}>
            Deaktivieren
          </Button>
        </div>
      )}
    </CollapsiblePanel>
  )
}
