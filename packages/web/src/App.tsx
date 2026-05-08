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
import { Rocket, ArrowRight } from "lucide-react";
import type { ProgressEvent } from "./types/portfolio";

export default function App() {
  // ─── Form State ───
  const [profile, setProfile] = usePersistedState("refolio_profile", {
    name: "", role: "", email: "", mobileAreaCode: "+63", mobile: "", github: "", linkedin: "", website: "", hobbies: "",
  });
  const [projects, setProjects] = usePersistedState<ProjectEntry[]>("refolio_projects", [
    { url: "", title: "", contributions: "", context: "", gallery: [], links: [] },
  ]);
  const [achievements, setAchievements] = usePersistedState<AchievementEntry[]>("refolio_achievements", []);
  const [credentials, setCredentials] = usePersistedState<CredentialEntry[]>("refolio_credentials", []);
  const [experience, setExperience] = usePersistedState<ExperienceEntry[]>("refolio_experience", []);
  const [tech, setTech] = usePersistedState<SkillEntry[]>("refolio_tech", []);
  const [languages, setLanguages] = usePersistedState<LanguageEntry[]>("refolio_languages", []);

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
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] relative">
      {/* Drafting Grid Background */}
      <div className="fixed inset-0 drafting-grid pointer-events-none" />
      {/* Paper Texture Noise */}
      <div className="texture-noise fixed inset-0 pointer-events-none" />

      <Header />

      <main className="flex-1 relative z-10">
        <div className="w-full">
          <section id="workspace" className="mx-auto max-w-[1440px] px-5 md:px-16 py-8">
            {!hasOutput ? (
              /* ─── BENTO INPUT LAYOUT (Drafting Table — no output yet) ─── */
              <div className="space-y-8">
                {/* Row 1: Identity + Gitlore Queue */}
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                  <IdentityZone value={profile} onChange={setProfile} disabled={isGenerating} />
                  <GitloreQueue projects={projects} onChange={setProjects} disabled={isGenerating} />
                </div>

                {/* Row 2: Experience + Skills */}
                <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
                  <ExperienceZone experience={experience} onChange={setExperience} disabled={isGenerating} />
                  <SkillsZone tech={tech} languages={languages} onTechChange={setTech} onLanguagesChange={setLanguages} disabled={isGenerating} />
                </div>

                {/* Row 3: Achievements + Credentials */}
                <div className="grid gap-8 md:grid-cols-2">
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

                {/* Generate CTA */}
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
              /* ─── SPLIT LAYOUT (Drafting Table + Output Canvas) ─── */
              <div className="flex gap-8">
                {/* Left sidebar — compact input stack (1/4 width) */}
                <aside className="w-1/4 flex flex-col gap-5 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 sticky top-20">
                  {/* Mini ID Card */}
                  <MiniIdCard name={profile.name} role={profile.role} />

                  {/* Stacked Gitlore Queue */}
                  <StackedQueue projects={projects} />

                  {/* Collapsed Section Labels */}
                  <div className="flex flex-col gap-2">
                    <div className="bg-[var(--color-surface-variant)]/50 px-3 py-1 font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)] inline-block w-max rounded-sm -rotate-1 shadow-sm backdrop-blur-sm">
                      Experience
                    </div>
                    <div className="bg-[var(--color-surface-variant)]/50 px-3 py-1 font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)] inline-block w-max rounded-sm rotate-1 shadow-sm backdrop-blur-sm">
                      Skills
                    </div>
                    <div className="bg-[var(--color-surface-variant)]/50 px-3 py-1 font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)] inline-block w-max rounded-sm -rotate-[0.5deg] shadow-sm backdrop-blur-sm">
                      Achievements
                    </div>
                  </div>

                  {/* Regenerate CTA */}
                  <GenerateButton
                    canGenerate={canGenerate}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerate}
                  />

                  {/* Progress Log */}
                  {!isGenerating && progress.length > 0 && (
                    <ProgressFeed events={progress} isActive={false} />
                  )}
                </aside>

                {/* Right pane — output canvas (3/4 width) */}
                <section className="w-3/4 flex flex-col min-w-0 animate-slide-in-right">
                  {error && (
                    <div className="rounded-xl border border-[var(--color-error-container)] bg-[var(--color-error-container)] p-5 space-y-2 animate-scale-in mb-4">
                      <p className="text-sm font-bold text-[var(--color-on-error-container)]">Pipeline Error</p>
                      <p className="text-xs font-mono text-[var(--color-on-error-container)]/80 leading-relaxed">{error}</p>
                    </div>
                  )}

                  {sync.portfolio && (
                    <>
                      <OutputTabs active={activeTab} onChange={setActiveTab} />

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
                </section>
              </div>
            )}
          </section>
        </div>

        {/* Pipeline Modal */}
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md animate-scale-in">
              <ProgressFeed events={progress} isActive={true} onCancel={handleCancel} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ─── Mini ID Card (Split Layout Sidebar) ─── */
function MiniIdCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl level-3 p-4 relative overflow-hidden flex flex-col gap-3">
      <div className="plastic-overlay absolute inset-0 z-10 pointer-events-none rounded-xl" />
      <div className="w-12 h-3 bg-[var(--color-surface-variant)] rounded-full mx-auto mb-1 shadow-inner" />
      <div className="flex items-center gap-3 relative z-20">
        <div className="w-14 h-14 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center border border-[var(--color-outline-variant)] overflow-hidden">
          <span className="text-xl font-bold text-[var(--color-primary)]">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--color-primary)]">{name || "Your Name"}</h2>
          <p className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)]">{role || "Your Role"}</p>
        </div>
      </div>
      <div className="font-mono text-[10px] text-[var(--color-outline)] text-center relative z-20 tracking-[0.15em]">
        SN: RF-0000-BETA
      </div>
    </div>
  );
}

/* ─── Stacked Queue (Split Layout Sidebar) ─── */
function StackedQueue({ projects }: { projects: ProjectEntry[] }) {
  const filledProjects = projects.filter(p => p.title.trim());
  if (filledProjects.length === 0) return null;

  return (
    <div className="relative h-28">
      {filledProjects.length > 2 && (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-lg p-3 level-2 absolute w-full top-2 left-2 rotate-[2deg] opacity-60 flex justify-between">
          <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)]">
            {filledProjects[2]?.title || "Project"}
          </span>
        </div>
      )}
      {filledProjects.length > 1 && (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-lg p-3 level-2 absolute w-full top-1 left-1 rotate-[1deg] opacity-80 flex justify-between">
          <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)]">
            {filledProjects[1]?.title || "Project"}
          </span>
        </div>
      )}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-lg p-4 level-2 absolute w-full top-0 left-0 z-10 border border-[var(--color-outline-variant)]/30 flex justify-between items-center">
        <div>
          <div className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-primary)] mb-1">
            Queue: {filledProjects.length} Items
          </div>
          <div className="text-base font-semibold text-[var(--color-on-surface)]">
            {filledProjects[0]?.title || "Project"}
          </div>
        </div>
        <svg className="h-6 w-6 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
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
      className={`group relative w-full overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed level-2 ${
        isGenerating
          ? "bg-[var(--color-on-surface-variant)] cursor-wait"
          : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] hover:text-[var(--color-on-primary-container)]"
      }`}
    >
      <span className="relative flex items-center justify-center gap-2.5">
        <Rocket className={`h-4 w-4 ${isGenerating ? "animate-pulse" : "group-hover:animate-bounce"}`} />
        {isGenerating ? "Generating..." : "Generate Portfolio"}
        {!isGenerating && <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />}
      </span>
    </button>
  );
}
