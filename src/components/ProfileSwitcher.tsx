import { useAtom } from "jotai";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { activeProfileIdAtom, profilesAtom } from "@/state/atoms";
import type { UserProfile } from "@/types/cv";

export function ProfileSwitcher() {
  const [profiles, setProfiles] = useAtom(profilesAtom);
  const [activeProfileId, setActiveProfileId] = useAtom(activeProfileIdAtom);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const createProfile = () => {
    const name = window.prompt("Name des Profils:");
    if (!name?.trim()) return;
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      overrides: {},
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const renameProfile = (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    const name = window.prompt("Neuer Name:", profile.name);
    if (!name?.trim()) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)),
    );
  };

  const deleteProfile = (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    if (!window.confirm(`Profil "${profile.name}" wirklich löschen?`)) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
  };

  // Zero profiles: show simple "+ Profil" button
  if (profiles.length === 0) {
    return (
      <Button variant="outline" size="sm" onClick={createProfile}>
        <Plus className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Profil</span>
      </Button>
    );
  }

  // One+ profiles: show dropdown switcher
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" />}
      >
        {activeProfile ? activeProfile.name : "Basis"}
        <span className="ml-1">▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => setActiveProfileId(null)}
          className="flex items-center justify-between"
        >
          Basis
          {activeProfileId === null && <Check className="w-4 h-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {profiles.map((profile) => (
          <DropdownMenuItem
            key={profile.id}
            onClick={() => setActiveProfileId(profile.id)}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              {profile.name}
              {activeProfileId === profile.id && <Check className="w-4 h-4" />}
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  renameProfile(profile.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProfile(profile.id);
                }}
                className="p-1 hover:bg-red-100 rounded text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createProfile}>
          <Plus className="w-4 h-4 mr-2" />
          Neues Profil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
