import { FileText, Image, Layout, Palette, Paperclip, Save } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onStart: () => void;
}

const features = [
  {
    icon: FileText,
    title: "Lebenslauf",
    desc: "Berufserfahrung, Ausbildung, Kenntnisse und mehr übersichtlich erfassen.",
  },
  {
    icon: Layout,
    title: "Deckblatt & Anschreiben",
    desc: "Optionales Deckblatt und Anschreiben für die komplette Bewerbungsmappe.",
  },
  {
    icon: Palette,
    title: "Vorlagen & Design",
    desc: "Verschiedene Vorlagen mit anpassbaren Farben, Schriften und Layouts.",
  },
  {
    icon: Paperclip,
    title: "Anlagen",
    desc: "Zeugnisse, Zertifikate und Referenzen als Bilder oder PDFs anhängen.",
  },
  {
    icon: Save,
    title: "Speichern & Laden",
    desc: "Daten lokal im Browser speichern oder als JSON-Datei exportieren.",
  },
  {
    icon: Image,
    title: "PDF-Export",
    desc: "Alles als eine PDF-Datei exportieren — inklusive aller Anlagen.",
  },
];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Bewerbungsmappe
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Erstelle deine komplette Bewerbung direkt im Browser — kostenlos,
            ohne Anmeldung, komplett lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-3 p-4 rounded-lg border bg-card"
            >
              <f.icon className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-sm">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={onStart}>
            Los geht's
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Alle Daten bleiben auf deinem Gerät. Es werden keine Daten an einen
          Server gesendet.
        </p>
      </div>
    </div>
  );
}
