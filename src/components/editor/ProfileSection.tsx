import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { PhotoUpload } from '../shared/PhotoUpload'

export function ProfileSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { profile } = data

  const update = (field: string, value: string | undefined) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }))
  }

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <CollapsiblePanel title="Profil">
      <div className="space-y-3">
        <PhotoUpload value={profile.photo} onChange={(v) => update('photo', v)} />
        <input className={inputClass} placeholder="Name" value={profile.name} onChange={(e) => update('name', e.target.value)} />
        <input className={inputClass} placeholder="Titel / Berufsbezeichnung" value={profile.title} onChange={(e) => update('title', e.target.value)} />
        <input className={inputClass} placeholder="E-Mail" type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} />
        <input className={inputClass} placeholder="Telefon" value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
        <input className={inputClass} placeholder="Adresse (optional)" value={profile.address ?? ''} onChange={(e) => update('address', e.target.value)} />
        <input className={inputClass} placeholder="Website (optional)" value={profile.website ?? ''} onChange={(e) => update('website', e.target.value)} />
      </div>
    </CollapsiblePanel>
  )
}
