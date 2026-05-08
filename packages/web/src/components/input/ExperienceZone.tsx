import { useState } from "react";
import { Briefcase, Plus, Trash2, ChevronUp } from "lucide-react";

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  contributions: string[];
}

interface Props {
  experience: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
  disabled?: boolean;
}

export function ExperienceZone({ experience, onChange, disabled }: Props) {
  const [expanded, setExpanded] = useState(true);

  const updateEntry = (index: number, field: keyof ExperienceEntry, value: string | string[]) => {
    const next = [...experience];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addEntry = () => {
    onChange([
      ...experience,
      { company: "", role: "", location: "", startDate: "", endDate: "", contributions: [] },
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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/20">
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
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-4 space-y-4 bg-(--color-bg)/30">
          {experience.map((exp, i) => (
            <div key={i} className="group relative rounded-xl border border-(--color-border) bg-(--color-bg) p-4 space-y-3 shadow-xs transition-colors hover:border-(--color-accent)/30">
              <button
                type="button"
                onClick={() => removeEntry(i)}
                disabled={disabled}
                className="absolute right-3 top-3 rounded-md p-1.5 text-(--color-text-muted) opacity-0 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 group-hover:opacity-100 disabled:opacity-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Role</label>
                  <input
                    value={exp.role}
                    onChange={(e) => updateEntry(i, "role", e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. Senior Backend Engineer"
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Company</label>
                  <input
                    value={exp.company}
                    onChange={(e) => updateEntry(i, "company", e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. Acme Corp"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Start Date</label>
                  <input
                    value={exp.startDate}
                    onChange={(e) => updateEntry(i, "startDate", e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. 2021"
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">End Date</label>
                  <input
                    value={exp.endDate}
                    onChange={(e) => updateEntry(i, "endDate", e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. Present"
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Location</label>
                  <input
                    value={exp.location}
                    onChange={(e) => updateEntry(i, "location", e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. San Francisco"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Contributions (One per line)</label>
                <textarea
                  value={exp.contributions.join("\n")}
                  onChange={(e) => updateEntry(i, "contributions", e.target.value.split("\n"))}
                  disabled={disabled}
                  placeholder="Led migration to Kubernetes..."
                  rows={3}
                  className="input-field resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEntry}
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-2.5 text-xs font-medium text-(--color-text-muted) transition-all hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 disabled:opacity-50 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Experience
          </button>
        </div>
      </div>
    </div>
  );
}
