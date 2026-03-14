import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileSection } from "../../state/useProfileSection";
import type { Profile } from "../../types/cv";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { PhotoUpload } from "../shared/PhotoUpload";

export function ProfileSection() {
  const { value, setValue, isOverridden, resetToBase } =
    useProfileSection("profile");
  const profile = value as Profile;

  const update = (field: string, val: string | undefined) => {
    setValue({ ...profile, [field]: val });
  };

  return (
    <CollapsiblePanel
      title="Profil"
      overrideStatus={{ isOverridden, onReset: resetToBase }}
    >
      <div className="space-y-3">
        <PhotoUpload
          value={profile.photo}
          onChange={(v) => update("photo", v)}
        />
        <div className="space-y-1">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-title">Titel / Berufsbezeichnung</Label>
          <Input
            id="profile-title"
            placeholder="Titel / Berufsbezeichnung"
            value={profile.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-email">E-Mail</Label>
          <Input
            id="profile-email"
            placeholder="E-Mail"
            type="email"
            value={profile.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-phone">Telefon</Label>
          <Input
            id="profile-phone"
            placeholder="Telefon"
            value={profile.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-address">Adresse (optional)</Label>
          <Textarea
            id="profile-address"
            placeholder="Adresse (optional, mehrzeilig)"
            rows={2}
            value={profile.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-website">Website (optional)</Label>
          <Input
            id="profile-website"
            placeholder="Website (optional)"
            value={profile.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>
      </div>
    </CollapsiblePanel>
  );
}
