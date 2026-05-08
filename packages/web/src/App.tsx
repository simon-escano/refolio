import { useState, useRef } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { IdentityZone } from "./components/input/IdentityZone";
import { GitloreQueue, type ProjectEntry } from "./components/input/GitloreQueue";
import { HustleZone, type AchievementEntry, type CredentialEntry } from "./components/input/HustleZone";
import { ProgressFeed } from "./components/progress/ProgressFeed";
import { OutputTabs } from "./components/output/OutputTabs";
import { SortBar, type SortMode } from "./components/sort/SortBar";
import { LivePreview } from "./components/preview/LivePreview";
import { MonacoEditor } from "./components/editor/MonacoEditor";
import { usePortfolioSync } from "./lib/sync";
import { streamGenerate } from "./lib/api";
import { Sparkles, Rocket, ArrowDown, Zap, Target, Brain } from "lucide-react";
import type { ProgressEvent } from "./types/portfolio";

export default function App() {
  // ─── Form State ───
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    email: "",
    github: "",
    linkedin: "",
    website: "",
  });
  const [projects, setProjects] = useState<ProjectEntry[]>([
    { url: "", title: "", contributions: "", context: "", gallery: [], links: [] },
  ]);
  const [achievements, setAchievements] = useState<AchievementEntry[]>([]);
  const [credentials, setCredentials] = useState<CredentialEntry[]>([]);

  // ─── Pipeline State ───
  const [progress, setProgress] = useState<ProgressEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ─── Output State ───
  const sync = usePortfolioSync();
  const [activeTab, setActiveTab] = useState<"preview" | "json">("preview");
  const [sortMode, setSortMode] = useState<SortMode>("rank");

  const canGenerate =
    profile.name.trim() !== "" &&
    profile.role.trim() !== "" &&
    projects.some((p) => p.url.trim() !== "" && p.title.trim() !== "");

  const handleGenerate = () => {
    setProgress([]);
    sync.reset();
    setError(null);
    setIsGenerating(true);
    setActiveTab("preview");

    document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" });

    const controller = streamGenerate(
      {
        profile: {
          name: profile.name,
          role: profile.role,
          email: profile.email || undefined,
          github: profile.github || undefined,
          linkedin: profile.linkedin || undefined,
          website: profile.website || undefined,
        },
        projects: projects.filter((p) => p.url.trim() && p.title.trim()),
        achievements: achievements.filter((a) => a.title.trim()),
        credentials: credentials.filter((c) => c.title.trim()),
      },
      {
        onProgress: (event) => setProgress((prev) => [...prev, event]),
        onResult: (data) => {
          sync.setFromPipeline(data);
          setIsGenerating(false);
          abortRef.current = null;
        },
        onError: (msg) => {
          setError(msg);
          setIsGenerating(false);
          abortRef.current = null;
        },
      }
    );

    abortRef.current = controller;
  };

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsGenerating(false);
    setProgress((prev) => [
      ...prev,
      { phase: "validation", message: "Generation cancelled by user" },
    ]);
  };

  const hasOutput = (sync.portfolio || error) && !isGenerating;

  return (
    <div className="flex min-h-screen flex-col bg-grid-pattern bg-(--color-bg)">
      <Header />

      <main className="flex-1 relative">
        {/* Ambient Hero Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-7xl rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.015] blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 px-3.5 py-1.5 text-xs text-zinc-500 backdrop-blur-md animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              <span className="font-medium uppercase tracking-wider text-[10px]">
                Master Portfolio Orchestrator
              </span>
            </div>

            <h1 className="max-w-3xl mx-auto text-5xl sm:text-6xl font-light tracking-tight text-(--color-text) leading-[1.1] animate-fade-up stagger-1">
              Synthesize your career into{" "}
              <br className="hidden sm:inline" />
              <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 dark:from-violet-400 dark:via-indigo-400 dark:to-emerald-400">
                hire-ready intelligence
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-(--color-text-secondary) font-light leading-relaxed animate-fade-up stagger-2">
              Transform code repositories, achievements, and credentials into a
              ranked, structured portfolio.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 animate-fade-up stagger-3">
              {[
                { icon: Zap, label: "Gitlore Analysis", color: "text-blue-500" },
                { icon: Brain, label: "Gemini Narrative", color: "text-violet-500" },
                { icon: Target, label: "Hirer Ranking", color: "text-emerald-500" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/30 px-3 py-1 text-[11px] font-medium text-(--color-text-secondary)"
                >
                  <f.icon className={`h-3 w-3 ${f.color}`} />
                  {f.label}
                </div>
              ))}
            </div>

            <div className="pt-4 animate-fade-up stagger-4">
              <a
                href="#workspace"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-6 py-3 text-sm font-medium text-white dark:text-zinc-900 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                Start Building
                <ArrowDown className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              </a>
            </div>
          </div>
        </section>

        {/* Workspace */}
        <div className="w-full border-t border-(--color-border)/60">
          <section id="workspace" className="mx-auto max-w-7xl px-6 py-10">
            <div className={`grid gap-6 transition-all duration-500 ${hasOutput ? "lg:grid-cols-[420px_1fr]" : "max-w-lg mx-auto"}`}>
              {/* Left Pane — Input Command Center */}
              <div className="space-y-3">
                <IdentityZone value={profile} onChange={setProfile} disabled={isGenerating} />
                <GitloreQueue projects={projects} onChange={setProjects} disabled={isGenerating} />
                <HustleZone
                  achievements={achievements}
                  credentials={credentials}
                  onAchievementsChange={setAchievements}
                  onCredentialsChange={setCredentials}
                  disabled={isGenerating}
                />

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                    isGenerating
                      ? "bg-zinc-700 cursor-wait"
                      : "bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:shadow-lg hover:shadow-indigo-500/20"
                  }`}
                >
                  {!isGenerating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    <Rocket className={`h-4 w-4 ${isGenerating ? "animate-pulse" : "group-hover:animate-float"}`} />
                    {isGenerating ? "Generating Portfolio..." : "Generate Portfolio"}
                  </span>
                </button>

                {/* Docked progress log */}
                {!isGenerating && progress.length > 0 && (
                  <ProgressFeed events={progress} isActive={false} />
                )}
              </div>

              {/* Right Pane — Interactive Output */}
              {hasOutput && (
                <div className="space-y-4 animate-slide-in-right min-w-0">
                  {/* Error Display */}
                  {error && (
                    <div className="rounded-2xl border border-red-200 dark:border-red-900/20 bg-red-50/30 dark:bg-red-950/10 p-5 space-y-2 animate-fade-in">
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        Pipeline Error
                      </p>
                      <p className="text-xs text-red-500/90 dark:text-red-400/80 font-mono leading-relaxed">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Output Controls */}
                  {sync.portfolio && (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <OutputTabs active={activeTab} onChange={setActiveTab} />
                        {activeTab === "preview" && (
                          <SortBar active={sortMode} onChange={setSortMode} />
                        )}
                      </div>

                      {/* Tab Content */}
                      {activeTab === "preview" ? (
                        <LivePreview portfolio={sync.portfolio} sortMode={sortMode} />
                      ) : (
                        <MonacoEditor
                          value={sync.jsonString}
                          onChange={sync.setFromEditor}
                          error={sync.jsonError}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Active Generation Modal */}
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg animate-scale-in">
              <ProgressFeed events={progress} isActive={true} onCancel={handleCancel} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
