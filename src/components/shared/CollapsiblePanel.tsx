import { type ReactNode, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface OverrideStatus {
  isOverridden: boolean;
  onReset: () => void;
}

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  actions?: ReactNode;
  overrideStatus?: OverrideStatus;
  children: ReactNode;
}

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  actions,
  overrideStatus,
  children,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b border-gray-200"
    >
      <div className="flex items-center">
        <CollapsibleTrigger className="flex-1 flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50">
          <span className="flex items-center gap-2">
            {title}
            {overrideStatus?.isOverridden && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Angepasst
              </span>
            )}
          </span>
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
            &#9662;
          </span>
        </CollapsibleTrigger>
        {(actions || overrideStatus?.isOverridden) && (
          <div className="pr-2 flex items-center gap-1">
            {overrideStatus?.isOverridden && (
              <button
                type="button"
                onClick={overrideStatus.onReset}
                className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap px-2 py-1 rounded hover:bg-blue-50"
              >
                Zurücksetzen
              </button>
            )}
            {actions}
          </div>
        )}
      </div>
      <CollapsibleContent className="px-4 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}
