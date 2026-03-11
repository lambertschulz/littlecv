import { useAtom, useAtomValue } from 'jotai'
import { activeTemplateKeyAtom, activeThemeAtom } from '../../state/atoms'
import { getTemplate } from '../../templates/registry'

export function ThemeEditor() {
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const [theme, setTheme] = useAtom(activeThemeAtom)
  const template = getTemplate(templateKey)

  if (!template) return null

  const updateField = (key: string, value: string) => {
    setTheme({ ...theme, [key]: value })
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex flex-wrap gap-4 items-end">
        {template.themeSchema.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              {field.label}
            </label>
            {field.type === 'color' ? (
              <input
                type="color"
                value={(theme as Record<string, string>)[field.key] ?? '#000000'}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
              />
            ) : (
              <select
                value={(theme as Record<string, string>)[field.key] ?? ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
