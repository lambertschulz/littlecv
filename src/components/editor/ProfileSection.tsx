import { useAtom } from 'jotai'
import { cvDataAtom } from '../../state/atoms'
import { CollapsiblePanel } from '../shared/CollapsiblePanel'
import { PhotoUpload } from '../shared/PhotoUpload'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function ProfileSection() {
  const [data, setData] = useAtom(cvDataAtom)
  const { profile } = data

  const update = (field: string, value: string | undefined) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }))
  }

  return (
    <CollapsiblePanel title="Profil">
      <div className="space-y-3">
        <PhotoUpload value={profile.photo} onChange={(v) => update('photo', v)} />
        <div className="space-y-1">
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" placeholder="Name" value={profile.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-title">Titel / Berufsbezeichnung</Label>
          <Input id="profile-title" placeholder="Titel / Berufsbezeichnung" value={profile.title} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-email">E-Mail</Label>
          <Input id="profile-email" placeholder="E-Mail" type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-phone">Telefon</Label>
          <Input id="profile-phone" placeholder="Telefon" value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-address">Adresse (optional)</Label>
          <Textarea id="profile-address" placeholder="Adresse (optional, mehrzeilig)" rows={2} value={profile.address ?? ''} onChange={(e) => update('address', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-website">Website (optional)</Label>
          <Input id="profile-website" placeholder="Website (optional)" value={profile.website ?? ''} onChange={(e) => update('website', e.target.value)} />
        </div>
      </div>
    </CollapsiblePanel>
  )
}
