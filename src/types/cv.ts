export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  photo?: string; // base64-encoded image
}

export interface SectionEntry {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description?: string;
}

export interface TimelineSection {
  id: string;
  name: string;
  entries: SectionEntry[];
}

export interface Skill {
  id: string;
  label: string;
  level?: string;
}

export interface SkillSection {
  id: string;
  name: string;
  skills: Skill[];
}

export interface CoverLetter {
  recipient: string;
  recipientAddress?: string;
  subject?: string;
  body: string;
  date: string;
}

export interface CoverPage {
  company: string;
  position: string;
  date: string;
}

export interface CvData {
  profile: Profile;
  timeline: TimelineSection[];
  skillSections: SkillSection[];
  coverLetter?: CoverLetter;
  coverPage?: CoverPage;
}

export interface Attachment {
  id: string;
  label: string;
  dataUrl: string; // base64 data URL
  mimeType: string; // "image/jpeg" | "image/png" | "application/pdf"
}

export type ExportScope = "all" | "cv" | "coverLetter" | "coverPage";

export type ActiveView = "editor" | "style" | "preview";

// --- Profiles ---

export type OverridableSection =
  | "profile"
  | "timeline"
  | "skillSections"
  | "coverLetter"
  | "coverPage"
  | "attachments"
  | "activeTemplate"
  | "templateThemes";

export interface ProfileOverrides {
  profile?: Profile;
  timeline?: TimelineSection[];
  skillSections?: SkillSection[];
  coverLetter?: CoverLetter;
  coverPage?: CoverPage;
  attachments?: Attachment[];
  activeTemplate?: string;
  templateThemes?: Record<string, object>;
}

export interface UserProfile {
  id: string;
  name: string;
  overrides: ProfileOverrides;
}
