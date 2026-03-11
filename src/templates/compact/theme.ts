export interface CompactTheme {
  primaryColor: string
  fontFamily: 'Inter' | 'Roboto'
  fontSize: 'sm' | 'md' | 'lg'
}

export const compactDefaultTheme: CompactTheme = {
  primaryColor: '#059669',
  fontFamily: 'Inter',
  fontSize: 'md',
}

export const compactThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Inter', 'Roboto'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
