import { useAtom, useAtomValue } from 'jotai'
import { activeTemplateKeyAtom, activeThemeAtom } from '@/state/atoms'
import { getTemplate } from '@/templates/registry'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ThemeEditor() {
  const templateKey = useAtomValue(activeTemplateKeyAtom)
  const [theme, setTheme] = useAtom(activeThemeAtom)
  const template = getTemplate(templateKey)

  if (!template) return null

  const updateField = (key: string, value: string) => {
    setTheme({ ...theme, [key]: value })
  }

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-3">Design</p>
      <div className="flex flex-wrap gap-4 items-end">
        {template.themeSchema.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label className="text-xs">{field.label}</Label>
            {field.type === 'color' ? (
              <input
                type="color"
                value={(theme as Record<string, string>)[field.key] ?? '#000000'}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="w-10 h-8 rounded border border-input cursor-pointer"
              />
            ) : (
              <Select
                value={(theme as Record<string, string>)[field.key] ?? ''}
                onValueChange={(value) => value && updateField(field.key, value)}
              >
                <SelectTrigger className="min-w-28 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
