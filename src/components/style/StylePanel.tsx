import { Preview } from "@/components/Preview";
import { FontManager } from "@/components/theme/FontManager";
import { ThemeEditor } from "@/components/theme/ThemeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCarousel } from "./TemplateCarousel";

export function StylePanel() {
  return (
    <div className="min-w-0 overflow-hidden flex flex-col h-full w-full">
      {/* Mobile: compact live preview + sub-tabs */}
      <div className="md:hidden flex flex-col h-full w-full">
        <div className="h-[40vh] border-b bg-muted shrink-0">
          <Preview />
        </div>
        <Tabs
          defaultValue="templates"
          className="flex flex-col flex-1 min-h-0 w-full gap-0 overflow-hidden"
        >
          <TabsList className="shrink-0 w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>
          <TabsContent
            value="templates"
            className="flex-1 overflow-y-auto overflow-x-hidden m-0 w-full"
          >
            <TemplateCarousel />
          </TabsContent>
          <TabsContent
            value="design"
            className="flex-1 overflow-y-auto overflow-x-hidden m-0 p-4 space-y-6 w-full"
          >
            <ThemeEditor />
            <FontManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: everything visible, no sub-tabs */}
      <div className="hidden md:block overflow-y-auto h-full">
        <TemplateCarousel />
        <div className="border-t p-4 space-y-6">
          <ThemeEditor />
          <FontManager />
        </div>
      </div>
    </div>
  );
}
