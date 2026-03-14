import type {
  Attachment,
  CvData,
  SkillSection,
  UserProfile,
} from "../types/cv";
import { saveBlob } from "./save-blob";

export interface SaveData {
  version?: number;
  cvData: CvData;
  activeTemplate: string;
  templateThemes: Record<string, object>;
  attachments?: Attachment[];
  profiles?: UserProfile[];
  activeProfileId?: string | null;
}

function migrateCvData(raw: Record<string, unknown>): CvData {
  if ("sections" in raw && !("timeline" in raw)) {
    raw.timeline = raw.sections;
    delete raw.sections;
  }
  if ("skills" in raw && !("skillSections" in raw)) {
    const skills = raw.skills as {
      id: string;
      label: string;
      level?: string;
    }[];
    if (Array.isArray(skills) && skills.length > 0) {
      const section: SkillSection = {
        id: crypto.randomUUID(),
        name: "Kenntnisse",
        skills,
      };
      raw.skillSections = [section];
    } else {
      raw.skillSections = [];
    }
    delete raw.skills;
  }
  return raw as unknown as CvData;
}

export async function exportJson(data: SaveData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  await saveBlob(blob, "bewerbung-daten.json", "application/json", "JSON");
}

export function importJson(): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error("No file selected"));
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as SaveData;
          if (data.cvData) {
            data.cvData = migrateCvData(
              data.cvData as unknown as Record<string, unknown>,
            );
          }
          resolve(data);
        } catch {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
