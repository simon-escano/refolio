import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Hexagon, ChevronDown } from "lucide-react";
import { useTheme } from "../../lib/theme";

const themeOptions = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const current = themeOptions.find((o) => o.value === theme)!;
  const CurrentIcon = current.icon;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border)/20 bg-(--color-bg)/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 text-white shadow-sm shadow-teal-500/20">
            <Hexagon className="h-3.5 w-3.5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-(--color-text)">
            Monofolio
          </span>
          <span className="hidden sm:inline rounded-md bg-(--color-accent-subtle) px-1.5 py-0.5 text-[9px] font-semibold text-(--color-accent) uppercase tracking-wider">
            beta
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-xl border border-(--color-border) px-3 py-1.5 text-sm text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-secondary) hover:text-(--color-text)"
          >
            <CurrentIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{current.label}</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-1.5 w-36 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-xl animate-scale-in">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => { setTheme(option.value); setOpen(false); }}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-(--color-accent-subtle) text-(--color-accent) font-medium"
                        : "text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-(--color-text)"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
