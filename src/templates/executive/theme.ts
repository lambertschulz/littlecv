export interface ExecutiveTheme {
  primaryColor: string;
  fontFamily: "Playfair Display" | "Roboto";
  fontSize: "sm" | "md" | "lg";
}

export const executiveDefaultTheme: ExecutiveTheme = {
  primaryColor: "#292524",
  fontFamily: "Playfair Display",
  fontSize: "md",
};

export const executiveThemeSchema = [
  { key: "primaryColor", label: "Hauptfarbe", type: "color" as const },
  {
    key: "fontFamily",
    label: "Schriftart",
    type: "select" as const,
    options: ["Playfair Display", "Roboto"],
  },
  {
    key: "fontSize",
    label: "Schriftgröße",
    type: "select" as const,
    options: ["sm", "md", "lg"],
  },
];
