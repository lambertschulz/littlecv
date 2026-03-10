import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { CvData, ActiveView } from '../types/cv'

const defaultCvData: CvData = {
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
  },
  experience: [],
  education: [],
  skills: [],
}

export const cvDataAtom = atomWithStorage<CvData>('cv-data', defaultCvData)

export const activeTemplateKeyAtom = atomWithStorage<string>(
  'active-template',
  'modern'
)

export const templateThemesAtom = atomWithStorage<Record<string, object>>(
  'template-themes',
  {}
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

export const customFontsAtom = atomWithStorage<
  { family: string; url: string }[]
>('custom-fonts', [])
