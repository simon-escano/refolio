import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../lib/theme";

const themeOptions = [
  { value: "light" as const, icon: Sun },
  { value: "system" as const, icon: Monitor },
  { value: "dark" as const, icon: Moon },
];

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/90 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(25,28,24,0.1)] border-b border-[var(--color-outline-variant)]/30">
      <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-[1440px] mx-auto h-[72px]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="text-[var(--color-primary)] text-2xl">⬡</span>
          <span className="text-xl font-bold tracking-tight text-[var(--color-primary)]" style={{ fontFamily: "var(--font-sans)" }}>
            Refolio
          </span>
          <span className="stamp-badge ml-3 hidden sm:inline-block">
            BETA
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-1.5 rounded-lg transition-all duration-200 active:scale-90 ${
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] opacity-60 hover:opacity-100"
                }`}
                title={option.value.charAt(0).toUpperCase() + option.value.slice(1)}
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
