import { useState, useRef } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { IdentityZone } from "./components/input/IdentityZone";
import { GitloreQueue, type ProjectEntry } from "./components/input/GitloreQueue";
import { HustleZone, type AchievementEntry, type CredentialEntry } from "./components/input/HustleZone";
import { ProgressFeed } from "./components/progress/ProgressFeed";
import { streamGenerate } from "./lib/api";
import { Sparkles, Rocket, ArrowDown, Zap, Target, Brain } from "lucide-react";
import type { MasterPortfolio, ProgressEvent } from "./types/portfolio";

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
  const [result, setResult] = useState<MasterPortfolio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canGenerate =
    profile.name.trim() !== "" &&
    profile.role.trim() !== "" &&
    projects.some((p) => p.url.trim() !== "" && p.title.trim() !== "");

  const handleGenerate = () => {
    setProgress([]);
    setResult(null);
    setError(null);
    setIsGenerating(true);

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
          setResult(data);
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

  const hasOutput = (result || error) && !isGenerating;

  return (
    <div className="flex min-h-screen flex-col bg-grid-pattern bg-(--color-bg)">
      <Header />

      <main className="flex-1 relative">
        {/* Ambient Hero Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-7xl rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.015] blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
            {/* Animated Badge */}
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
                  {/* Shimmer overlay on hover */}
                  {!isGenerating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    <Rocket className={`h-4 w-4 ${isGenerating ? "animate-pulse" : "group-hover:animate-float"}`} />
                    {isGenerating ? "Generating Portfolio..." : "Generate Portfolio"}
                  </span>
                </button>

                {/* Docked progress feed when not active */}
                {!isGenerating && progress.length > 0 && (
                  <ProgressFeed events={progress} isActive={false} />
                )}
              </div>

              {/* Right Pane — Output */}
              {hasOutput && (
                <div className="space-y-4 animate-slide-in-right min-w-0">
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

                  {result && (
                    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 space-y-4 animate-fade-up">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Portfolio Ready
                        </span>
                        <h2 className="text-2xl font-light tracking-tight text-(--color-text)">
                          {result.profile.name}
                        </h2>
                        <p className="text-sm text-(--color-text-secondary)">
                          {result.profile.role}
                        </p>
                        {result.profile.philosophy && (
                          <p className="text-xs text-(--color-text-muted) italic leading-relaxed border-l-2 border-(--color-accent)/30 pl-3 mt-2">
                            {result.profile.philosophy}
                          </p>
                        )}
                      </div>

                      {/* Solutions summary */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-(--color-text-muted)">
                          Solutions ({result.solutions.length})
                        </span>
                        {result.solutions.map((sol, i) => (
                          <div
                            key={sol.id}
                            className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4 card-hover animate-fade-up"
                            style={{ animationDelay: `${i * 80}ms` }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 min-w-0">
                                <h4 className="text-sm font-medium text-(--color-text) truncate">
                                  {sol.title}
                                </h4>
                                <p className="text-xs text-(--color-text-secondary) line-clamp-2">
                                  {sol.one_liner}
                                </p>
                              </div>
                              {/* Score badge */}
                              <div className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold tabular-nums ${
                                sol.relevance_score >= 70
                                  ? "bg-(--color-rank-high-subtle) text-(--color-rank-high)"
                                  : sol.relevance_score >= 40
                                    ? "bg-(--color-rank-mid-subtle) text-(--color-rank-mid)"
                                    : "bg-(--color-rank-low-subtle) text-(--color-rank-low)"
                              }`}>
                                {sol.relevance_score}
                              </div>
                            </div>
                            {/* Score bar */}
                            <div className="mt-3 h-1 w-full rounded-full bg-(--color-border) overflow-hidden">
                              <div
                                className={`h-full rounded-full animate-score-fill ${
                                  sol.relevance_score >= 70
                                    ? "bg-(--color-rank-high)"
                                    : sol.relevance_score >= 40
                                      ? "bg-(--color-rank-mid)"
                                      : "bg-(--color-rank-low)"
                                }`}
                                style={{ "--score-width": `${sol.relevance_score}%` } as React.CSSProperties}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* JSON Preview */}
                      <div className="rounded-xl border border-(--color-border) bg-zinc-950 p-4 overflow-auto max-h-[300px]">
                        <pre className="text-[10px] font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-all">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
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
