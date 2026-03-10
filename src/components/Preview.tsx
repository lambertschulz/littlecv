import { useMemo } from 'react'
import { Document, usePDF } from '@react-pdf/renderer'
import { useAtomValue } from 'jotai'
import { cvDataAtom, activeTemplateKeyAtom, activeThemeAtom } from '../state/atoms'
import { getTemplate } from '../templates/registry'

export function Preview() {
  const data = useAtomValue(cvDataAtom)
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const template = getTemplate(templateKey)

  const pdfDocument = useMemo(() => {
    if (!template) return null

    const CvPage = template.cv
    const CoverLetterPage = template.coverLetter
    const CoverPagePage = template.coverPage

    return (
      <Document>
        {data.coverPage && <CoverPagePage data={data} theme={theme} />}
        {data.coverLetter && <CoverLetterPage data={data} theme={theme} />}
        <CvPage data={data} theme={theme} />
      </Document>
    )
  }, [data, template, theme])

  const [instance] = usePDF({ document: pdfDocument })

  if (!pdfDocument) {
    return <div className="p-4 text-gray-500">Kein Template ausgewählt</div>
  }

  if (instance.loading) {
    return <div className="p-4 text-gray-500">PDF wird erstellt...</div>
  }

  if (instance.error) {
    return <div className="p-4 text-red-500">Fehler: {instance.error}</div>
  }

  if (!instance.url) {
    return <div className="p-4 text-gray-500">PDF wird erstellt...</div>
  }

  return (
    <iframe
      src={instance.url}
      className="w-full h-full border-0"
      title="PDF Vorschau"
    />
  )
}
