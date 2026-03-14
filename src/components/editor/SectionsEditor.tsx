import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfileSection } from "../../state/useProfileSection";
import type { SectionEntry, TimelineSection } from "../../types/cv";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { SortableList } from "../shared/SortableList";

function SectionPanel({
  section,
  onUpdate,
  onRemove,
}: {
  section: TimelineSection;
  onUpdate: (s: TimelineSection) => void;
  onRemove: () => void;
}) {
  const updateEntry = (index: number, field: string, value: string) => {
    const next = [...section.entries];
    next[index] = { ...next[index], [field]: value };
    onUpdate({ ...section, entries: next });
  };

  const createEntry = (): SectionEntry => ({
    id: crypto.randomUUID(),
    title: "",
    subtitle: "",
    period: "",
  });

  return (
    <CollapsiblePanel
      title={section.name || "Neue Kategorie"}
      actions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-400 hover:text-red-600 text-xs"
        >
          Entfernen
        </Button>
      }
    >
      <div className="mb-3">
        <Input
          placeholder="Kategorie-Name (z.B. Berufserfahrung, Ausbildung, Projekte)"
          value={section.name}
          onChange={(e) => onUpdate({ ...section, name: e.target.value })}
        />
      </div>
      <SortableList
        items={section.entries}
        onChange={(entries) => onUpdate({ ...section, entries })}
        createItem={createEntry}
        addLabel="Eintrag hinzufügen"
        renderItem={(item, i) => (
          <div className="space-y-2 pr-16">
            <Input
              placeholder="Titel (z.B. Position, Abschluss)"
              value={item.title}
              onChange={(e) => updateEntry(i, "title", e.target.value)}
            />
            <Input
              placeholder="Untertitel (z.B. Unternehmen, Institution)"
              value={item.subtitle}
              onChange={(e) => updateEntry(i, "subtitle", e.target.value)}
            />
            <Input
              placeholder="Zeitraum"
              value={item.period}
              onChange={(e) => updateEntry(i, "period", e.target.value)}
            />
            <Textarea
              placeholder="Beschreibung (optional)"
              value={item.description ?? ""}
              rows={3}
              onChange={(e) => updateEntry(i, "description", e.target.value)}
            />
          </div>
        )}
      />
    </CollapsiblePanel>
  );
}

export function SectionsEditor() {
  const { value, setValue, isOverridden, resetToBase } =
    useProfileSection("timeline");
  const timeline = (value as TimelineSection[]) ?? [];

  const addSection = () => {
    const newSection: TimelineSection = {
      id: crypto.randomUUID(),
      name: "",
      entries: [],
    };
    setValue([...timeline, newSection]);
  };

  const updateSection = (index: number, section: TimelineSection) => {
    const next = [...timeline];
    next[index] = section;
    setValue(next);
  };

  const removeSection = (index: number) => {
    setValue(timeline.filter((_, i) => i !== index));
  };

  return (
    <CollapsiblePanel
      title="Lebenslauf"
      overrideStatus={{ isOverridden, onReset: resetToBase }}
    >
      <div className="space-y-0">
        {timeline.map((section, i) => (
          <SectionPanel
            key={section.id}
            section={section}
            onUpdate={(s) => updateSection(i, s)}
            onRemove={() => removeSection(i)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addSection}
          className="w-full border-dashed text-muted-foreground hover:text-foreground"
        >
          + Kategorie hinzufügen
        </Button>
      </div>
    </CollapsiblePanel>
  );
}
