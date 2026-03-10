import { useMemo } from 'react'
import { Document, PDFViewer } from '@react-pdf/renderer'
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

  if (!pdfDocument) {
    return <div className="p-4 text-gray-500">Kein Template ausgewählt</div>
  }

  return (
    <PDFViewer className="w-full h-full" showToolbar={false}>
      {pdfDocument}
    </PDFViewer>
  )
}
