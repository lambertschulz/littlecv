import { TemplateCarousel } from './TemplateCarousel'
import { ThemeEditor } from '@/components/theme/ThemeEditor'
import { FontManager } from '@/components/theme/FontManager'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export function StylePanel() {
  return (
    <div>
      <TemplateCarousel />

      {/* Desktop: inline theme controls */}
      <div className="hidden md:block px-4 pb-4 space-y-6 border-t pt-4">
        <ThemeEditor />
        <FontManager />
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden px-4 pb-4">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" className="w-full">
                Anpassen
              </Button>
            }
          />
          <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Design anpassen</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 p-4">
              <ThemeEditor />
              <FontManager />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
