import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileSection } from "../../state/useProfileSection";
import type { CoverPage } from "../../types/cv";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";

export function CoverPageSection() {
  const { value, setValue, isOverridden, resetToBase } =
    useProfileSection("coverPage");
  const coverPage = value as CoverPage | undefined;

  const activate = () => {
    const defaultCoverPage: CoverPage = {
      company: "",
      position: "",
      date: new Date().toLocaleDateString("de-DE"),
    };
    setValue(defaultCoverPage);
  };

  const deactivate = () => {
    setValue(undefined);
  };

  const update = (field: string, val: string) => {
    if (!coverPage) return;
    setValue({ ...coverPage, [field]: val });
  };

  return (
    <CollapsiblePanel
      title="Deckblatt"
      overrideStatus={{ isOverridden, onReset: resetToBase }}
    >
      {!coverPage ? (
        <Button variant="link" className="px-0 text-sm" onClick={activate}>
          Deckblatt aktivieren
        </Button>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="Unternehmen"
            value={coverPage.company}
            onChange={(e) => update("company", e.target.value)}
          />
          <Input
            placeholder="Position"
            value={coverPage.position}
            onChange={(e) => update("position", e.target.value)}
          />
          <Input
            placeholder="Datum"
            value={coverPage.date}
            onChange={(e) => update("date", e.target.value)}
          />
          <Button
            variant="link"
            className="px-0 text-sm text-destructive"
            onClick={deactivate}
          >
            Deaktivieren
          </Button>
        </div>
      )}
    </CollapsiblePanel>
  );
}
