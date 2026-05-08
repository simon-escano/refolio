import { memo } from "react";
import { ArrowUpDown, Calendar, Tag } from "lucide-react";

export type SortMode = "rank" | "date" | "category";

interface Props {
  active: SortMode;
  onChange: (mode: SortMode) => void;
}

const sortOptions: Array<{ key: SortMode; label: string; icon: typeof ArrowUpDown }> = [
  { key: "rank", label: "Rank", icon: ArrowUpDown },
  { key: "date", label: "Date", icon: Calendar },
  { key: "category", label: "Type", icon: Tag },
];

export const SortBar = memo(function SortBar({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-widest text-(--color-text-muted) mr-1">
        Sort
      </span>
      {sortOptions.map((opt) => {
        const Icon = opt.icon;
        const isActive = active === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-(--color-accent-subtle) text-(--color-accent) shadow-sm"
                : "text-(--color-text-muted) hover:bg-(--color-bg-secondary) hover:text-(--color-text-secondary)"
            }`}
          >
            <Icon className="h-3 w-3" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});
