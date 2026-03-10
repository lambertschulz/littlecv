import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import type { CoverPage } from '../../types/cv'

export function CoverPageSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { coverPage } = data

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

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
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={activate}
        >
          Deckblatt aktivieren
        </button>
      ) : (
        <div className="space-y-3">
          <input
            className={inputClass}
            placeholder="Unternehmen"
            value={coverPage.company}
            onChange={(e) => update('company', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Position"
            value={coverPage.position}
            onChange={(e) => update('position', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Datum"
            value={coverPage.date}
            onChange={(e) => update('date', e.target.value)}
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
