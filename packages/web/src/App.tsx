import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-grid-pattern bg-(--color-bg)">
      <Header />

      <main className="flex-1 relative">
        {/* Soft Ambient Hero Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-7xl rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.015] blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 px-3 py-1 text-xs text-zinc-500 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              <span className="font-medium uppercase tracking-wider text-[10px]">
                Master Portfolio Orchestrator
              </span>
            </div>

            <h1 className="max-w-3xl mx-auto text-5xl sm:text-6xl font-light tracking-tight text-(--color-text) leading-[1.1]">
              Synthesize your career into{" "}
              <br className="hidden sm:inline" />
              <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 dark:from-violet-400 dark:via-indigo-400 dark:to-emerald-400">
                hire-ready intelligence
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-(--color-text-secondary) font-light leading-relaxed">
              Transform code repositories, achievements, and credentials into a
              ranked, structured portfolio — powered by Gitlore analysis and
              Gemini narrative synthesis.
            </p>
          </div>
        </section>

        {/* Workspace Area — TODO: Zonal split-pane layout */}
        <div className="w-full border-t border-(--color-border)/60">
          <section id="workspace" className="mx-auto max-w-7xl px-6 py-12">
            <div className="rounded-2xl border border-(--color-border) border-dashed bg-(--color-surface)/50 p-12 text-center">
              <p className="text-sm text-(--color-text-muted) font-mono">
                Zonal UI workspace — implementation pending
              </p>
              <p className="mt-2 text-xs text-(--color-text-muted)">
                Left Pane (Input Command Center) | Right Pane (Interactive Intelligence)
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
