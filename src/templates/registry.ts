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
import { MinimalistTemplate } from './minimalist/MinimalistTemplate'
import { MinimalistCoverLetter } from './minimalist/MinimalistCoverLetter'
import { MinimalistCoverPage } from './minimalist/MinimalistCoverPage'
import { minimalistDefaultTheme, minimalistThemeSchema } from './minimalist/theme'
import { ExecutiveTemplate } from './executive/ExecutiveTemplate'
import { ExecutiveCoverLetter } from './executive/ExecutiveCoverLetter'
import { ExecutiveCoverPage } from './executive/ExecutiveCoverPage'
import { executiveDefaultTheme, executiveThemeSchema } from './executive/theme'
import { CreativeTemplate } from './creative/CreativeTemplate'
import { CreativeCoverLetter } from './creative/CreativeCoverLetter'
import { CreativeCoverPage } from './creative/CreativeCoverPage'
import { creativeDefaultTheme, creativeThemeSchema } from './creative/theme'
import { CompactTemplate } from './compact/CompactTemplate'
import { CompactCoverLetter } from './compact/CompactCoverLetter'
import { CompactCoverPage } from './compact/CompactCoverPage'
import { compactDefaultTheme, compactThemeSchema } from './compact/theme'
import { ElegantTemplate } from './elegant/ElegantTemplate'
import { ElegantCoverLetter } from './elegant/ElegantCoverLetter'
import { ElegantCoverPage } from './elegant/ElegantCoverPage'
import { elegantDefaultTheme, elegantThemeSchema } from './elegant/theme'

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
  {
    key: 'minimalist',
    label: 'Minimalistisch',
    thumbnail: '/thumbnails/minimalist.svg',
    cv: MinimalistTemplate as CvTemplate,
    coverLetter: MinimalistCoverLetter as CoverLetterTemplate,
    coverPage: MinimalistCoverPage as CoverPageTemplate,
    defaultTheme: minimalistDefaultTheme,
    themeSchema: minimalistThemeSchema,
  },
  {
    key: 'executive',
    label: 'Executive',
    thumbnail: '/thumbnails/executive.svg',
    cv: ExecutiveTemplate as CvTemplate,
    coverLetter: ExecutiveCoverLetter as CoverLetterTemplate,
    coverPage: ExecutiveCoverPage as CoverPageTemplate,
    defaultTheme: executiveDefaultTheme,
    themeSchema: executiveThemeSchema,
  },
  {
    key: 'creative',
    label: 'Kreativ',
    thumbnail: '/thumbnails/creative.svg',
    cv: CreativeTemplate as CvTemplate,
    coverLetter: CreativeCoverLetter as CoverLetterTemplate,
    coverPage: CreativeCoverPage as CoverPageTemplate,
    defaultTheme: creativeDefaultTheme,
    themeSchema: creativeThemeSchema,
  },
  {
    key: 'compact',
    label: 'Kompakt',
    thumbnail: '/thumbnails/compact.svg',
    cv: CompactTemplate as CvTemplate,
    coverLetter: CompactCoverLetter as CoverLetterTemplate,
    coverPage: CompactCoverPage as CoverPageTemplate,
    defaultTheme: compactDefaultTheme,
    themeSchema: compactThemeSchema,
  },
  {
    key: 'elegant',
    label: 'Elegant',
    thumbnail: '/thumbnails/elegant.svg',
    cv: ElegantTemplate as CvTemplate,
    coverLetter: ElegantCoverLetter as CoverLetterTemplate,
    coverPage: ElegantCoverPage as CoverPageTemplate,
    defaultTheme: elegantDefaultTheme,
    themeSchema: elegantThemeSchema,
  },
]

export function getTemplate(key: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.key === key)
}
