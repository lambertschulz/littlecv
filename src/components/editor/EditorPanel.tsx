import { ProfileSection } from './ProfileSection'
import { ExperienceSection } from './ExperienceSection'
import { EducationSection } from './EducationSection'
import { SkillsSection } from './SkillsSection'
import { CoverLetterSection } from './CoverLetterSection'
import { CoverPageSection } from './CoverPageSection'

export function EditorPanel() {
  return (
    <div>
      <ProfileSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <CoverLetterSection />
      <CoverPageSection />
    </div>
  )
}
