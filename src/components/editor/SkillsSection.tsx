import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileSection } from "../../state/useProfileSection";
import type { Skill, SkillSection } from "../../types/cv";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { SortableList } from "../shared/SortableList";

function SkillSectionPanel({
  section,
  onUpdate,
  onRemove,
}: {
  section: SkillSection;
  onUpdate: (s: SkillSection) => void;
  onRemove: () => void;
}) {
  const updateSkill = (index: number, field: string, value: string) => {
    const next = [...section.skills];
    next[index] = { ...next[index], [field]: value };
    onUpdate({ ...section, skills: next });
  };

  const createSkill = (): Skill => ({
    id: crypto.randomUUID(),
    label: "",
  });

  return (
    <CollapsiblePanel
      title={section.name || "Neue Kenntnisse-Kategorie"}
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
          placeholder="Kategorie-Name (z.B. Programmiersprachen, Sprachen, Tools)"
          value={section.name}
          onChange={(e) => onUpdate({ ...section, name: e.target.value })}
        />
      </div>
      <SortableList
        items={section.skills}
        onChange={(skills) => onUpdate({ ...section, skills })}
        createItem={createSkill}
        addLabel="Kenntnis hinzufügen"
        renderItem={(item, i) => (
          <div className="space-y-2 pr-16">
            <Input
              placeholder="Bezeichnung"
              value={item.label}
              onChange={(e) => updateSkill(i, "label", e.target.value)}
            />
            <Input
              placeholder="Level (z.B. Fortgeschritten, 5 Jahre, C1)"
              value={item.level ?? ""}
              onChange={(e) => updateSkill(i, "level", e.target.value)}
            />
          </div>
        )}
      />
    </CollapsiblePanel>
  );
}

export function SkillsSection() {
  const { value, setValue, isOverridden, resetToBase } =
    useProfileSection("skillSections");
  const skillSections = (value as SkillSection[]) ?? [];

  const addSection = () => {
    const newSection: SkillSection = {
      id: crypto.randomUUID(),
      name: "",
      skills: [],
    };
    setValue([...skillSections, newSection]);
  };

  const updateSection = (index: number, section: SkillSection) => {
    const next = [...skillSections];
    next[index] = section;
    setValue(next);
  };

  const removeSection = (index: number) => {
    setValue(skillSections.filter((_, i) => i !== index));
  };

  return (
    <CollapsiblePanel
      title="Kenntnisse"
      overrideStatus={{ isOverridden, onReset: resetToBase }}
    >
      <div className="space-y-0">
        {skillSections.map((section, i) => (
          <SkillSectionPanel
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
          + Kenntnisse-Kategorie hinzufügen
        </Button>
      </div>
    </CollapsiblePanel>
  );
}
