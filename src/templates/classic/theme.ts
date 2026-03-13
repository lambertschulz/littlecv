export interface ClassicTheme {
  primaryColor: string;
  fontFamily: "Playfair Display" | "Roboto";
  headerStyle: "underline" | "block";
  fontSize: "sm" | "md" | "lg";
  photoSize: "sm" | "md" | "lg";
  photoShape: "round" | "square" | "rounded";
}

export const classicDefaultTheme: ClassicTheme = {
  primaryColor: "#1e3a5f",
  fontFamily: "Playfair Display",
  headerStyle: "underline",
  fontSize: "md",
  photoSize: "md",
  photoShape: "round",
};

export const classicThemeSchema = [
  { key: "primaryColor", label: "Hauptfarbe", type: "color" as const },
  {
    key: "fontFamily",
    label: "Schriftart",
    type: "select" as const,
    options: ["Playfair Display", "Roboto"],
  },
  {
    key: "headerStyle",
    label: "Überschrift-Stil",
    type: "select" as const,
    options: ["underline", "block"],
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
