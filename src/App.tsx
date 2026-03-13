import { useAtom, useAtomValue } from "jotai";
import { BottomTabBar } from "./components/BottomTabBar";
import { Header } from "./components/Header";
import { MainLayout } from "./components/MainLayout";
import { exportJson, importJson } from "./services/export-json";
import { exportPdf } from "./services/export-pdf";
import {
  activeTemplateKeyAtom,
  activeThemeAtom,
  cvDataAtom,
  templateThemesAtom,
} from "./state/atoms";
import { getTemplate } from "./templates/registry";
import type { ExportScope } from "./types/cv";

function App() {
  const [data, setData] = useAtom(cvDataAtom);
  const [templateKey, setTemplateKey] = useAtom(activeTemplateKeyAtom);
  const theme = useAtomValue(activeThemeAtom);
  const [themes, setThemes] = useAtom(templateThemesAtom);

  const handleExportPdf = async (scope: ExportScope) => {
    try {
      const template = getTemplate(templateKey);
      if (template) {
        await exportPdf(data, template, theme, scope);
      }
    } catch (e) {
      console.error("PDF export failed:", e);
    }
  };

  const handleExportJson = () => {
    exportJson({
      cvData: data,
      activeTemplate: templateKey,
      templateThemes: themes,
    });
  };

  const handleImportJson = async () => {
    try {
      const imported = await importJson();
      setData(imported.cvData);
      setTemplateKey(imported.activeTemplate);
      setThemes(imported.templateThemes);
    } catch (e) {
      console.error("Import failed:", e);
    }
  };

  return (
    <div className="flex flex-col h-dvh">
      <Header
        onExportPdf={handleExportPdf}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />
      <MainLayout />
      <BottomTabBar />
    </div>
  );
}

export default App;
