import { useState } from 'react'
import { useAtom } from 'jotai'
import { customFontsAtom } from '@/state/atoms'
import { registerGoogleFont } from '@/fonts/register'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-3">Google Fonts hinzufügen</p>
      <div className="flex gap-2 items-center">
        <Input
          className="flex-1 text-sm h-8"
          placeholder="Font-Name (z.B. Lato)"
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? '...' : 'Hinzufügen'}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      {fonts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {fonts.map((f, i) => (
            <span
              key={f.family}
              className="text-xs bg-muted border rounded px-2 py-1 flex items-center gap-1"
            >
              {f.family}
              <button
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(i)}
                aria-label={`${f.family} entfernen`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
