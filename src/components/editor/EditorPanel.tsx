import { ProfileSection } from './ProfileSection'
import { SectionsEditor } from './SectionsEditor'
import { SkillsSection } from './SkillsSection'
import { CoverLetterSection } from './CoverLetterSection'
import { CoverPageSection } from './CoverPageSection'

export function EditorPanel() {
  return (
    <div>
      <ProfileSection />
      <SectionsEditor />
      <SkillsSection />
      <CoverLetterSection />
      <CoverPageSection />
    </div>
  )
}
