import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { templateRegistry } from "../templates/registry";

// Migrate old localStorage data (sections -> timeline, skills -> skillSections)
// Runs once at module load before atoms are created
import type {
  ActiveView,
  Attachment,
  CvData,
  SkillSection,
  UserProfile,
} from "../types/cv";

(function migrateLegacyStorage() {
  try {
    const raw = localStorage.getItem("cv-data");
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return;

    let changed = false;

    if ("sections" in data && !("timeline" in data)) {
      data.timeline = data.sections;
      delete data.sections;
      changed = true;
    }

    if ("skills" in data && !("skillSections" in data)) {
      const skills = data.skills;
      if (Array.isArray(skills) && skills.length > 0) {
        const section: SkillSection = {
          id: crypto.randomUUID(),
          name: "Kenntnisse",
          skills,
        };
        data.skillSections = [section];
      } else {
        data.skillSections = [];
      }
      delete data.skills;
      changed = true;
    }

    if (changed) {
      localStorage.setItem("cv-data", JSON.stringify(data));
    }
  } catch {
    // ignore parse errors
  }
})();

const defaultCvData: CvData = {
  profile: {
    name: "",
    title: "",
    email: "",
    phone: "",
  },
  timeline: [],
  skillSections: [],
};

export const cvDataAtom = atomWithStorage<CvData>("cv-data", defaultCvData);

export const activeTemplateKeyAtom = atomWithStorage<string>(
  "active-template",
  "modern",
);

const defaultThemes: Record<string, object> = {};
for (const t of templateRegistry) {
  defaultThemes[t.key] = t.defaultTheme;
}

export const templateThemesAtom = atomWithStorage<Record<string, object>>(
  "template-themes",
  defaultThemes,
);

export const activeViewAtom = atom<ActiveView>("editor");

export const favoriteTemplatesAtom = atomWithStorage<string[]>(
  "favorite-templates",
  [],
);

export const customFontsAtom = atomWithStorage<
  { family: string; url: string }[]
>("custom-fonts", []);

export const attachmentsAtom = atomWithStorage<Attachment[]>("attachments", []);

// --- Profiles ---

export const profilesAtom = atomWithStorage<UserProfile[]>("profiles", []);

export const activeProfileIdAtom = atomWithStorage<string | null>(
  "active-profile-id",
  null,
);

export const activeProfileAtom = atom((get) => {
  const id = get(activeProfileIdAtom);
  if (!id) return null;
  return get(profilesAtom).find((p) => p.id === id) ?? null;
});

// Effective atoms: merge base with active profile overrides (for Preview/PDF export)

export const effectiveCvDataAtom = atom((get) => {
  const base = get(cvDataAtom);
  const profile = get(activeProfileAtom);
  if (!profile) return base;
  const o = profile.overrides;
  return {
    profile: o.profile ?? base.profile,
    timeline: o.timeline ?? base.timeline,
    skillSections: o.skillSections ?? base.skillSections,
    coverLetter: o.coverLetter ?? base.coverLetter,
    coverPage: o.coverPage ?? base.coverPage,
  };
});

export const effectiveAttachmentsAtom = atom((get) => {
  const profile = get(activeProfileAtom);
  return profile?.overrides.attachments ?? get(attachmentsAtom);
});

export const effectiveTemplateKeyAtom = atom((get) => {
  const profile = get(activeProfileAtom);
  return profile?.overrides.activeTemplate ?? get(activeTemplateKeyAtom);
});

export const effectiveThemesAtom = atom((get) => {
  const profile = get(activeProfileAtom);
  return profile?.overrides.templateThemes ?? get(templateThemesAtom);
});

// Derived: active theme for the current template (profile-aware, read-only)
export const activeThemeAtom = atom((get) => {
  const themes = get(effectiveThemesAtom);
  const key = get(effectiveTemplateKeyAtom);
  return themes[key] ?? {};
});
