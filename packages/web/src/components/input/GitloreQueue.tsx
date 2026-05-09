import { useState, useEffect } from "react";
import { Plus, FolderOpen, Trash2, ChevronLeft, ChevronRight, Link2, X } from "lucide-react";
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
  preComputedProjects: any[];
  onPreComputedChange: (precomputed: any[]) => void;
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

const sampleProjectsJson = `[
  {
    "title": "Pawductive",
    "one_liner": "A gamified Android productivity app center around extrinsic and intrinsic psychological motivators.",
    "contributions": "Lead Mobile Engineer, Android App Architect, UI/UX Lead Designer",
    "problem": "Generic to-do apps fail to maintain long-term user retention due to lack of emotional reward or game-mechanic feedback.",
    "goal": "Build an Android client that transforms user productivity metrics into virtual assets and emotional care routines.",
    "gallery": [],
    "links": [
      { "label": "Repository", "url": "https://github.com/simon-escano/Pawductive_2" }
    ],
    "key_features": [
      { "icon": "zap", "text": "Gamified task loop and experience point calculations" },
      { "icon": "shield", "text": "Offline Room Database SQLite persistence" }
    ],
    "architecture_diagram_code": "graph TD\\nA[Android UI] -->|User Actions| B[ViewModel]\\nB -->|State Updates| A\\nB -->|Data Mutators| C[Room Database]",
    "tech_stack": {
      "Primary": [{ "name": "Kotlin" }, { "name": "Android SDK" }],
      "Supporting": [{ "name": "Jetpack Compose" }],
      "Infrastructure": [{ "name": "SQLite" }]
    },
    "stack_reason": "Chosen for native Android robustness, memory efficiency, and sub-second SQL storage queries.",
    "results": {
      "performance": { "icon": "zap", "text": "Eliminated UI thread latency by executing all DB transactions on Kotlin Coroutines threads." },
      "scale": { "icon": "layers", "text": "Architected clean MVVM separation to allow adding shop modules without changing database definitions." },
      "utility": { "icon": "shield", "text": "Ensured atomic task actions and schema safety with Room's query-time compiler checks." }
    }
  }
]`;

// Deterministic scattered offsets for the fanned layout
const SCATTER_ROTATIONS = [-4, 5, -6, 3, -3, 6, -5, 4];
const SCATTER_Y = [4, -6, 8, -5, 6, -3, 5, -8];
const SCATTER_X = [-3, 5, -5, 6, -4, 3, -6, 4];

export function GitloreQueue({ projects, onChange, preComputedProjects, onPreComputedChange, disabled }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = projects.length + 1; // Projects plus the Add card
  const isCarouselMode = totalCards > 3;

  const addProject = () => {
    onChange([...projects, { ...emptyProject, links: [] }]);
    // Focus the new project card immediately
    setActiveIndex(projects.length);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof ProjectEntry, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // Nested links updates helpers
  const updateLink = (pIdx: number, lIdx: number, field: "label" | "url", val: string) => {
    const updatedProjects = [...projects];
    const project = { ...updatedProjects[pIdx] };
    const updatedLinks = [...(project.links || [])];
    updatedLinks[lIdx] = { ...updatedLinks[lIdx], [field]: val };
    project.links = updatedLinks;
    updatedProjects[pIdx] = project;
    onChange(updatedProjects);
  };

  const addLink = (pIdx: number) => {
    const updatedProjects = [...projects];
    const project = { ...updatedProjects[pIdx] };
    project.links = [...(project.links || []), { label: "", url: "" }];
    updatedProjects[pIdx] = project;
    onChange(updatedProjects);
  };

  const removeLink = (pIdx: number, lIdx: number) => {
    const updatedProjects = [...projects];
    const project = { ...updatedProjects[pIdx] };
    project.links = (project.links || []).filter((_, idx) => idx !== lIdx);
    updatedProjects[pIdx] = project;
    onChange(updatedProjects);
  };

  const [usePrecomputed, setUsePrecomputed] = useState(preComputedProjects.length > 0);
  const [jsonText, setJsonText] = useState(
    preComputedProjects.length > 0 ? JSON.stringify(preComputedProjects, null, 2) : ""
  );

  const handleLoadSample = () => {
    setJsonText(sampleProjectsJson);
    onPreComputedChange(JSON.parse(sampleProjectsJson));
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

      {/* Workflow Segmented Pill Toggle */}
      <div className="flex gap-2 items-center mb-6 bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]/40 w-fit level-1 animate-fade-down">
        <button
          type="button"
          onClick={() => {
            setUsePrecomputed(false);
            onPreComputedChange([]);
          }}
          className={`px-4 py-2.5 rounded-lg font-mono text-[10px] font-semibold tracking-[0.1em] transition-all duration-200 ${
            !usePrecomputed
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-variant)]/25"
          }`}
        >
          GITLORE WORKFLOW
        </button>
        <button
          type="button"
          onClick={() => setUsePrecomputed(true)}
          className={`px-4 py-2.5 rounded-lg font-mono text-[10px] font-semibold tracking-[0.1em] transition-all duration-200 ${
            usePrecomputed
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-variant)]/25"
          }`}
        >
          DIRECT JSON INGESTION (SKIP QUEUE)
        </button>
      </div>

      {usePrecomputed ? (
        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 rounded-2xl p-6 space-y-5 shadow-lg animate-fade-in level-2">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Direct Project JSON Ingestion
              </h3>
              <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                Skip slow Gitlore extraction and supply pre-computed project objects directly. Saves substantial LLM context limits and token usage.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 rounded-lg font-mono text-[10px] font-semibold tracking-wider text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 shrink-0 shadow-sm"
            >
              LOAD SAMPLE SCHEMA
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              try {
                const parsed = JSON.parse(e.target.value);
                if (Array.isArray(parsed)) {
                  onPreComputedChange(parsed);
                } else {
                  onPreComputedChange([]);
                }
              } catch (err) {
                onPreComputedChange([]);
              }
            }}
            disabled={disabled}
            placeholder={`[\n  {\n    "title": "My Awesome App",\n    "one_liner": "A performant react client...",\n    "contributions": "Lead Developer",\n    "problem": "...",\n    "goal": "...",\n    "key_features": [\n      { "icon": "cpu", "text": "Hardware acceleration" }\n    ],\n    "architecture_diagram_code": "graph TD\\nA-->B",\n    "tech_stack": {\n      "Primary": [{ "name": "React" }],\n      "Supporting": [],\n      "Infrastructure": []\n    },\n    "stack_reason": "...",\n    "results": {\n      "performance": { "icon": "zap", "text": "100ms load time" },\n      "scale": { "icon": "shield", "text": "Qualitative scale" },\n      "utility": { "icon": "code", "text": "Clean code" }\n    }\n  }\n]`}
            rows={12}
            className="w-full font-mono text-xs p-4 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]/60 rounded-xl focus:outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-outline-variant)] transition-all leading-relaxed focus:ring-1 focus:ring-[var(--color-primary)]/20 shadow-inner resize-y"
          />

          <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-outline-variant)]/30">
            {jsonText.trim() ? (() => {
              try {
                JSON.parse(jsonText);
                return (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    ✓ Valid JSON structure parsed successfully
                  </div>
                );
              } catch (e: any) {
                return (
                  <div className="text-xs text-[var(--color-error)] font-mono font-semibold">
                    ✗ Invalid JSON syntax: {e.message}
                  </div>
                );
              }
            })() : (
              <div className="text-xs text-[var(--color-outline)] font-mono">
                Paste your projects JSON block above to get started.
              </div>
            )}
          </div>
        </div>
      ) : isCarouselMode ? (
        /* ═══ BUNCHING CAROUSEL MODE (Overflowing Deck) ═══ */
        <div className="relative w-full h-[510px] overflow-visible flex items-center justify-center py-10 px-4 sm:px-16">
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
                  zIndex = 30 + i;
                  opacity = Math.max(0.25, 1 + diff * 0.25);
                } else if (diff > 0) {
                  // Bunched on the right
                  translateX = diff * 18 + 145;
                  rotateAngle = diff * 5 + 4;
                  translateY = -diff * 3;
                  scale = 0.88 - diff * 0.03;
                  zIndex = 30 - i;
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
                      y: -12,
                      scale: 1.03,
                      zIndex: 50,
                    } : undefined}
                    onClick={!isActive ? () => setActiveIndex(i) : undefined}
                    className={`playing-card absolute w-[290px] h-[440px] rounded-xl p-5 flex flex-col gap-3.5 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 transition-shadow duration-200 ${
                      !isActive ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    {/* Card Header with inline Trash action */}
                    <div className="flex justify-between items-center h-6 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-1">
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-[var(--color-outline-variant)]">
                        PROJECT {String(i + 1).padStart(2, "0")}
                      </span>
                      {isActive && projects.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeProject(i)}
                          disabled={disabled}
                          className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-all duration-150 active:scale-90 disabled:opacity-50 p-0.5 rounded"
                          title="Delete project"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      ) : (
                        <FolderOpen className="h-[18px] w-[18px] text-[var(--color-outline-variant)]" />
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto scrollbar-none pr-1">
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
                          className="input-drafting font-semibold text-sm"
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
                          className="input-drafting input-drafting-sm resize-none leading-relaxed text-xs"
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

                      {/* Dynamic links sub-editor as flexible wrapping badges */}
                      <div className="flex flex-col gap-1 pt-1">
                        <label className="field-label text-[10px] flex items-center gap-1">
                          <Link2 className="h-3 w-3 text-[var(--color-primary)]" /> Custom URLs
                        </label>
                        <div className="flex flex-wrap gap-1.5 items-center min-h-[30px] pt-1">
                          {(project.links || []).map((lnk, lIdx) => (
                            <div
                              key={lIdx}
                              className="flex items-center gap-1 px-1.5 py-1 rounded border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] shadow-sm text-[10px] font-mono"
                            >
                              <input
                                type="text"
                                value={lnk.label}
                                onChange={(e) => updateLink(i, lIdx, "label", e.target.value)}
                                disabled={disabled || !isActive}
                                placeholder="Live"
                                className="bg-transparent border-none p-0 outline-none w-[35px] text-[10px] font-mono focus:ring-0 placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]"
                              />
                              <span className="text-[var(--color-outline-variant)]">:</span>
                              <input
                                type="text"
                                value={lnk.url}
                                onChange={(e) => updateLink(i, lIdx, "url", e.target.value)}
                                disabled={disabled || !isActive}
                                placeholder="https://..."
                                className="bg-transparent border-none p-0 outline-none w-[80px] text-[10px] font-mono focus:ring-0 placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]"
                              />
                              <button
                                type="button"
                                onClick={() => removeLink(i, lIdx)}
                                disabled={disabled || !isActive}
                                className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-colors active:scale-90 ml-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addLink(i)}
                            disabled={disabled || !isActive}
                            className="flex items-center gap-1 px-1.5 py-1 rounded border border-dashed border-[var(--color-outline-variant)]/60 text-[10px] font-mono hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Link</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="font-mono text-[9px] text-[var(--color-outline-variant)] tracking-[0.15em] text-center uppercase border-t border-[var(--color-outline-variant)]/50 pt-2 shrink-0">
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
                  translateX = diff * 18 - 145;
                  rotateAngle = diff * 5 - 4;
                  translateY = diff * 3;
                  scale = 0.88 + diff * 0.03;
                  zIndex = 30 + projects.length;
                  opacity = Math.max(0.25, 1 + diff * 0.25);
                } else if (diff > 0) {
                  translateX = diff * 18 + 145;
                  rotateAngle = diff * 5 + 4;
                  translateY = -diff * 3;
                  scale = 0.88 - diff * 0.03;
                  zIndex = 30 - projects.length;
                  opacity = Math.max(0.25, 1 - diff * 0.25);
                } else {
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
                      y: -12,
                      scale: 1.03,
                      zIndex: 50,
                    } : undefined}
                    onClick={disabled ? undefined : (!isActive ? () => setActiveIndex(projects.length) : addProject)}
                    className={`playing-card absolute w-[290px] h-[440px] rounded-xl p-5 flex flex-col justify-center items-center gap-4 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 transition-colors shadow-lg cursor-pointer group`}
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
        <div className="w-full overflow-x-auto py-10 px-16 scrollbar-none flex justify-center">
          <div className="flex flex-row items-center justify-center min-w-max relative h-[480px]">
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
                      y: -24,
                      x: translateX,
                      rotate: 0,
                      scale: 1.04,
                      zIndex: 50,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      delay: i * 0.02,
                    }}
                    className={`playing-card w-[290px] h-[440px] rounded-xl p-5 flex flex-col gap-3.5 flex-shrink-0 relative group/proj blowout-card shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 ${
                      i > 0 ? "-ml-32 md:-ml-38" : ""
                    }`}
                    style={{
                      zIndex: i,
                    }}
                  >
                    {/* Card Header with inline Trash action */}
                    <div className="flex justify-between items-center h-6 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-1">
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-[var(--color-outline-variant)]">
                        PROJECT {String(i + 1).padStart(2, "0")}
                      </span>
                      {projects.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeProject(i)}
                          disabled={disabled}
                          className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-all duration-150 active:scale-90 disabled:opacity-50 p-0.5 rounded"
                          title="Delete project"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      ) : (
                        <FolderOpen className="h-[18px] w-[18px] text-[var(--color-outline-variant)]" />
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto scrollbar-none pr-1">
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
                          className="input-drafting font-semibold text-sm"
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
                          className="input-drafting input-drafting-sm resize-none leading-relaxed text-xs"
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

                      {/* Dynamic links sub-editor as flexible wrapping badges */}
                      <div className="flex flex-col gap-1 pt-1">
                        <label className="field-label text-[10px] flex items-center gap-1">
                          <Link2 className="h-3 w-3 text-[var(--color-primary)]" /> Custom URLs
                        </label>
                        <div className="flex flex-wrap gap-1.5 items-center min-h-[30px] pt-1">
                          {(project.links || []).map((lnk, lIdx) => (
                            <div
                              key={lIdx}
                              className="flex items-center gap-1 px-1.5 py-1 rounded border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] shadow-sm text-[10px] font-mono"
                            >
                              <input
                                type="text"
                                value={lnk.label}
                                onChange={(e) => updateLink(i, lIdx, "label", e.target.value)}
                                disabled={disabled}
                                placeholder="Live"
                                className="bg-transparent border-none p-0 outline-none w-[35px] text-[10px] font-mono focus:ring-0 placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]"
                              />
                              <span className="text-[var(--color-outline-variant)]">:</span>
                              <input
                                type="text"
                                value={lnk.url}
                                onChange={(e) => updateLink(i, lIdx, "url", e.target.value)}
                                disabled={disabled}
                                placeholder="https://..."
                                className="bg-transparent border-none p-0 outline-none w-[80px] text-[10px] font-mono focus:ring-0 placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]"
                              />
                              <button
                                type="button"
                                onClick={() => removeLink(i, lIdx)}
                                disabled={disabled}
                                className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-colors active:scale-90 ml-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addLink(i)}
                            disabled={disabled}
                            className="flex items-center gap-1 px-1.5 py-1 rounded border border-dashed border-[var(--color-outline-variant)]/60 text-[10px] font-mono hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Link</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="font-mono text-[9px] text-[var(--color-outline-variant)] tracking-[0.15em] text-center uppercase border-t border-[var(--color-outline-variant)]/50 pt-2 shrink-0">
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
                      y: -24,
                      x: translateX,
                      rotate: 0,
                      scale: 1.04,
                      zIndex: 50,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      delay: projects.length * 0.02,
                    }}
                    onClick={disabled ? undefined : addProject}
                    className={`w-[290px] h-[440px] rounded-xl p-5 flex flex-col justify-center items-center gap-4 flex-shrink-0 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 transition-colors cursor-pointer group blowout-card animate-fade-up ${
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
