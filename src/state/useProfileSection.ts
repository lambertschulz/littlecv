import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type { ProfileOverrides } from "../types/cv";
import {
  activeProfileAtom,
  activeTemplateKeyAtom,
  attachmentsAtom,
  cvDataAtom,
  profilesAtom,
  templateThemesAtom,
} from "./atoms";

type CvDataSectionKey =
  | "profile"
  | "timeline"
  | "skillSections"
  | "coverLetter"
  | "coverPage";

const cvDataKeys = new Set<string>([
  "profile",
  "timeline",
  "skillSections",
  "coverLetter",
  "coverPage",
]);

function isCvDataKey(key: string): key is CvDataSectionKey {
  return cvDataKeys.has(key);
}

export function useProfileSection<K extends keyof ProfileOverrides>(
  sectionKey: K,
): {
  value: NonNullable<ProfileOverrides[K]> | ProfileOverrides[K];
  setValue: (val: ProfileOverrides[K]) => void;
  isOverridden: boolean;
  resetToBase: () => void;
} {
  const activeProfile = useAtomValue(activeProfileAtom);
  const setProfiles = useSetAtom(profilesAtom);
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [attachments, setAttachments] = useAtom(attachmentsAtom);
  const [activeTemplate, setActiveTemplate] = useAtom(activeTemplateKeyAtom);
  const [templateThemes, setTemplateThemes] = useAtom(templateThemesAtom);

  const isOverridden =
    activeProfile != null && activeProfile.overrides[sectionKey] !== undefined;

  // Read: override if exists, otherwise base
  let value: ProfileOverrides[K];
  if (activeProfile && activeProfile.overrides[sectionKey] !== undefined) {
    value = activeProfile.overrides[sectionKey];
  } else if (isCvDataKey(sectionKey)) {
    value = cvData[sectionKey] as ProfileOverrides[K];
  } else if (sectionKey === "attachments") {
    value = attachments as ProfileOverrides[K];
  } else if (sectionKey === "activeTemplate") {
    value = activeTemplate as ProfileOverrides[K];
  } else {
    value = templateThemes as ProfileOverrides[K];
  }

  const setValue = (val: ProfileOverrides[K]) => {
    if (!activeProfile) {
      // Write to base
      if (isCvDataKey(sectionKey)) {
        setCvData((prev) => ({ ...prev, [sectionKey]: val }));
      } else if (sectionKey === "attachments") {
        setAttachments(val as ProfileOverrides["attachments"] & []);
      } else if (sectionKey === "activeTemplate") {
        setActiveTemplate(val as string);
      } else {
        setTemplateThemes(val as Record<string, object>);
      }
    } else {
      // Write to profile override
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfile.id
            ? { ...p, overrides: { ...p.overrides, [sectionKey]: val } }
            : p,
        ),
      );
    }
  };

  const resetToBase = () => {
    if (!activeProfile) return;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfile.id) return p;
        const { [sectionKey]: _, ...rest } = p.overrides;
        return { ...p, overrides: rest };
      }),
    );
  };

  return { value, setValue, isOverridden, resetToBase };
}
