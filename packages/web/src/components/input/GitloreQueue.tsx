import { useState } from "react";
import {
  GitBranch, Plus, Trash2, ChevronUp, Loader2, Link2,
} from "lucide-react";

export interface ProjectEntry {
  url: string;
  title: string;
  contributions: string;
  context: string;
  gallery: string[];
  links: Array<{ label: string; url: string }>;
}

interface Props {
  projects: ProjectEntry[];
  onChange: (projects: ProjectEntry[]) => void;
  disabled?: boolean;
}

const emptyProject: ProjectEntry = {
  url: "",
  title: "",
  contributions: "",
  context: "",
  gallery: [],
  links: [],
};

export function GitloreQueue({ projects, onChange, disabled }: Props) {
  const [expanded, setExpanded] = useState(true);

  const addProject = () => {
    onChange([...projects, { ...emptyProject }]);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof ProjectEntry, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden card-hover animate-fade-up stagger-1">
      {/* Zone Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Gitlore Queue</h3>
          <p className="text-[11px] text-(--color-text-muted)">
            {projects.length} project{projects.length !== 1 ? "s" : ""} queued for analysis
          </p>
        </div>
        {/* Count badge */}
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-accent-subtle) px-1.5 text-[10px] font-bold text-(--color-accent) tabular-nums">
          {projects.length}
        </span>
        <div className={`text-(--color-text-muted) transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-5 pb-5 pt-1">
            {projects.map((project, i) => (
              <div
                key={i}
                className={`group/proj rounded-xl border border-(--color-border) bg-(--color-bg) p-4 space-y-3 animate-scale-in transition-all hover:border-(--color-border-focus)`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Project header with number + delete */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
                    Project {String(i + 1).padStart(2, "0")}
                  </span>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(i)}
                      disabled={disabled}
                      className="flex h-6 w-6 items-center justify-center rounded-lg text-(--color-text-muted) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all opacity-0 group-hover/proj:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* GitHub URL */}
                <div className="relative group/url">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) group-focus-within/url:text-(--color-accent) transition-colors">
                    <Link2 className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={project.url}
                    onChange={(e) => updateProject(i, "url", e.target.value)}
                    disabled={disabled}
                    placeholder="https://github.com/owner/repo"
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) pl-8.5 pr-3 py-2 text-sm font-mono text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                  />
                </div>

                {/* Title */}
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject(i, "title", e.target.value)}
                  disabled={disabled}
                  placeholder="Project title (e.g., Gitlore)"
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                />

                {/* Contributions */}
                <textarea
                  value={project.contributions}
                  onChange={(e) => updateProject(i, "contributions", e.target.value)}
                  disabled={disabled}
                  placeholder="What did you build? (e.g., 'Built the API pipeline, designed the Mermaid validation')"
                  rows={2}
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50 resize-none"
                />

                {/* Context (optional) */}
                <textarea
                  value={project.context}
                  onChange={(e) => updateProject(i, "context", e.target.value)}
                  disabled={disabled}
                  placeholder="Additional context (optional)"
                  rows={1}
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-xs text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50 resize-none"
                />
              </div>
            ))}

            {/* Add Project Button */}
            <button
              type="button"
              onClick={addProject}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-3 text-xs font-medium text-(--color-text-muted) transition-all hover:border-(--color-accent) hover:text-(--color-accent) hover:bg-(--color-accent-subtle)/30 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
