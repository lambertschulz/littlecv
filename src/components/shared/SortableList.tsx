import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface SortableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  createItem: () => T;
  addLabel?: string;
}

export function SortableList<T extends { id: string }>({
  items,
  onChange,
  renderItem,
  createItem,
  addLabel = "Hinzufügen",
}: SortableListProps<T>) {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="relative border border-gray-200 rounded-lg p-3"
        >
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={() => move(i, -1)}
              disabled={i === 0}
            >
              &#8593;
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
            >
              &#8595;
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-400 hover:text-red-600"
              onClick={() => remove(i)}
            >
              &#10005;
            </Button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
      <Button
        variant="link"
        className="px-0 text-sm"
        onClick={() => onChange([...items, createItem()])}
      >
        + {addLabel}
      </Button>
    </div>
  );
}
