import { useEffect, useRef } from "react";
import {
  Database, GitBranch, Sparkles, BarChart3, Puzzle, CheckCircle,
  Loader2, type LucideIcon,
} from "lucide-react";
import type { ProgressEvent, ProgressPhase } from "../../types/portfolio";

interface Props {
  events: ProgressEvent[];
  isActive: boolean;
  onCancel?: () => void;
}

interface PhaseConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  glow: string;
}

const phaseConfig: Record<ProgressPhase, PhaseConfig> = {
  cache: {
    icon: Database,
    label: "Cache Lookup",
    color: "text-(--color-phase-cache)",
    bg: "bg-(--color-phase-cache-subtle)",
    glow: "ring-(--color-phase-cache)/30",
  },
  gitlore: {
    icon: GitBranch,
    label: "Gitlore Analysis",
    color: "text-(--color-phase-gitlore)",
    bg: "bg-(--color-phase-gitlore-subtle)",
    glow: "ring-(--color-phase-gitlore)/30",
  },
  narrative: {
    icon: Sparkles,
    label: "Narrative Synthesis",
    color: "text-(--color-phase-narrative)",
    bg: "bg-(--color-phase-narrative-subtle)",
    glow: "ring-(--color-phase-narrative)/30",
  },
  ranking: {
    icon: BarChart3,
    label: "Relevance Ranking",
    color: "text-(--color-phase-ranking)",
    bg: "bg-(--color-phase-ranking-subtle)",
    glow: "ring-(--color-phase-ranking)/30",
  },
  stitching: {
    icon: Puzzle,
    label: "Portfolio Assembly",
    color: "text-(--color-phase-stitching)",
    bg: "bg-(--color-phase-stitching-subtle)",
    glow: "ring-(--color-phase-stitching)/30",
  },
  validation: {
    icon: CheckCircle,
    label: "Schema Validation",
    color: "text-(--color-phase-validation)",
    bg: "bg-(--color-phase-validation-subtle)",
    glow: "ring-(--color-phase-validation)/30",
  },
};

const phaseOrder: ProgressPhase[] = [
  "cache", "gitlore", "narrative", "ranking", "stitching", "validation",
];

export function ProgressFeed({ events, isActive, onCancel }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  if (events.length === 0 && !isActive) return null;

  const currentPhase = events[events.length - 1]?.phase || "cache";

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden shadow-lg animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-(--color-border) px-5 py-4">
        {isActive && <Loader2 className="h-4 w-4 animate-spin text-(--color-accent) shrink-0" />}
        <h3 className="text-sm font-medium text-(--color-text) flex-1">
          {isActive ? "Generating Portfolio..." : "Generation Log"}
        </h3>

        {/* Phase indicator dots */}
        <div className="hidden sm:flex items-center gap-1">
          {phaseOrder.map((phase) => {
            const hasEvents = events.some((e) => e.phase === phase);
            const isCurrent = isActive && currentPhase === phase;
            return (
              <div
                key={phase}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  isCurrent
                    ? "w-4 bg-(--color-accent) animate-pulse"
                    : hasEvents
                      ? "bg-(--color-accent)/60"
                      : "bg-(--color-border)"
                }`}
                title={phaseConfig[phase].label}
              />
            );
          })}
        </div>

        {isActive && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-zinc-50 dark:bg-zinc-900/60 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Grouped Logs */}
      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {phaseOrder.map((phaseKey) => {
          const phaseEvents = events.filter((e) => e.phase === phaseKey);
          const isPhaseActive = isActive && currentPhase === phaseKey;

          if (phaseEvents.length === 0 && !isPhaseActive) return null;

          const cfg = phaseConfig[phaseKey];
          const Icon = cfg.icon;

          return (
            <div
              key={phaseKey}
              className={`rounded-xl border border-(--color-border)/60 bg-zinc-50/40 dark:bg-zinc-900/10 overflow-hidden transition-all duration-300 animate-fade-up ${
                isPhaseActive ? `ring-1 ${cfg.glow} border-(--color-accent)/30` : ""
              }`}
            >
              {/* Phase Header */}
              <div className="flex items-center gap-2.5 border-b border-(--color-border)/40 px-4 py-2.5 bg-zinc-50/90 dark:bg-zinc-900/30">
                <div className={`flex h-5 w-5 items-center justify-center rounded-md ${cfg.bg}`}>
                  <Icon className={`h-3 w-3 ${cfg.color}`} />
                </div>
                <span className="text-[11px] font-semibold text-(--color-text) tracking-wide uppercase flex-1">
                  {cfg.label}
                </span>
                {isPhaseActive && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-(--color-text-muted) animate-pulse">Processing</span>
                    <Loader2 className="h-3 w-3 animate-spin text-(--color-accent)" />
                  </div>
                )}
                {!isPhaseActive && phaseEvents.length > 0 && (
                  <span className="text-[10px] text-(--color-text-muted) tabular-nums">
                    {phaseEvents.length} event{phaseEvents.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Phase Log Lines */}
              <div className="p-3 space-y-2">
                {phaseEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs animate-slide-in-left"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-(--color-text) font-normal leading-normal">
                        {event.message}
                      </p>
                      {event.detail && (
                        <p className="mt-0.5 text-[10px] text-(--color-text-muted) font-mono leading-normal pl-2.5 border-l border-(--color-border)">
                          {event.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {phaseEvents.length === 0 && isPhaseActive && (
                  <div className="flex items-center gap-2 text-xs text-(--color-text-muted) italic">
                    <div className="h-3 w-24 rounded-md animate-shimmer" />
                    <span>Awaiting...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
