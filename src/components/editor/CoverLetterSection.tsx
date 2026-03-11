import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import type { CoverLetter } from '../../types/cv'

export function CoverLetterSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { coverLetter } = data

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

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
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={activate}
        >
          Anschreiben aktivieren
        </button>
      ) : (
        <div className="space-y-3">
          <input
            className={inputClass}
            placeholder="Empfänger"
            value={coverLetter.recipient}
            onChange={(e) => update('recipient', e.target.value)}
          />
          <textarea
            className={inputClass}
            placeholder="Empfängeradresse (optional, mehrzeilig)"
            rows={2}
            value={coverLetter.recipientAddress ?? ''}
            onChange={(e) => update('recipientAddress', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Betreff (optional)"
            value={coverLetter.subject ?? ''}
            onChange={(e) => update('subject', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Datum"
            value={coverLetter.date}
            onChange={(e) => update('date', e.target.value)}
          />
          <textarea
            className={inputClass}
            placeholder="Anschreiben-Text"
            value={coverLetter.body}
            rows={10}
            onChange={(e) => update('body', e.target.value)}
          />
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={deactivate}
          >
            Deaktivieren
          </button>
        </div>
      )}
    </CollapsiblePanel>
  )
}
