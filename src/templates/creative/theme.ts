export interface CreativeTheme {
  sidebarColor: string;
  accentColor: string;
  fontFamily: "Inter" | "Roboto";
  fontSize: "sm" | "md" | "lg";
  photoSize: "sm" | "md" | "lg";
  photoShape: "round" | "square" | "rounded";
}

export const creativeDefaultTheme: CreativeTheme = {
  sidebarColor: "#1e293b",
  accentColor: "#f59e0b",
  fontFamily: "Inter",
  fontSize: "md",
  photoSize: "md",
  photoShape: "round",
};

export const creativeThemeSchema = [
  { key: "sidebarColor", label: "Seitenleiste", type: "color" as const },
  { key: "accentColor", label: "Akzentfarbe", type: "color" as const },
  {
    key: "fontFamily",
    label: "Schriftart",
    type: "select" as const,
    options: ["Inter", "Roboto"],
  },
  {
    key: "fontSize",
    label: "Schriftgröße",
    type: "select" as const,
    options: ["sm", "md", "lg"],
  },
  {
    key: "photoSize",
    label: "Fotogröße",
    type: "select" as const,
    options: ["sm", "md", "lg"],
  },
  {
    key: "photoShape",
    label: "Fotoform",
    type: "select" as const,
    options: ["round", "square", "rounded"],
  },
];
