import { useState } from 'react'
import { useAtom } from 'jotai'
import { customFontsAtom } from '../../state/atoms'
import { registerGoogleFont } from '../../fonts/register'

export function FontManager() {
  const [fonts, setFonts] = useAtom(customFontsAtom)
  const [family, setFamily] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!family.trim()) return
    setLoading(true)
    setError('')
    try {
      await registerGoogleFont(family.trim())
      setFonts((prev) => [...prev, { family: family.trim(), url: '' }])
      setFamily('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden der Schriftart')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (index: number) => {
    setFonts((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium text-gray-600 mb-2">Google Fonts hinzufügen</p>
      <div className="flex gap-2 items-center">
        <input
          className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
          placeholder="Font-Name (z.B. Lato)"
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          className="text-sm px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? '...' : 'Hinzufügen'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {fonts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {fonts.map((f, i) => (
            <span key={f.family} className="text-xs bg-white border rounded px-2 py-1 flex items-center gap-1">
              {f.family}
              <button className="text-red-400 hover:text-red-600" onClick={() => handleRemove(i)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
