import { useAtom, useAtomValue } from 'jotai'
import {
  cvDataAtom,
  activeTemplateKeyAtom,
  activeThemeAtom,
  templateThemesAtom,
} from './state/atoms'
import { getTemplate } from './templates/registry'
import { Header } from './components/Header'
import { MainLayout } from './components/MainLayout'
import { BottomTabBar } from './components/BottomTabBar'
import { exportPdf } from './services/export-pdf'
import { exportJson, importJson } from './services/export-json'
import type { ExportScope } from './types/cv'

function App() {
  const [data, setData] = useAtom(cvDataAtom)
  const [templateKey, setTemplateKey] = useAtom(activeTemplateKeyAtom)
  const theme = useAtomValue(activeThemeAtom)
  const [themes, setThemes] = useAtom(templateThemesAtom)

  const handleExportPdf = async (scope: ExportScope) => {
    const template = getTemplate(templateKey)
    if (template) {
      await exportPdf(data, template, theme, scope)
    }
  }

  const handleExportJson = () => {
    exportJson({
      cvData: data,
      activeTemplate: templateKey,
      templateThemes: themes,
    })
  }

  const handleImportJson = async () => {
    try {
      const imported = await importJson()
      setData(imported.cvData)
      setTemplateKey(imported.activeTemplate)
      setThemes(imported.templateThemes)
    } catch (e) {
      console.error('Import failed:', e)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        onExportPdf={handleExportPdf}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />
      <MainLayout />
      <BottomTabBar />
    </div>
  )
}

export default App
