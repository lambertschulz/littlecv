import { useEffect, useState, useMemo, createElement } from 'react'
import { Document, Page, Text, View, pdf } from '@react-pdf/renderer'
import { useAtomValue } from 'jotai'
import { cvDataAtom, activeTemplateKeyAtom, activeThemeAtom } from '../state/atoms'
import { getTemplate } from '../templates/registry'

// Minimal test document to verify pdf() works at all
function createTestDoc() {
  return createElement(
    Document,
    {},
    createElement(
      Page,
      { size: 'A4' },
      createElement(
        View,
        { style: { padding: 40 } },
        createElement(Text, {}, 'Bewerbungsmappe - PDF Test')
      )
    )
  )
}

function createFullDoc(
  data: ReturnType<typeof useAtomValue<typeof cvDataAtom>>,
  template: NonNullable<ReturnType<typeof getTemplate>>,
  theme: object
) {
  const pages = []
  if (data.coverPage) {
    pages.push(createElement(template.coverPage, { data, theme, key: 'cp' }))
  }
  if (data.coverLetter) {
    pages.push(createElement(template.coverLetter, { data, theme, key: 'cl' }))
  }
  pages.push(createElement(template.cv, { data, theme, key: 'cv' }))
  return createElement(Document, {}, ...pages)
}

export function Preview() {
  const data = useAtomValue(cvDataAtom)
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const template = getTemplate(templateKey)

  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const documentElement = useMemo(() => {
    if (!template) return createTestDoc()
    try {
      return createFullDoc(data, template, theme)
    } catch {
      // If template construction fails, fall back to test doc
      return createTestDoc()
    }
  }, [data, template, theme])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // Create a fresh pdf instance each time
    const instance = pdf()
    instance.updateContainer(documentElement)
    instance
      .toBlob()
      .then((blob) => {
        if (cancelled) return
        const newUrl = URL.createObjectURL(blob)
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return newUrl
        })
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [documentElement])

  if (error) {
    return <div className="p-4 text-red-500">Fehler: {error}</div>
  }

  if (loading || !url) {
    return <div className="p-4 text-gray-500">PDF wird erstellt...</div>
  }

  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      title="PDF Vorschau"
    />
  )
}
