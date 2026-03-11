export interface CreativeTheme {
  sidebarColor: string
  accentColor: string
  fontFamily: 'Inter' | 'Roboto'
  fontSize: 'sm' | 'md' | 'lg'
}

export const creativeDefaultTheme: CreativeTheme = {
  sidebarColor: '#1e293b',
  accentColor: '#f59e0b',
  fontFamily: 'Inter',
  fontSize: 'md',
}

export const creativeThemeSchema = [
  { key: 'sidebarColor', label: 'Seitenleiste', type: 'color' as const },
  { key: 'accentColor', label: 'Akzentfarbe', type: 'color' as const },
  { key: 'fontFamily', label: 'Schriftart', type: 'select' as const, options: ['Inter', 'Roboto'] },
  { key: 'fontSize', label: 'Schriftgröße', type: 'select' as const, options: ['sm', 'md', 'lg'] },
]
