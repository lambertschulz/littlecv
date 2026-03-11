export interface ClassicTheme {
  primaryColor: string
  fontFamily: 'Playfair Display' | 'Roboto'
  headerStyle: 'underline' | 'block'
  fontSize: 'sm' | 'md' | 'lg'
}

export const classicDefaultTheme: ClassicTheme = {
  primaryColor: '#1e3a5f',
  fontFamily: 'Playfair Display',
  headerStyle: 'underline',
  fontSize: 'md',
}

export const classicThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Playfair Display', 'Roboto'] },
  { key: 'headerStyle', label: 'Überschrift-Stil', type: 'select' as const, options: ['underline', 'block'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
