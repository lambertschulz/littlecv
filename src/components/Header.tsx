import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { ExportScope } from '@/types/cv'

interface HeaderProps {
  onExportPdf: (scope: ExportScope) => void
  onExportJson: () => void
  onImportJson: () => void
}

export function Header({ onExportPdf, onExportJson, onImportJson }: HeaderProps) {
  return (
    <header className="h-14 border-b flex items-center px-4 shrink-0 justify-between bg-background">
      <h1 className="text-lg font-bold">
        <span className="hidden sm:inline">Bewerbungsmappe</span>
        <span className="sm:hidden">Bewerbung</span>
      </h1>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExportJson}>
          Speichern
        </Button>
        <Button variant="outline" size="sm" onClick={onImportJson}>
          Laden
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Exportieren ▾
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExportPdf('all')}>
              PDF – Alles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf('cv')}>
              PDF – Nur Lebenslauf
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf('coverLetter')}>
              PDF – Nur Anschreiben
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportPdf('coverPage')}>
              PDF – Nur Deckblatt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
