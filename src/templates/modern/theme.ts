export interface ModernTheme {
  primaryColor: string
  accentColor: string
  fontFamily: 'Inter' | 'Roboto'
  fontSize: 'sm' | 'md' | 'lg'
  photoSize: 'sm' | 'md' | 'lg'
  photoShape: 'round' | 'square' | 'rounded'
}

export const modernDefaultTheme: ModernTheme = {
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'md',
  photoSize: 'md',
  photoShape: 'round',
}

export const modernThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'accentColor', label: 'Akzentfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Inter', 'Roboto'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
  { key: 'photoSize', label: 'Fotogröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
  { key: 'photoShape', label: 'Fotoform', type: 'select' as const, options: ['round', 'square', 'rounded'] },
]
