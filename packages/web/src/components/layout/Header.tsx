import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../lib/theme";

const themeOptions = [
  { value: "light" as const, icon: Sun },
  { value: "system" as const, icon: Monitor },
  { value: "dark" as const, icon: Moon },
];

const navLinks = [
  { label: "Drafts", href: "#", active: false },
  { label: "Templates", href: "#", active: false },
  { label: "Analytics", href: "#", active: false },
  { label: "Settings", href: "#", active: true },
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

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-mono text-xs font-bold tracking-[0.1em] uppercase transition-opacity duration-300 hover:opacity-80 active:scale-95 ${
                link.active
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1"
                  : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

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
          {/* Avatar Placeholder */}
          <div className="w-9 h-9 rounded-full border-2 border-[var(--color-surface-variant)] bg-[var(--color-surface-container)] flex items-center justify-center ml-1">
            <span className="text-xs font-bold text-[var(--color-on-surface-variant)]">
              ✦
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
