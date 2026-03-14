import { useAtomValue } from "jotai";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { effectiveCvDataAtom } from "@/state/atoms";
import { useProfileSection } from "@/state/useProfileSection";
import { getTemplate } from "@/templates/registry";
import { PhotoCropper } from "./PhotoCropper";

export function ThemeEditor() {
  const { value: templateKey } = useProfileSection("activeTemplate");
  const { value: themes, setValue: setThemes } =
    useProfileSection("templateThemes");
  const cvData = useAtomValue(effectiveCvDataAtom);
  const template = getTemplate(templateKey as string);
  const themesMap = themes as Record<string, object>;
  const theme = themesMap[templateKey as string] ?? {};

  if (!template) return null;

  // Merge stored theme with defaults so new keys always have values
  const mergedTheme = { ...template.defaultTheme, ...theme } as Record<
    string,
    string
  >;

  const setTheme = (newTheme: object) => {
    setThemes({ ...themesMap, [templateKey as string]: newTheme });
  };

  const updateField = (key: string, value: string) => {
    setTheme({ ...mergedTheme, [key]: value });
  };

  const hasPhotoSettings = template.themeSchema.some(
    (f) => f.key === "photoShape",
  );
  const rawPhoto = cvData.profile.photo;

  return (
    <div className="w-full overflow-hidden space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Design</p>
        <div className="flex flex-wrap gap-4 items-end w-full">
          {template.themeSchema.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label className="text-xs">{field.label}</Label>
              {field.type === "color" ? (
                <input
                  type="color"
                  value={mergedTheme[field.key] ?? "#000000"}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-10 h-8 rounded border border-input cursor-pointer"
                />
              ) : (
                <Select
                  value={mergedTheme[field.key] ?? ""}
                  onValueChange={(value) =>
                    value && updateField(field.key, value)
                  }
                >
                  <SelectTrigger className="min-w-28 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      </div>

      {hasPhotoSettings && rawPhoto && (
        <PhotoCropper
          rawPhoto={rawPhoto}
          croppedPhoto={mergedTheme.croppedPhoto || undefined}
          photoShape={
            (mergedTheme.photoShape as "round" | "square" | "rounded") ??
            "round"
          }
          onCropDone={(base64) =>
            setTheme({ ...mergedTheme, croppedPhoto: base64 })
          }
          onCropClear={() => {
            const { croppedPhoto: _, ...rest } = mergedTheme;
            setTheme(rest);
          }}
        />
      )}
    </div>
  );
}
