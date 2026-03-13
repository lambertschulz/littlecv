import type { FC } from "react";
import type { CvData } from "../types/cv";
import { ClassicCoverLetter } from "./classic/ClassicCoverLetter";
import { ClassicCoverPage } from "./classic/ClassicCoverPage";
import { ClassicTemplate } from "./classic/ClassicTemplate";
import { classicDefaultTheme, classicThemeSchema } from "./classic/theme";
import { CompactCoverLetter } from "./compact/CompactCoverLetter";
import { CompactCoverPage } from "./compact/CompactCoverPage";
import { CompactTemplate } from "./compact/CompactTemplate";
import { compactDefaultTheme, compactThemeSchema } from "./compact/theme";
import { CreativeCoverLetter } from "./creative/CreativeCoverLetter";
import { CreativeCoverPage } from "./creative/CreativeCoverPage";
import { CreativeTemplate } from "./creative/CreativeTemplate";
import { creativeDefaultTheme, creativeThemeSchema } from "./creative/theme";
import { ElegantCoverLetter } from "./elegant/ElegantCoverLetter";
import { ElegantCoverPage } from "./elegant/ElegantCoverPage";
import { ElegantTemplate } from "./elegant/ElegantTemplate";
import { elegantDefaultTheme, elegantThemeSchema } from "./elegant/theme";
import { ExecutiveCoverLetter } from "./executive/ExecutiveCoverLetter";
import { ExecutiveCoverPage } from "./executive/ExecutiveCoverPage";
import { ExecutiveTemplate } from "./executive/ExecutiveTemplate";
import { executiveDefaultTheme, executiveThemeSchema } from "./executive/theme";
import { LisaCoverLetter } from "./lisa/LisaCoverLetter";
import { LisaCoverPage } from "./lisa/LisaCoverPage";
import { LisaTemplate } from "./lisa/LisaTemplate";
import { lisaDefaultTheme, lisaThemeSchema } from "./lisa/theme";
import { MinimalistCoverLetter } from "./minimalist/MinimalistCoverLetter";
import { MinimalistCoverPage } from "./minimalist/MinimalistCoverPage";
import { MinimalistTemplate } from "./minimalist/MinimalistTemplate";
import {
  minimalistDefaultTheme,
  minimalistThemeSchema,
} from "./minimalist/theme";
import { ModernCoverLetter } from "./modern/ModernCoverLetter";
import { ModernCoverPage } from "./modern/ModernCoverPage";
import { ModernTemplate } from "./modern/ModernTemplate";
import { modernDefaultTheme, modernThemeSchema } from "./modern/theme";

export type CvTemplate<T extends object = object> = FC<{
  data: CvData;
  theme: T;
}>;

export type CoverLetterTemplate<T extends object = object> = FC<{
  data: CvData;
  theme: T;
}>;

export type CoverPageTemplate<T extends object = object> = FC<{
  data: CvData;
  theme: T;
}>;

export interface ThemeSchemaEntry {
  key: string;
  label: string;
  type: "color" | "select";
  options?: string[];
}

export interface TemplateConfig<T extends object = object> {
  key: string;
  label: string;
  thumbnail: string;
  cv: CvTemplate<T>;
  coverLetter: CoverLetterTemplate<T>;
  coverPage: CoverPageTemplate<T>;
  defaultTheme: T;
  themeSchema: ThemeSchemaEntry[];
}

export const templateRegistry: TemplateConfig[] = [
  {
    key: "modern",
    label: "Modern",
    thumbnail: "/thumbnails/modern.svg",
    cv: ModernTemplate as CvTemplate,
    coverLetter: ModernCoverLetter as CoverLetterTemplate,
    coverPage: ModernCoverPage as CoverPageTemplate,
    defaultTheme: modernDefaultTheme,
    themeSchema: modernThemeSchema,
  },
  {
    key: "classic",
    label: "Klassisch",
    thumbnail: "/thumbnails/classic.svg",
    cv: ClassicTemplate as CvTemplate,
    coverLetter: ClassicCoverLetter as CoverLetterTemplate,
    coverPage: ClassicCoverPage as CoverPageTemplate,
    defaultTheme: classicDefaultTheme,
    themeSchema: classicThemeSchema,
  },
  {
    key: "minimalist",
    label: "Minimalistisch",
    thumbnail: "/thumbnails/minimalist.svg",
    cv: MinimalistTemplate as CvTemplate,
    coverLetter: MinimalistCoverLetter as CoverLetterTemplate,
    coverPage: MinimalistCoverPage as CoverPageTemplate,
    defaultTheme: minimalistDefaultTheme,
    themeSchema: minimalistThemeSchema,
  },
  {
    key: "executive",
    label: "Executive",
    thumbnail: "/thumbnails/executive.svg",
    cv: ExecutiveTemplate as CvTemplate,
    coverLetter: ExecutiveCoverLetter as CoverLetterTemplate,
    coverPage: ExecutiveCoverPage as CoverPageTemplate,
    defaultTheme: executiveDefaultTheme,
    themeSchema: executiveThemeSchema,
  },
  {
    key: "creative",
    label: "Kreativ",
    thumbnail: "/thumbnails/creative.svg",
    cv: CreativeTemplate as CvTemplate,
    coverLetter: CreativeCoverLetter as CoverLetterTemplate,
    coverPage: CreativeCoverPage as CoverPageTemplate,
    defaultTheme: creativeDefaultTheme,
    themeSchema: creativeThemeSchema,
  },
  {
    key: "compact",
    label: "Kompakt",
    thumbnail: "/thumbnails/compact.svg",
    cv: CompactTemplate as CvTemplate,
    coverLetter: CompactCoverLetter as CoverLetterTemplate,
    coverPage: CompactCoverPage as CoverPageTemplate,
    defaultTheme: compactDefaultTheme,
    themeSchema: compactThemeSchema,
  },
  {
    key: "elegant",
    label: "Elegant",
    thumbnail: "/thumbnails/elegant.svg",
    cv: ElegantTemplate as CvTemplate,
    coverLetter: ElegantCoverLetter as CoverLetterTemplate,
    coverPage: ElegantCoverPage as CoverPageTemplate,
    defaultTheme: elegantDefaultTheme,
    themeSchema: elegantThemeSchema,
  },
  {
    key: "lisa",
    label: "Lisa",
    thumbnail: "/thumbnails/lisa.svg",
    cv: LisaTemplate as CvTemplate,
    coverLetter: LisaCoverLetter as CoverLetterTemplate,
    coverPage: LisaCoverPage as CoverPageTemplate,
    defaultTheme: lisaDefaultTheme,
    themeSchema: lisaThemeSchema,
  },
];

export function getTemplate(key: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.key === key);
}
