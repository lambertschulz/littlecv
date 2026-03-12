import { pdf, Document } from '@react-pdf/renderer'
import type { CvData, ExportScope } from '../types/cv'
import type { TemplateConfig } from '../templates/registry'
import { createElement } from 'react'
import { saveBlob } from './save-blob'

export async function exportPdf(
  data: CvData,
  template: TemplateConfig,
  theme: object,
  scope: ExportScope
): Promise<void> {
  const pages: React.ReactElement[] = []

  if ((scope === 'all' || scope === 'coverPage') && data.coverPage) {
    pages.push(createElement(template.coverPage, { data, theme, key: 'cp' }))
  }

  if ((scope === 'all' || scope === 'coverLetter') && data.coverLetter) {
    pages.push(createElement(template.coverLetter, { data, theme, key: 'cl' }))
  }

  if (scope === 'all' || scope === 'cv') {
    pages.push(createElement(template.cv, { data, theme, key: 'cv' }))
  }

  if (pages.length === 0) return

  const doc = createElement(Document, {}, ...pages)
  const blob = await pdf(doc).toBlob()

  await saveBlob(blob, `bewerbung-${scope}.pdf`, 'application/pdf', 'PDF')
}
