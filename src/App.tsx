import { useAtom, useAtomValue } from "jotai";
import { BottomTabBar } from "./components/BottomTabBar";
import { Header } from "./components/Header";
import { MainLayout } from "./components/MainLayout";
import { exportJson, importJson } from "./services/export-json";
import { exportPdf } from "./services/export-pdf";
import {
  activeProfileIdAtom,
  activeTemplateKeyAtom,
  activeThemeAtom,
  attachmentsAtom,
  cvDataAtom,
  effectiveAttachmentsAtom,
  effectiveCvDataAtom,
  effectiveTemplateKeyAtom,
  profilesAtom,
  templateThemesAtom,
} from "./state/atoms";
import { getTemplate } from "./templates/registry";
import type { ExportScope } from "./types/cv";

function App() {
  // Base atoms (for JSON export/import)
  const [baseData, setBaseData] = useAtom(cvDataAtom);
  const [baseTemplateKey, setBaseTemplateKey] = useAtom(activeTemplateKeyAtom);
  const [baseThemes, setBaseThemes] = useAtom(templateThemesAtom);
  const [baseAttachments, setBaseAttachments] = useAtom(attachmentsAtom);
  const [profiles, setProfiles] = useAtom(profilesAtom);
  const [activeProfileId, setActiveProfileId] = useAtom(activeProfileIdAtom);

  // Effective atoms (for PDF export — profile-merged)
  const effectiveData = useAtomValue(effectiveCvDataAtom);
  const effectiveTemplateKey = useAtomValue(effectiveTemplateKeyAtom);
  const effectiveTheme = useAtomValue(activeThemeAtom);
  const effectiveAttachments = useAtomValue(effectiveAttachmentsAtom);

  const handleExportPdf = async (scope: ExportScope) => {
    try {
      const template = getTemplate(effectiveTemplateKey);
      if (template) {
        await exportPdf(
          effectiveData,
          template,
          effectiveTheme,
          scope,
          effectiveAttachments,
        );
      }
    } catch (e) {
      console.error("PDF export failed:", e);
    }
  };

  const handleExportJson = () => {
    exportJson({
      version: 2,
      cvData: baseData,
      activeTemplate: baseTemplateKey,
      templateThemes: baseThemes,
      attachments: baseAttachments,
      profiles,
      activeProfileId,
    });
  };

  const handleImportJson = async () => {
    try {
      const imported = await importJson();
      setBaseData(imported.cvData);
      setBaseTemplateKey(imported.activeTemplate);
      setBaseThemes(imported.templateThemes);
      if (imported.attachments) setBaseAttachments(imported.attachments);
      // V2: restore profiles
      if (imported.profiles) {
        setProfiles(imported.profiles);
        setActiveProfileId(imported.activeProfileId ?? null);
      } else {
        setProfiles([]);
        setActiveProfileId(null);
      }
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
