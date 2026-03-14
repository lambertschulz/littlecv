import { ArrowDown, ArrowUp, FileText, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useProfileSection } from "../../state/useProfileSection";
import type { Attachment } from "../../types/cv";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function AttachmentsSection() {
  const { value, setValue, isOverridden, resetToBase } =
    useProfileSection("attachments");
  const attachments = (value as Attachment[]) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        const newAtt: Attachment = {
          id: crypto.randomUUID(),
          label: file.name.replace(/\.[^.]+$/, ""),
          dataUrl: reader.result as string,
          mimeType: file.type,
        };
        setValue([...attachments, newAtt]);
      };
      reader.readAsDataURL(file);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (id: string) => {
    setValue(attachments.filter((a) => a.id !== id));
  };

  const updateLabel = (id: string, label: string) => {
    setValue(attachments.map((a) => (a.id === id ? { ...a, label } : a)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= attachments.length) return;
    const next = [...attachments];
    [next[index], next[target]] = [next[target], next[index]];
    setValue(next);
  };

  const title =
    attachments.length > 0 ? `Anlagen (${attachments.length})` : "Anlagen";

  return (
    <CollapsiblePanel
      title={title}
      overrideStatus={{ isOverridden, onReset: resetToBase }}
    >
      <div className="space-y-3">
        {attachments.map((att, i) => (
          <div key={att.id} className="flex items-center gap-2">
            {att.mimeType.startsWith("image/") ? (
              <img
                src={att.dataUrl}
                alt={att.label}
                className="w-10 h-14 object-cover rounded border shrink-0"
              />
            ) : (
              <div className="w-10 h-14 rounded border flex items-center justify-center bg-muted shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <Input
              value={att.label}
              onChange={(e) => updateLabel(att.id, e.target.value)}
              className="flex-1 text-sm"
            />
            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => move(i, 1)}
                disabled={i === attachments.length - 1}
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => remove(att.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => inputRef.current?.click()}
        >
          Anlage hinzufügen
        </Button>
      </div>
    </CollapsiblePanel>
  );
}
