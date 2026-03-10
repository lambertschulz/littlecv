export interface ModernTheme {
  primaryColor: string
  accentColor: string
  fontFamily: 'Inter' | 'Roboto'
  fontSize: 'sm' | 'md' | 'lg'
}

export const modernDefaultTheme: ModernTheme = {
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'md',
}

export const modernThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'accentColor', label: 'Akzentfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Inter', 'Roboto'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
