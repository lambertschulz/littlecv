import { useEffect, useState, useMemo } from 'react'
import { Document, pdf } from '@react-pdf/renderer'
import { useAtomValue } from 'jotai'
import { cvDataAtom, activeTemplateKeyAtom, activeThemeAtom } from '../state/atoms'
import { getTemplate } from '../templates/registry'
import { createElement } from 'react'

export function Preview() {
  const data = useAtomValue(cvDataAtom)
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const template = getTemplate(templateKey)

  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Build document element outside of React's reconciler
  const documentElement = useMemo(() => {
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
  }, [data, template, theme])

  useEffect(() => {
    if (!documentElement) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    pdf(documentElement)
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

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  if (!template) {
    return <div className="p-4 text-gray-500">Kein Template ausgewählt</div>
  }

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
