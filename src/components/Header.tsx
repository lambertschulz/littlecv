import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ExportScope } from '@/types/cv'

interface HeaderProps {
  onExportPdf: (scope: ExportScope) => void
  onExportJson: () => void
  onImportJson: () => void
}

export function Header({ onExportPdf, onExportJson, onImportJson }: HeaderProps) {
  return (
    <header className="h-14 border-b flex items-center px-4 shrink-0 justify-between bg-background">
      <h1 className="text-lg font-bold">Bewerbungsmappe</h1>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background h-9 px-3 hover:bg-accent hover:text-accent-foreground"
        >
          Exportieren ▾
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onExportPdf('all')}>
            PDF – Alles
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExportPdf('cv')}>
            PDF – Nur Lebenslauf
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExportPdf('coverLetter')}>
            PDF – Nur Anschreiben
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExportPdf('coverPage')}>
            PDF – Nur Deckblatt
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onExportJson}>
            JSON Speichern
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onImportJson}>
            JSON Laden
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
