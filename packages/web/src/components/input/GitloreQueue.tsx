import { Plus, FolderOpen, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// Deterministic scattered offsets for the "blown out" drafting tabletop aesthetic
const SCATTER_ROTATIONS = [-5, 6, -8, 4, -4, 8, -6, 5];
const SCATTER_Y = [5, -8, 10, -6, 8, -4, 6, -10];
const SCATTER_X = [-4, 6, -6, 8, -5, 4, -8, 5];

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

      {/* Card blowout stack container */}
      <div className="w-full overflow-x-auto py-16 px-16 scrollbar-none flex justify-center">
        <div className="flex flex-row items-center justify-center min-w-max relative">
          <AnimatePresence mode="popLayout">
            {projects.map((project, i) => {
              // Retrieve deterministic scatter values based on card index
              const rIdx = i % SCATTER_ROTATIONS.length;
              const rotateAngle = SCATTER_ROTATIONS[rIdx];
              const translateY = SCATTER_Y[rIdx];
              const translateX = SCATTER_X[rIdx];

              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 150, x: -60, rotate: -30, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    y: translateY,
                    x: translateX,
                    rotate: rotateAngle,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 60,
                    x: translateX - 20,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{
                    y: -40,
                    x: translateX,
                    rotate: 0,
                    scale: 1.06,
                    zIndex: 50,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 18,
                    delay: i * 0.02,
                  }}
                  className={`playing-card w-[280px] h-[360px] rounded-xl p-5 flex flex-col gap-4 flex-shrink-0 relative group/proj blowout-card shadow-md bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 ${
                    i > 0 ? "-ml-32 md:-ml-38" : ""
                  }`}
                  style={{
                    zIndex: i,
                  }}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-center h-6">
                    <span className="font-mono text-sm font-medium text-[var(--color-outline-variant)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {projects.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeProject(i)}
                        disabled={disabled}
                        className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-all duration-150 active:scale-90 disabled:opacity-50"
                        title="Delete project"
                      >
                        <Trash2 className="h-[18px] w-[18px]" />
                      </button>
                    ) : (
                      <FolderOpen className="h-[18px] w-[18px] text-[var(--color-outline-variant)]" />
                    )}
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
                </motion.div>
              );
            })}

            {/* Add Project Card (empty slot) */}
            {(() => {
              const rIdx = projects.length % SCATTER_ROTATIONS.length;
              
              // Place the add slot organically at the end of the stack
              const rotateAngle = SCATTER_ROTATIONS[rIdx] * 0.8;
              const translateY = SCATTER_Y[rIdx] * 0.8;
              const translateX = SCATTER_X[rIdx] * 0.8;

              return (
                <motion.div
                  key="add-slot"
                  layout
                  initial={{ opacity: 0, y: 150, rotate: -15, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    y: translateY,
                    x: translateX,
                    rotate: rotateAngle,
                    scale: 1,
                  }}
                  whileHover={{
                    y: -40,
                    x: translateX,
                    rotate: 0,
                    scale: 1.06,
                    zIndex: 50,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 18,
                    delay: projects.length * 0.02,
                  }}
                  onClick={disabled ? undefined : addProject}
                  className={`w-[280px] h-[360px] rounded-xl p-5 flex flex-col justify-center items-center gap-4 flex-shrink-0 border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]/50 hover:bg-[var(--color-surface-container-lowest)] transition-colors cursor-pointer group blowout-card animate-fade-up ${
                    projects.length > 0 ? "-ml-32 md:-ml-38" : ""
                  } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                  style={{
                    zIndex: projects.length,
                  }}
                >
                  <div className="flex flex-col items-center gap-3 text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                    <Plus className="h-12 w-12 stroke-1" />
                    <span className="text-xl font-semibold">Add Project</span>
                  </div>
                  <div className="font-mono text-[10px] text-[var(--color-outline-variant)] tracking-[0.15em] uppercase">
                    Repo Connection
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
