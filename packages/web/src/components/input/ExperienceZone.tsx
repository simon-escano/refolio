import { useState } from "react";
import { Briefcase, Plus, Trash2, ChevronUp } from "lucide-react";

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  contributions: string;
}

interface Props {
  experience: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
  disabled?: boolean;
}

export function ExperienceZone({ experience, onChange, disabled }: Props) {
  const [expanded, setExpanded] = useState(true);

  const updateEntry = (index: number, field: keyof ExperienceEntry, value: string) => {
    const next = [...experience];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addEntry = () => {
    onChange([
      { company: "", role: "", location: "", startDate: "", endDate: "", contributions: "" },
    ]);
  };

  const removeEntry = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up stagger-3">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-purple-500 text-white shadow-sm">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Work Experience</h3>
            <p className="text-[11px] text-(--color-text-secondary)">Past roles & responsibilities</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {experience.length}
          </span>
          <div className={`text-(--color-text-muted) transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
            <ChevronUp className="h-4 w-4" />
          </div>
        </div>
      </button>

      {/* Content */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-5 pb-5 pt-1">
          {experience.map((exp, i) => (
            <div 
              key={i} 
              className={`group/proj rounded-xl border border-(--color-border) bg-(--color-bg) p-4 space-y-3 animate-scale-in transition-all hover:border-(--color-border-focus)`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
                  Role {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => removeEntry(i)}
                  disabled={disabled}
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-(--color-text-muted) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all opacity-0 group-hover/proj:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <input
                value={exp.role}
                onChange={(e) => updateEntry(i, "role", e.target.value)}
                disabled={disabled}
                placeholder="Role (e.g. Senior Backend Engineer)"
                className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
              />
              <input
                value={exp.company}
                onChange={(e) => updateEntry(i, "company", e.target.value)}
                disabled={disabled}
                placeholder="Company (e.g. Acme Corp)"
                className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
              />
              <input
                value={exp.location}
                onChange={(e) => updateEntry(i, "location", e.target.value)}
                disabled={disabled}
                placeholder="Location (e.g. San Francisco, Remote)"
                className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={exp.startDate}
                  onChange={(e) => updateEntry(i, "startDate", e.target.value)}
                  disabled={disabled}
                  placeholder="Start Date (e.g. 2021)"
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                />
                <input
                  value={exp.endDate}
                  onChange={(e) => updateEntry(i, "endDate", e.target.value)}
                  disabled={disabled}
                  placeholder="End Date (e.g. Present)"
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                />
              </div>

              <textarea
                value={exp.contributions}
                onChange={(e) => updateEntry(i, "contributions", e.target.value)}
                disabled={disabled}
                placeholder="What did you contribute?"
                rows={3}
                className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50 resize-none leading-relaxed"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addEntry}
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-3 text-xs font-medium text-(--color-text-muted) transition-all hover:border-(--color-accent) hover:text-(--color-accent) hover:bg-(--color-accent-subtle)/30 disabled:opacity-50 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Experience
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
