import { useAtomValue } from "jotai";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { Preview } from "@/components/Preview";
import { StylePanel } from "@/components/style/StylePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activeViewAtom } from "@/state/atoms";

export function MainLayout() {
  const activeView = useAtomValue(activeViewAtom);

  return (
    <div className="flex-1 overflow-hidden">
      {/* Desktop: side-by-side with tabs on left */}
      <div className="hidden md:flex h-full overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r flex flex-col">
          <Tabs defaultValue="editor" className="flex flex-col flex-1">
            <TabsList className="shrink-0 w-full justify-start rounded-none border-b px-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 overflow-y-auto m-0">
              <EditorPanel />
            </TabsContent>
            <TabsContent
              value="style"
              className="flex-1 overflow-y-auto m-0 min-w-0"
            >
              <StylePanel />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/2 overflow-y-auto bg-muted">
          <Preview />
        </div>
      </div>

      {/* Mobile: single panel driven by activeViewAtom */}
      <div className="md:hidden h-full w-full overflow-y-auto overflow-x-hidden pb-14">
        {activeView === "editor" && <EditorPanel />}
        {activeView === "style" && <StylePanel />}
        {activeView === "preview" && <Preview />}
      </div>
    </div>
  );
}
