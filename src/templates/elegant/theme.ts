export interface ElegantTheme {
  primaryColor: string
  accentColor: string
  fontFamily: 'Playfair Display' | 'Inter'
  fontSize: 'sm' | 'md' | 'lg'
}

export const elegantDefaultTheme: ElegantTheme = {
  primaryColor: '#7c3aed',
  accentColor: '#a78bfa',
  fontFamily: 'Playfair Display',
  fontSize: 'md',
}

export const elegantThemeSchema = [
  { key: 'primaryColor', label: 'Hauptfarbe', type: 'color' as const },
  { key: 'accentColor', label: 'Akzentfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Playfair Display', 'Inter'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
