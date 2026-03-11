import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { CoverLetter } from '../../types/cv'

export function CoverLetterSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { coverLetter } = data

  const activate = () => {
    const defaultCoverLetter: CoverLetter = {
      recipient: '',
      body: '',
      date: new Date().toLocaleDateString('de-DE'),
    }
    setData((prev) => ({ ...prev, coverLetter: defaultCoverLetter }))
  }

  const deactivate = () => {
    setData((prev) => ({ ...prev, coverLetter: undefined }))
  }

  const update = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      coverLetter: prev.coverLetter ? { ...prev.coverLetter, [field]: value } : prev.coverLetter,
    }))
  }

  return (
    <CollapsiblePanel title="Anschreiben">
      {!coverLetter ? (
        <Button variant="link" className="px-0 text-sm" onClick={activate}>
          Anschreiben aktivieren
        </Button>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="Empfänger"
            value={coverLetter.recipient}
            onChange={(e) => update('recipient', e.target.value)}
          />
          <Textarea
            placeholder="Empfängeradresse (optional, mehrzeilig)"
            rows={2}
            value={coverLetter.recipientAddress ?? ''}
            onChange={(e) => update('recipientAddress', e.target.value)}
          />
          <Input
            placeholder="Betreff (optional)"
            value={coverLetter.subject ?? ''}
            onChange={(e) => update('subject', e.target.value)}
          />
          <Input
            placeholder="Datum"
            value={coverLetter.date}
            onChange={(e) => update('date', e.target.value)}
          />
          <Textarea
            placeholder="Anschreiben-Text"
            value={coverLetter.body}
            rows={10}
            onChange={(e) => update('body', e.target.value)}
          />
          <Button variant="link" className="px-0 text-sm text-destructive" onClick={deactivate}>
            Deaktivieren
          </Button>
        </div>
      )}
    </CollapsiblePanel>
  )
}
