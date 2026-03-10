import type { FC } from 'react'
import type { CvData } from '../types/cv'

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

export const templateRegistry: TemplateConfig[] = []

export function getTemplate(key: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.key === key)
}
