import type { FC } from 'react'
import type { CvData } from '../types/cv'
import { ModernTemplate } from './modern/ModernTemplate'
import { ModernCoverLetter } from './modern/ModernCoverLetter'
import { ModernCoverPage } from './modern/ModernCoverPage'
import { modernDefaultTheme, modernThemeSchema } from './modern/theme'
import { ClassicTemplate } from './classic/ClassicTemplate'
import { ClassicCoverLetter } from './classic/ClassicCoverLetter'
import { ClassicCoverPage } from './classic/ClassicCoverPage'
import { classicDefaultTheme, classicThemeSchema } from './classic/theme'

export type CvTemplate<T extends object = object> = FC<{
  data: CvData
  theme: T
}>

export type CoverLetterTemplate<T extends object = object> = FC<{
  data: CvData
  theme: T
}>

export type CoverPageTemplate<T extends object = object> = FC<{
  data: CvData
  theme: T
}>

export interface ThemeSchemaEntry {
  key: string
  label: string
  type: 'color' | 'select'
  options?: string[]
}

export interface TemplateConfig<T extends object = object> {
  key: string
  label: string
  thumbnail: string
  cv: CvTemplate<T>
  coverLetter: CoverLetterTemplate<T>
  coverPage: CoverPageTemplate<T>
  defaultTheme: T
  themeSchema: ThemeSchemaEntry[]
}

export const templateRegistry: TemplateConfig[] = [
  {
    key: 'modern',
    label: 'Modern',
    thumbnail: '/thumbnails/modern.svg',
    cv: ModernTemplate as CvTemplate,
    coverLetter: ModernCoverLetter as CoverLetterTemplate,
    coverPage: ModernCoverPage as CoverPageTemplate,
    defaultTheme: modernDefaultTheme,
    themeSchema: modernThemeSchema,
  },
  {
    key: 'classic',
    label: 'Klassisch',
    thumbnail: '/thumbnails/classic.svg',
    cv: ClassicTemplate as CvTemplate,
    coverLetter: ClassicCoverLetter as CoverLetterTemplate,
    coverPage: ClassicCoverPage as CoverPageTemplate,
    defaultTheme: classicDefaultTheme,
    themeSchema: classicThemeSchema,
  },
]

export function getTemplate(key: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.key === key)
}
