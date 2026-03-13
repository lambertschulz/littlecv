import { Font } from "@react-pdf/renderer";
import InterBold from "./files/Inter-Bold.ttf";
import InterRegular from "./files/Inter-Regular.ttf";
import PlayfairBold from "./files/PlayfairDisplay-Bold.ttf";
import PlayfairRegular from "./files/PlayfairDisplay-Regular.ttf";
import RobotoBold from "./files/Roboto-Bold.ttf";
import RobotoRegular from "./files/Roboto-Regular.ttf";

export function registerBundledFonts() {
  Font.register({
    family: "Inter",
    fonts: [
      { src: InterRegular, fontWeight: "normal" },
      { src: InterBold, fontWeight: "bold" },
    ],
  });

  Font.register({
    family: "Roboto",
    fonts: [
      { src: RobotoRegular, fontWeight: "normal" },
      { src: RobotoBold, fontWeight: "bold" },
    ],
  });

  Font.register({
    family: "Playfair Display",
    fonts: [
      { src: PlayfairRegular, fontWeight: "normal" },
      { src: PlayfairBold, fontWeight: "bold" },
    ],
  });

  // Disable word hyphenation globally
  Font.registerHyphenationCallback((word) => [word]);
}

/**
 * Register a Google Font by family name.
 * Fetches the CSS from Google Fonts API, extracts font file URLs, and registers them.
 */
export async function registerGoogleFont(family: string): Promise<void> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; react-pdf font loader)",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch font "${family}" from Google Fonts`);
  }

  const css = await res.text();

  const fontFaces = css.matchAll(
    /font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)/g,
  );

  const fonts: { src: string; fontWeight: "bold" | "normal" }[] = [];
  for (const match of fontFaces) {
    const weight = match[1] === "700" ? ("bold" as const) : ("normal" as const);
    fonts.push({ src: match[2], fontWeight: weight });
  }

  if (fonts.length === 0) {
    throw new Error(`No font files found for "${family}"`);
  }

  Font.register({ family, fonts });
}
