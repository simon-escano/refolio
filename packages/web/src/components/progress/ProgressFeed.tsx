import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { ProgressEvent, ProgressPhase } from "../../types/portfolio";

interface Props {
  events: ProgressEvent[];
  isActive: boolean;
  onCancel?: () => void;
}

const phaseOrder: ProgressPhase[] = [
  "cache", "gitlore", "narrative", "stitching", "validation",
];

const phaseLabels: Record<ProgressPhase, string> = {
  cache: "Cache Lookup",
  gitlore: "Gitlore Analysis",
  narrative: "Narrative Synthesis",
  stitching: "Portfolio Assembly",
  validation: "Schema Validation",
};

export function ProgressFeed({ events, isActive, onCancel }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  if (events.length === 0 && !isActive) return null;

  const currentPhase = events[events.length - 1]?.phase || "cache";

  return (
    <div className="sticky-note rounded-lg p-4 relative animate-scale-in" style={{ transform: "rotate(-0.5deg)" }}>
      {/* Thumb Tack */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-md z-10 border border-red-500/50" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 border-b border-[var(--color-sticky-border)] pb-2">
        {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-sticky-text)]" />}
        <span className="font-mono text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-sticky-text)] flex-1">
          {isActive ? "Compiling..." : "Compilation Log"}
        </span>

        {/* Phase dots */}
        <div className="flex items-center gap-1">
          {phaseOrder.map((phase) => {
            const hasEvents = events.some((e) => e.phase === phase);
            const isCurrent = isActive && currentPhase === phase;
            return (
              <div
                key={phase}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isCurrent
                    ? "w-4 bg-[var(--color-tertiary)] animate-pulse"
                    : hasEvents
                      ? "w-1.5 bg-[var(--color-tertiary)]/60"
                      : "w-1.5 bg-[var(--color-sticky-border)]"
                }`}
                title={phaseLabels[phase]}
              />
            );
          })}
        </div>

        {isActive && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--color-error)] hover:underline"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Log Lines */}
      <ul className="space-y-1.5 max-h-[300px] overflow-y-auto text-sm text-[var(--color-sticky-text)]">
        {events.map((event, idx) => (
          <li key={idx} className="flex gap-2 items-start animate-slide-in-left" style={{ animationDelay: `${idx * 30}ms` }}>
            <span className={`mt-0.5 ${event.phase === currentPhase && isActive ? "animate-pulse" : ""}`}>
              {event.phase === currentPhase && isActive && idx === events.length - 1
                ? "⟳"
                : "✓"}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[13px] leading-snug">{event.message}</span>
              {event.detail && (
                <p className="mt-0.5 text-[10px] font-mono opacity-60 leading-normal pl-2 border-l border-[var(--color-sticky-border)]">
                  {event.detail}
                </p>
              )}
            </div>
          </li>
        ))}
        {events.length === 0 && isActive && (
          <li className="flex gap-2 items-center text-xs opacity-50 animate-pulse">
            <span>⟳</span>
            <span>Initializing pipeline...</span>
          </li>
        )}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
}
