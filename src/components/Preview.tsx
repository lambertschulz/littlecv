import { useState, useEffect, useMemo, useCallback, createElement } from 'react'
import { Document, pdf } from '@react-pdf/renderer'
import { useAtomValue } from 'jotai'
import { cvDataAtom, activeTemplateKeyAtom, activeThemeAtom } from '../state/atoms'
import { getTemplate } from '../templates/registry'

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function Preview() {
  const data = useAtomValue(cvDataAtom)
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)

  // Debounce all inputs so PDF only regenerates after typing stops
  const debouncedData = useDebounced(data, 600)
  const debouncedTheme = useDebounced(theme, 600)
  const debouncedTemplateKey = useDebounced(templateKey, 600)

  const template = getTemplate(debouncedTemplateKey)

  const documentEl = useMemo(() => {
    if (!template) return null
    const pages = []
    if (debouncedData.coverPage) {
      pages.push(createElement(template.coverPage, { data: debouncedData, theme: debouncedTheme, key: 'cp' }))
    }
    if (debouncedData.coverLetter) {
      pages.push(createElement(template.coverLetter, { data: debouncedData, theme: debouncedTheme, key: 'cl' }))
    }
    pages.push(createElement(template.cv, { data: debouncedData, theme: debouncedTheme, key: 'cv' }))
    return createElement(Document, {}, ...pages)
  }, [debouncedData, debouncedTheme, template, debouncedTemplateKey])

  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Generate blob only when debounced document changes
  useEffect(() => {
    if (!documentEl) return
    let cancelled = false

    const instance = pdf()
    instance.updateContainer(documentEl)
    instance
      .toBlob()
      .then((blob) => {
        if (cancelled) return
        const newUrl = URL.createObjectURL(blob)
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return newUrl
        })
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      cancelled = true
    }
  }, [documentEl])

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  if (error) {
    return <div className="p-4 text-red-500">Fehler: {error}</div>
  }

  if (!url) {
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
