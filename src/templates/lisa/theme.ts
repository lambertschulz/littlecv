export interface LisaTheme {
  primaryColor: string
  fontFamily: 'Playfair Display' | 'Roboto'
  fontSize: 'sm' | 'md' | 'lg'
}

export const lisaDefaultTheme: LisaTheme = {
  primaryColor: '#1e3a5f',
  fontFamily: 'Playfair Display',
  fontSize: 'md',
}

export const lisaThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Playfair Display', 'Roboto'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
