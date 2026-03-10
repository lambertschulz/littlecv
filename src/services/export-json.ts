import type { CvData } from '../types/cv'

interface SaveData {
  cvData: CvData
  activeTemplate: string
  templateThemes: Record<string, object>
}

export function exportJson(data: SaveData): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bewerbung-daten.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importJson(): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return reject(new Error('No file selected'))
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as SaveData
          resolve(data)
        } catch {
          reject(new Error('Invalid JSON file'))
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })
}
