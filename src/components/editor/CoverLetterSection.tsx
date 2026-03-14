import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfileSection } from "../../state/useProfileSection";
import type { CoverLetter } from "../../types/cv";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";

export function CoverLetterSection() {
  const { value, setValue, isOverridden, resetToBase } =
    useProfileSection("coverLetter");
  const coverLetter = value as CoverLetter | undefined;

  const activate = () => {
    const defaultCoverLetter: CoverLetter = {
      recipient: "",
      body: "",
      date: new Date().toLocaleDateString("de-DE"),
    };
    setValue(defaultCoverLetter);
  };

  const deactivate = () => {
    setValue(undefined);
  };

  const update = (field: string, val: string) => {
    if (!coverLetter) return;
    setValue({ ...coverLetter, [field]: val });
  };

  return (
    <CollapsiblePanel
      title="Anschreiben"
      overrideStatus={{ isOverridden, onReset: resetToBase }}
    >
      {!coverLetter ? (
        <Button variant="link" className="px-0 text-sm" onClick={activate}>
          Anschreiben aktivieren
        </Button>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="Empfänger"
            value={coverLetter.recipient}
            onChange={(e) => update("recipient", e.target.value)}
          />
          <Textarea
            placeholder="Empfängeradresse (optional, mehrzeilig)"
            rows={2}
            value={coverLetter.recipientAddress ?? ""}
            onChange={(e) => update("recipientAddress", e.target.value)}
          />
          <Input
            placeholder="Betreff (optional)"
            value={coverLetter.subject ?? ""}
            onChange={(e) => update("subject", e.target.value)}
          />
          <Input
            placeholder="Datum"
            value={coverLetter.date}
            onChange={(e) => update("date", e.target.value)}
          />
          <Textarea
            placeholder="Anschreiben-Text"
            value={coverLetter.body}
            rows={10}
            onChange={(e) => update("body", e.target.value)}
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
