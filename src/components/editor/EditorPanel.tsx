import { CoverLetterSection } from "./CoverLetterSection";
import { CoverPageSection } from "./CoverPageSection";
import { ProfileSection } from "./ProfileSection";
import { SectionsEditor } from "./SectionsEditor";
import { SkillsSection } from "./SkillsSection";

export function EditorPanel() {
  return (
    <div>
      <ProfileSection />
      <SectionsEditor />
      <SkillsSection />
      <CoverLetterSection />
      <CoverPageSection />
    </div>
  );
}
