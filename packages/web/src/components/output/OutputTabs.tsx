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
    <div className="flex items-center gap-1 rounded-xl bg-(--color-bg-secondary)/60 border border-(--color-border)/50 p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              isActive
                ? "bg-(--color-surface) text-(--color-text) shadow-sm"
                : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
            }`}
          >
            <Icon className={`h-3 w-3 ${isActive ? "text-(--color-accent)" : ""}`} />
            {tab.label}
            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-(--color-accent) animate-scale-in" />
            )}
          </button>
        );
      })}
    </div>
  );
});
