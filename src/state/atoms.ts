import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { CvData, ActiveView, SkillSection } from '../types/cv'
import { templateRegistry } from '../templates/registry'

// Migrate old localStorage data (sections -> timeline, skills -> skillSections)
// Runs once at module load before atoms are created
;(function migrateLegacyStorage() {
  try {
    const raw = localStorage.getItem('cv-data')
    if (!raw) return
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return

    let changed = false

    if ('sections' in data && !('timeline' in data)) {
      data.timeline = data.sections
      delete data.sections
      changed = true
    }

    if ('skills' in data && !('skillSections' in data)) {
      const skills = data.skills
      if (Array.isArray(skills) && skills.length > 0) {
        const section: SkillSection = {
          id: crypto.randomUUID(),
          name: 'Kenntnisse',
          skills,
        }
        data.skillSections = [section]
      } else {
        data.skillSections = []
      }
      delete data.skills
      changed = true
    }

    if (changed) {
      localStorage.setItem('cv-data', JSON.stringify(data))
    }
  } catch {
    // ignore parse errors
  }
})()

const defaultCvData: CvData = {
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
  },
  timeline: [],
  skillSections: [],
}

export const cvDataAtom = atomWithStorage<CvData>('cv-data', defaultCvData)

export const activeTemplateKeyAtom = atomWithStorage<string>(
  'active-template',
  'modern'
)

const defaultThemes: Record<string, object> = {}
for (const t of templateRegistry) {
  defaultThemes[t.key] = t.defaultTheme
}

export const templateThemesAtom = atomWithStorage<Record<string, object>>(
  'template-themes',
  defaultThemes
)

export const activeThemeAtom = atom(
  (get) => {
    const themes = get(templateThemesAtom)
    const key = get(activeTemplateKeyAtom)
    return themes[key] ?? {}
  },
  (get, set, newTheme: object) => {
    const key = get(activeTemplateKeyAtom)
    set(templateThemesAtom, (prev) => ({ ...prev, [key]: newTheme }))
  }
)

export const activeViewAtom = atom<ActiveView>('editor')

export const favoriteTemplatesAtom = atomWithStorage<string[]>('favorite-templates', [])

export const customFontsAtom = atomWithStorage<
  { family: string; url: string }[]
>('custom-fonts', [])
