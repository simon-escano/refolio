import { useState, useEffect } from "react";
import { Plus, FolderOpen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

// Deterministic scattered offsets for the "blown out" drafting tabletop aesthetic (fanned layout)
const SCATTER_ROTATIONS = [-5, 6, -8, 4, -4, 8, -6, 5];
const SCATTER_Y = [5, -8, 10, -6, 8, -4, 6, -10];
const SCATTER_X = [-4, 6, -6, 8, -5, 4, -8, 5];

export function GitloreQueue({ projects, onChange, disabled }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = projects.length + 1; // Projects plus the Add card
  const isCarouselMode = totalCards > 3;

  const addProject = () => {
    onChange([...projects, { ...emptyProject }]);
    // Focus the new project card immediately
    setActiveIndex(projects.length);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof ProjectEntry, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // Keep activeIndex within bounds when cards are removed
  useEffect(() => {
    if (activeIndex >= totalCards) {
      setActiveIndex(Math.max(0, totalCards - 1));
    }
  }, [totalCards, activeIndex]);

  return (
    <section className="relative z-0">
      {/* Drafting Tape Label */}
      <div className="drafting-tape mb-4 rotate-1">
        Gitlore Queue
      </div>

      {isCarouselMode ? (
        /* ═══ BUNCHNIG CAROUSEL MODE (Overflowing Deck) ═══ */
        <div className="relative w-full h-[430px] overflow-visible flex items-center justify-center py-12 px-4 sm:px-16">
          {/* Left Cycle Arrow */}
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={() => setActiveIndex(activeIndex - 1)}
              className="absolute left-0 sm:left-4 z-50 p-3 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-lg flex items-center justify-center hover:translate-x-[-2px] duration-150"
              title="Previous project"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Center absolute stack zone */}
          <div className="relative w-full max-w-[320px] h-full flex items-center justify-center">
            <AnimatePresence initial={false}>
              {projects.map((project, i) => {
                const diff = i - activeIndex;
                const isActive = diff === 0;
                
                // Calculate position for bunched cards on left and right
                let translateX = 0;
                let rotateAngle = 0;
                let translateY = 0;
                let scale = 1;
                let zIndex = 30;
                let opacity = 1;

                if (diff < 0) {
                  // Bunched on the left
                  translateX = diff * 18 - 145;
                  rotateAngle = diff * 5 - 4;
                  translateY = diff * 3;
                  scale = 0.88 + diff * 0.03;
                  zIndex = 30 + i; // left items stack under each other going left
                  opacity = Math.max(0.25, 1 + diff * 0.25);
                } else if (diff > 0) {
                  // Bunched on the right
                  translateX = diff * 18 + 145;
                  rotateAngle = diff * 5 + 4;
                  translateY = -diff * 3;
                  scale = 0.88 - diff * 0.03;
                  zIndex = 30 - i; // right items stack under each other going right
                  opacity = Math.max(0.25, 1 - diff * 0.25);
                } else {
                  // Active card in center
                  zIndex = 45;
                }

                return (
                  <motion.div
                    key={i}
                    layout
                    style={{ zIndex }}
                    animate={{
                      x: translateX,
                      y: translateY,
                      rotate: rotateAngle,
                      scale: scale,
                      opacity: opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 20,
                    }}
                    whileHover={isActive ? {
                      y: -16,
                      scale: 1.04,
                      zIndex: 50,
                    } : undefined}
                    onClick={!isActive ? () => setActiveIndex(i) : undefined}
                    className={`playing-card absolute w-[280px] h-[360px] rounded-xl p-5 flex flex-col gap-4 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 transition-shadow duration-200 ${
                      !isActive ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-center h-6">
                      <span className="font-mono text-sm font-medium text-[var(--color-outline-variant)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {isActive && projects.length > 1 ? (
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
                          disabled={disabled || !isActive}
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
                          disabled={disabled || !isActive}
                          placeholder="Project title"
                          className="input-drafting font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">Contributions</label>
                        <textarea
                          value={project.contributions}
                          onChange={(e) => updateProject(i, "contributions", e.target.value)}
                          disabled={disabled || !isActive}
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
                          disabled={disabled || !isActive}
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

              {/* Add Project Card Slot in Carousel */}
              {(() => {
                const diff = projects.length - activeIndex;
                const isActive = diff === 0;

                let translateX = 0;
                let rotateAngle = 0;
                let translateY = 0;
                let scale = 1;
                let zIndex = 30;
                let opacity = 1;

                if (diff < 0) {
                  // Bunched on the left (unlikely to have negative diff for last element unless activeIndex > length, but handled for completeness)
                  translateX = diff * 18 - 145;
                  rotateAngle = diff * 5 - 4;
                  translateY = diff * 3;
                  scale = 0.88 + diff * 0.03;
                  zIndex = 30 + projects.length;
                  opacity = Math.max(0.25, 1 + diff * 0.25);
                } else if (diff > 0) {
                  // Bunched on the right
                  translateX = diff * 18 + 145;
                  rotateAngle = diff * 5 + 4;
                  translateY = -diff * 3;
                  scale = 0.88 - diff * 0.03;
                  zIndex = 30 - projects.length;
                  opacity = Math.max(0.25, 1 - diff * 0.25);
                } else {
                  // Active card in center
                  zIndex = 45;
                }

                return (
                  <motion.div
                    key="add-slot"
                    layout
                    style={{ zIndex }}
                    animate={{
                      x: translateX,
                      y: translateY,
                      rotate: rotateAngle,
                      scale: scale,
                      opacity: opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 20,
                    }}
                    whileHover={isActive ? {
                      y: -16,
                      scale: 1.04,
                      zIndex: 50,
                    } : undefined}
                    onClick={disabled ? undefined : (!isActive ? () => setActiveIndex(projects.length) : addProject)}
                    className={`playing-card absolute w-[280px] h-[360px] rounded-xl p-5 flex flex-col justify-center items-center gap-4 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 transition-colors shadow-lg cursor-pointer group`}
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

          {/* Right Cycle Arrow */}
          {activeIndex < projects.length && (
            <button
              type="button"
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="absolute right-0 sm:right-4 z-50 p-3 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-lg flex items-center justify-center hover:translate-x-[2px] duration-150"
              title="Next project"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      ) : (
        /* ═══ NORMAL OVERLAPPING FAN MODE (<= 3 cards total) ═══ */
        <div className="w-full overflow-x-auto py-14 px-16 scrollbar-none flex justify-center">
          <div className="flex flex-row items-center justify-center min-w-max relative">
            <AnimatePresence mode="popLayout">
              {projects.map((project, i) => {
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
                    className={`playing-card w-[280px] h-[360px] rounded-xl p-5 flex flex-col gap-4 flex-shrink-0 relative group/proj blowout-card shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 ${
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

              {/* Add Project Card (empty slot in fanned mode) */}
              {(() => {
                const rIdx = projects.length % SCATTER_ROTATIONS.length;
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
                    className={`w-[280px] h-[360px] rounded-xl p-5 flex flex-col justify-center items-center gap-4 flex-shrink-0 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 transition-colors cursor-pointer group blowout-card animate-fade-up ${
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
      )}
    </section>
  );
}
