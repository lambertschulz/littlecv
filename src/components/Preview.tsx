import { useMemo, createElement } from 'react'
import { Document, PDFViewer } from '@react-pdf/renderer'
import { useAtomValue } from 'jotai'
import { cvDataAtom, activeTemplateKeyAtom, activeThemeAtom } from '../state/atoms'
import { getTemplate } from '../templates/registry'

export function Preview() {
  const data = useAtomValue(cvDataAtom)
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const template = getTemplate(templateKey)

  const document = useMemo(() => {
    if (!template) return null
    const pages = []
    if (data.coverPage) {
      pages.push(createElement(template.coverPage, { data, theme, key: 'cp' }))
    }
    if (data.coverLetter) {
      pages.push(createElement(template.coverLetter, { data, theme, key: 'cl' }))
    }
    pages.push(createElement(template.cv, { data, theme, key: 'cv' }))
    return createElement(Document, {}, ...pages)
  }, [data, template, theme, templateKey])

  if (!document) {
    return <div className="p-4 text-gray-500">Keine Vorlage ausgewählt</div>
  }

  return (
    <PDFViewer className="w-full h-full border-0" showToolbar={false}>
      {document}
    </PDFViewer>
  )
}
