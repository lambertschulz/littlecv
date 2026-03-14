import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExportScope } from "@/types/cv";

interface HeaderProps {
  onExportPdf: (scope: ExportScope) => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

export function Header({
  onExportPdf,
  onExportJson,
  onImportJson,
}: HeaderProps) {
  return (
    <header className="h-14 border-b flex items-center px-4 shrink-0 justify-between bg-background">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold">
          <span className="hidden sm:inline">Bewerbungsmappe</span>
          <span className="sm:hidden">Bewerbung</span>
        </h1>
        <ProfileSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExportJson}>
          Speichern
        </Button>
        <Button variant="outline" size="sm" onClick={onImportJson}>
          Laden
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-8 px-3 cursor-pointer">
            Exportieren ▾
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExportPdf("all")}>
              PDF – Alles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf("cv")}>
              PDF – Nur Lebenslauf
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf("coverLetter")}>
              PDF – Nur Anschreiben
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf("coverPage")}>
              PDF – Nur Deckblatt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
