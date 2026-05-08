export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] py-8 mt-auto relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-5 md:px-16 max-w-[1440px] mx-auto gap-4">
        <div className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)]">
          © 2024 Refolio Studio. Built for Architects of the Digital Age.
        </div>
      </div>
    </footer>
  );
}
