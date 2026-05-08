import { useState, useRef } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { IdentityZone } from "./components/input/IdentityZone";
import { GitloreQueue, type ProjectEntry } from "./components/input/GitloreQueue";
import { ExperienceZone, type ExperienceEntry } from "./components/input/ExperienceZone";
import { SkillsZone, type SkillEntry, type LanguageEntry } from "./components/input/SkillsZone";
import { AchievementsZone, CredentialsZone, type AchievementEntry, type CredentialEntry } from "./components/input/HustleZone";
import { ProgressFeed } from "./components/progress/ProgressFeed";
import { OutputTabs } from "./components/output/OutputTabs";
import { LivePreview } from "./components/preview/LivePreview";
import { MonacoEditor } from "./components/editor/MonacoEditor";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { usePortfolioSync } from "./lib/sync";
import { usePersistedState } from "./lib/hooks";
import { streamGenerate } from "./lib/api";
import {
  Sparkles, Rocket, Brain,
  ArrowRight, GitBranch,
} from "lucide-react";
import type { ProgressEvent } from "./types/portfolio";

export default function App() {
  // ─── Form State ───
  const [profile, setProfile] = usePersistedState("monofolio_profile", {
    name: "", role: "", email: "", mobileAreaCode: "+63", mobile: "", github: "", linkedin: "", website: "", hobbies: "",
  });
  const [projects, setProjects] = usePersistedState<ProjectEntry[]>("monofolio_projects", [
    { url: "", title: "", contributions: "", context: "", gallery: [], links: [] },
  ]);
  const [achievements, setAchievements] = usePersistedState<AchievementEntry[]>("monofolio_achievements", []);
  const [credentials, setCredentials] = usePersistedState<CredentialEntry[]>("monofolio_credentials", []);
  const [experience, setExperience] = usePersistedState<ExperienceEntry[]>("monofolio_experience", []);
  const [tech, setTech] = usePersistedState<SkillEntry[]>("monofolio_tech", []);
  const [languages, setLanguages] = usePersistedState<LanguageEntry[]>("monofolio_languages", []);

  // ─── Pipeline State ───
  const [progress, setProgress] = useState<ProgressEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ─── Output State ───
  const sync = usePortfolioSync();
  const [activeTab, setActiveTab] = useState<"preview" | "json">("preview");
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

    const controller = streamGenerate(
      {
        profile: {
          name: profile.name, role: profile.role,
          email: profile.email || undefined,
          mobile: profile.mobile ? `${profile.mobileAreaCode || "+63"} ${profile.mobile}` : undefined,
          github: profile.github || undefined,
          linkedin: profile.linkedin || undefined,
          website: profile.website || undefined,
          hobbies: profile.hobbies || undefined,
        },
        projects: projects.filter((p) => p.url.trim() && p.title.trim()),
        achievements: achievements.filter((a) => a.accomplishment?.trim()),
        credentials: credentials.filter((c) => {
          if (c.type === "education") return c.title?.trim();
          return c.certification?.trim();
        }),
        experience: experience.filter((e) => e.company.trim() && e.role.trim()),
        skills: {
          tech: tech.filter((t) => t.title.trim()),
          languages: languages.filter((l) => l.title.trim()),
        },
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
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
    setProgress((prev) => [...prev, { phase: "validation", message: "Cancelled by user" }]);
  };

  const hasOutput = (sync.portfolio || error) && !isGenerating;

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg) relative">
      {/* Background grid (separate layer for opacity control) */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />

      <Header />

      <main className="flex-1 relative z-10">
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden pt-14 pb-10 sm:pt-18 sm:pb-14">
          {/* Ambient glow orbs — teal + rose */}
          <div className="absolute top-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-teal-400/[0.04] dark:bg-teal-400/[0.02] blur-[100px] pointer-events-none" />
          <div className="absolute top-10 right-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-rose-400/[0.04] dark:bg-rose-400/[0.02] blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-5xl px-6 text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface)/60 backdrop-blur-md px-3.5 py-1.5 animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 text-(--color-accent) animate-pulse" />
              <span className="font-semibold uppercase tracking-[0.15em] text-[9px] text-(--color-text-muted)">
                Portfolio Orchestrator
              </span>
            </div>

            <h1 className="max-w-3xl mx-auto text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-(--color-text) leading-[1.1] animate-fade-up stagger-1">
              Synthesize your career into{" "}
              <br className="hidden sm:inline" />
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-rose-500 to-purple-500 dark:from-teal-400 dark:via-rose-400 dark:to-purple-400">
                hire-ready intelligence
              </span>
            </h1>

            <p className="max-w-lg mx-auto text-sm sm:text-base text-(--color-text-secondary) font-light leading-relaxed animate-fade-up stagger-2">
              Code analysis meets narrative synthesis.
              Repositories → structured, ranked portfolios.
            </p>

            {/* Feature Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 animate-fade-up stagger-3">
              {[
                { icon: GitBranch, label: "Gitlore", desc: "Code Analysis", color: "text-teal-500" },
                { icon: Brain, label: "AI Processed", desc: "Hallucination Free", color: "text-rose-500" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="group flex items-center gap-2 rounded-2xl glass-card px-3.5 py-2 cursor-default transition-all hover:shadow-md"
                >
                  <f.icon className={`h-4 w-4 ${f.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-(--color-text) leading-none">{f.label}</span>
                    <span className="block text-[9px] text-(--color-text-muted) leading-none mt-0.5">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ WORKSPACE ═══ */}
        <div className="w-full">
          <section id="workspace" className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
            {!hasOutput ? (
              /* ─── BENTO INPUT LAYOUT (no output yet) ─── */
              <div className="space-y-4">
                {/* Row 1: Identity + Gitlore Queue */}
                <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
                  <IdentityZone value={profile} onChange={setProfile} disabled={isGenerating} />
                  <GitloreQueue projects={projects} onChange={setProjects} disabled={isGenerating} />
                </div>

                {/* Row 2: Experience + Skills side by side */}
                <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
                  <ExperienceZone experience={experience} onChange={setExperience} disabled={isGenerating} />
                  <SkillsZone tech={tech} languages={languages} onTechChange={setTech} onLanguagesChange={setLanguages} disabled={isGenerating} />
                </div>

                {/* Row 3: Achievements + Credentials side by side */}
                <div className="grid gap-4 md:grid-cols-2">
                  <AchievementsZone
                    achievements={achievements}
                    onChange={setAchievements}
                    disabled={isGenerating}
                  />
                  <CredentialsZone
                    credentials={credentials}
                    onChange={setCredentials}
                    disabled={isGenerating}
                  />
                </div>

                {/* Row 3: Generate CTA */}
                <GenerateButton
                  canGenerate={canGenerate}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerate}
                />

                {/* Docked progress */}
                {!isGenerating && progress.length > 0 && (
                  <ProgressFeed events={progress} isActive={false} />
                )}
              </div>
            ) : (
              /* ─── SPLIT LAYOUT (output visible) ─── */
              <div className="grid gap-5 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
                {/* Left sidebar — compact input stack */}
                <div className="space-y-3 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 lg:sticky lg:top-20">
                  <IdentityZone value={profile} onChange={setProfile} disabled={isGenerating} />
                  <GitloreQueue projects={projects} onChange={setProjects} disabled={isGenerating} />
                  <ExperienceZone experience={experience} onChange={setExperience} disabled={isGenerating} />
                  <SkillsZone tech={tech} languages={languages} onTechChange={setTech} onLanguagesChange={setLanguages} disabled={isGenerating} />
                  <AchievementsZone
                    achievements={achievements}
                    onChange={setAchievements}
                    disabled={isGenerating}
                  />
                  <CredentialsZone
                    credentials={credentials}
                    onChange={setCredentials}
                    disabled={isGenerating}
                  />
                  <GenerateButton
                    canGenerate={canGenerate}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerate}
                  />
                  {!isGenerating && progress.length > 0 && (
                    <ProgressFeed events={progress} isActive={false} />
                  )}
                </div>

                {/* Right pane — output */}
                <div className="space-y-4 animate-slide-in-right min-w-0">
                  {error && (
                    <div className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-(--color-error-subtle) p-5 space-y-2 animate-scale-in">
                      <p className="text-sm font-semibold text-(--color-error)">Pipeline Error</p>
                      <p className="text-xs text-(--color-error)/80 font-mono leading-relaxed">{error}</p>
                    </div>
                  )}

                  {sync.portfolio && (
                    <>
                      <div className="flex items-center justify-between gap-4 sticky top-16 z-30 bg-(--color-bg)/80 backdrop-blur-md py-2 -mx-1 px-1 rounded-2xl">
                        <OutputTabs active={activeTab} onChange={setActiveTab} />
                      </div>

                      {activeTab === "preview" ? (
                        <ErrorBoundary>
                          <LivePreview portfolio={sync.portfolio} />
                        </ErrorBoundary>
                      ) : (
                        <ErrorBoundary>
                          <MonacoEditor
                            value={sync.jsonString}
                            onChange={sync.setFromEditor}
                            error={sync.jsonError}
                          />
                        </ErrorBoundary>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Pipeline Modal */}
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
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

/* ─── Generate CTA Button ─── */
function GenerateButton({
  canGenerate,
  isGenerating,
  onGenerate,
}: {
  canGenerate: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={!canGenerate || isGenerating}
      className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
        isGenerating
          ? "bg-zinc-700 cursor-wait"
          : "bg-gradient-to-r from-teal-500 via-rose-500 to-purple-500 hover:shadow-xl hover:shadow-teal-500/15 dark:hover:shadow-teal-400/10"
      }`}
    >
      {/* Shimmer sweep */}
      {!isGenerating && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      )}
      <span className="relative flex items-center justify-center gap-2.5">
        <Rocket className={`h-4 w-4 ${isGenerating ? "animate-pulse" : "group-hover:animate-float"}`} />
        {isGenerating ? "Generating..." : "Generate Portfolio"}
        {!isGenerating && <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />}
      </span>
    </button>
  );
}
