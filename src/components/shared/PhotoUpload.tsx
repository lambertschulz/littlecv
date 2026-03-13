import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3">
      {value && (
        <img
          src={value}
          alt="Foto"
          className="w-16 h-16 rounded object-cover"
        />
      )}
      <div className="flex gap-2">
        <label className="cursor-pointer text-sm text-primary hover:underline">
          {value ? "Ändern" : "Foto hochladen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {value && (
          <Button
            variant="link"
            className="px-0 text-sm text-destructive"
            onClick={() => onChange(undefined)}
          >
            Entfernen
          </Button>
        )}
      </div>
    </div>
  );
}
