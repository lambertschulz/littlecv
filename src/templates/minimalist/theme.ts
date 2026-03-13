export interface MinimalistTheme {
  accentColor: string;
  fontFamily: "Inter" | "Roboto";
  fontSize: "sm" | "md" | "lg";
}

export const minimalistDefaultTheme: MinimalistTheme = {
  accentColor: "#111827",
  fontFamily: "Inter",
  fontSize: "md",
};

export const minimalistThemeSchema = [
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
];
