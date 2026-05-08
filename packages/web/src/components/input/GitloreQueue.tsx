import { Plus, X, FolderOpen } from "lucide-react";

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
    <section className="relative z-0">
      {/* Drafting Tape Label */}
      <div className="drafting-tape mb-4 rotate-1">
        Gitlore Queue
      </div>

      {/* Card Carousel */}
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 -mx-1 snap-x">
        {projects.map((project, i) => (
          <div
            key={i}
            className="playing-card min-w-[280px] max-w-[320px] rounded-xl p-5 flex flex-col gap-4 snap-center flex-shrink-0 relative group/proj card-hover animate-fade-up"
            style={{
              animationDelay: `${i * 80}ms`,
              transform: `rotate(${i % 2 === 0 ? -0.5 : 0.8}deg)`,
            }}
          >
            {/* Remove Button */}
            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(i)}
                disabled={disabled}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)] text-white shadow-md hover:bg-red-700 transition-all opacity-0 group-hover/proj:opacity-100 disabled:opacity-0 active:scale-90 z-20"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Card Header */}
            <div className="flex justify-between items-start">
              <span className="font-mono text-sm font-medium text-[var(--color-outline-variant)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <FolderOpen className="h-5 w-5 text-[var(--color-outline-variant)]" />
            </div>

            {/* Card Body */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-col gap-1">
                <label className="field-label text-[10px]">Repository</label>
                <input
                  type="text"
                  value={project.url}
                  onChange={(e) => updateProject(i, "url", e.target.value)}
                  disabled={disabled}
                  placeholder="https://github.com/owner/repo"
                  className="input-drafting input-drafting-sm font-mono text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="field-label text-[10px]">Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject(i, "title", e.target.value)}
                  disabled={disabled}
                  placeholder="Project title"
                  className="input-drafting font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="field-label text-[10px]">Contributions</label>
                <textarea
                  value={project.contributions}
                  onChange={(e) => updateProject(i, "contributions", e.target.value)}
                  disabled={disabled}
                  placeholder="What did you contribute?"
                  rows={2}
                  className="input-drafting input-drafting-sm resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="field-label text-[10px]">Context</label>
                <textarea
                  value={project.context}
                  onChange={(e) => updateProject(i, "context", e.target.value)}
                  disabled={disabled}
                  placeholder="Additional context (optional)"
                  rows={1}
                  className="input-drafting input-drafting-sm resize-none text-xs"
                />
              </div>
            </div>

            {/* Card Footer */}
            <div className="font-mono text-[10px] text-[var(--color-outline-variant)] tracking-[0.15em] text-center uppercase border-t border-[var(--color-outline-variant)]/50 pt-2">
              Repo Connection
            </div>
          </div>
        ))}

        {/* Add Project Card (empty slot) */}
        <div
          onClick={disabled ? undefined : addProject}
          className={`min-w-[280px] max-w-[320px] h-auto rounded-xl p-5 flex flex-col justify-center items-center gap-4 snap-center flex-shrink-0 border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]/50 hover:bg-[var(--color-surface-container-lowest)] transition-colors cursor-pointer group animate-fade-up ${
            disabled ? "opacity-50 pointer-events-none" : ""
          }`}
          style={{ animationDelay: `${projects.length * 80}ms` }}
        >
          <div className="flex flex-col items-center gap-3 text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors">
            <Plus className="h-12 w-12 stroke-1" />
            <span className="text-xl font-semibold">Add Project</span>
          </div>
          <div className="font-mono text-[10px] text-[var(--color-outline-variant)] tracking-[0.15em] uppercase">
            Repo Connection
          </div>
        </div>
      </div>
    </section>
  );
}
