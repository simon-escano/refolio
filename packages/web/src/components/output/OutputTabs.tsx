import { memo } from "react";
import { Eye, Code2 } from "lucide-react";

type TabKey = "preview" | "json";

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export const OutputTabs = memo(function OutputTabs({ active, onChange }: Props) {
  const tabs: Array<{ key: TabKey; label: string; icon: typeof Eye }> = [
    { key: "preview", label: "Preview", icon: Eye },
    { key: "json", label: "JSON", icon: Code2 },
  ];

  return (
    <div className="bg-[var(--color-surface-container)] rounded-t-xl border-b border-[var(--color-outline-variant)] p-2 flex justify-between items-center level-1 relative z-20">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              <Icon className="h-[14px] w-[14px]" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
