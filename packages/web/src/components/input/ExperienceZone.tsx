import { useState, useEffect } from "react";
import { Plus, ChevronUp, ChevronDown, Trash2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  contributions: string;
}

interface Props {
  experience: ExperienceEntry[];
  onChange: (experience: ExperienceEntry[]) => void;
  disabled?: boolean;
}

const emptyExperience: ExperienceEntry = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  contributions: "",
};

export function ExperienceZone({ experience, onChange, disabled }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = experience.length + 1; // Experiences plus the Add card

  const addExperience = () => {
    onChange([...experience, { ...emptyExperience }]);
    // Focus the new card instantly
    setActiveIndex(experience.length);
  };

  const removeExperience = (i: number) => {
    onChange(experience.filter((_, idx) => idx !== i));
  };

  const update = (i: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...experience];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  // Prevent index out of bounds when experiences are deleted
  useEffect(() => {
    if (activeIndex >= totalCards) {
      setActiveIndex(Math.max(0, totalCards - 1));
    }
  }, [totalCards, activeIndex]);

  return (
    <section className="relative z-0">
      {/* Tape + Toggle Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 mb-4 group"
      >
        <div className="drafting-tape -rotate-1">
          Experience
          {experience.length > 0 && (
            <span className="ml-2 text-[var(--color-primary)]">{experience.length}</span>
          )}
        </div>
        <div className={`text-[var(--color-outline)] transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-visible">
          {/* ═══ UNIFIED VERTICAL DECK SYSTEM (Always Active) ═══ */}
          <div className="relative w-full h-[400px] overflow-visible flex flex-col items-center justify-center py-10 px-4">
            
            {/* Top Cycle Arrow */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="absolute top-1 sm:top-2 z-50 p-2.5 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-md flex items-center justify-center hover:translate-y-[-2px] duration-150"
                title="Previous experience"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            )}

            {/* Absolute stacked workspace */}
            <div className="relative w-full max-w-[580px] h-full flex items-center justify-center">
              <AnimatePresence initial={false}>
                {experience.map((exp, i) => {
                  const diff = i - activeIndex;
                  const isActive = diff === 0;

                  // Compute vertical stacking offsets
                  let translateY = 0;
                  let translateX = 0;
                  let rotateAngle = 0;
                  let scale = 1;
                  let zIndex = 30;
                  let opacity = 1;

                  if (diff < 0) {
                    // Bunched on the top
                    translateY = diff * 10 - 70;
                    translateX = diff * 4;
                    rotateAngle = diff * 3 - 3;
                    scale = 0.88 + diff * 0.03;
                    zIndex = 30 + i;
                    opacity = Math.max(0.2, 1 + diff * 0.25);
                  } else if (diff > 0) {
                    // Bunched at the bottom
                    translateY = diff * 10 + 70;
                    translateX = -diff * 4;
                    rotateAngle = diff * 3 + 3;
                    scale = 0.88 - diff * 0.03;
                    zIndex = 30 - i;
                    opacity = Math.max(0.2, 1 - diff * 0.25);
                  } else {
                    // Fully active in the center
                    zIndex = 45;
                  }

                  return (
                    <motion.div
                      key={i}
                      layout
                      style={{ zIndex }}
                      animate={{
                        y: translateY,
                        x: translateX,
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
                        scale: 1.02,
                        zIndex: 50,
                      } : undefined}
                      onClick={!isActive ? () => setActiveIndex(i) : undefined}
                      className={`playing-card absolute w-full max-w-[580px] rounded-xl p-5 space-y-3 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 transition-shadow duration-200 ${
                        !isActive ? "cursor-pointer select-none" : ""
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-center h-6 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-[var(--color-outline-variant)]" />
                          <span className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-outline-variant)]">
                            Role {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        {isActive && experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(i)}
                            disabled={disabled}
                            className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-all duration-150 active:scale-90 disabled:opacity-50"
                            title="Delete experience"
                          >
                            <Trash2 className="h-[18px] w-[18px]" />
                          </button>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="field-label text-[10px]">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => update(i, "role", e.target.value)}
                            disabled={disabled || !isActive}
                            placeholder="Senior Backend Engineer"
                            className="input-drafting input-drafting-sm font-semibold"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="field-label text-[10px]">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => update(i, "company", e.target.value)}
                            disabled={disabled || !isActive}
                            placeholder="Acme Corp"
                            className="input-drafting input-drafting-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => update(i, "location", e.target.value)}
                          disabled={disabled || !isActive}
                          placeholder="San Francisco, Remote"
                          className="input-drafting input-drafting-sm text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="field-label text-[10px]">Start Date</label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => update(i, "startDate", e.target.value)}
                            disabled={disabled || !isActive}
                            className="input-drafting input-drafting-sm text-xs font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="field-label text-[10px]">End Date</label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => update(i, "endDate", e.target.value)}
                            disabled={disabled || !isActive}
                            className="input-drafting input-drafting-sm text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">Contributions</label>
                        <textarea
                          value={exp.contributions}
                          onChange={(e) => update(i, "contributions", e.target.value)}
                          disabled={disabled || !isActive}
                          placeholder="What did you contribute?"
                          rows={2}
                          className="input-drafting input-drafting-sm resize-none leading-relaxed text-xs"
                        />
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add Experience Card */}
                {(() => {
                  const diff = experience.length - activeIndex;
                  const isActive = diff === 0;

                  let translateY = 0;
                  let translateX = 0;
                  let rotateAngle = 0;
                  let scale = 1;
                  let zIndex = 30;
                  let opacity = 1;

                  if (diff < 0) {
                    translateY = diff * 10 - 70;
                    translateX = diff * 4;
                    rotateAngle = diff * 3 - 3;
                    scale = 0.88 + diff * 0.03;
                    zIndex = 30 + experience.length;
                    opacity = Math.max(0.2, 1 + diff * 0.25);
                  } else if (diff > 0) {
                    translateY = diff * 10 + 70;
                    translateX = -diff * 4;
                    rotateAngle = diff * 3 + 3;
                    scale = 0.88 - diff * 0.03;
                    zIndex = 30 - experience.length;
                    opacity = Math.max(0.2, 1 - diff * 0.25);
                  } else {
                    zIndex = 45;
                  }

                  return (
                    <motion.div
                      key="add-experience-slot"
                      layout
                      style={{ zIndex }}
                      animate={{
                        y: translateY,
                        x: translateX,
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
                        scale: 1.02,
                        zIndex: 50,
                      } : undefined}
                      onClick={disabled ? undefined : (!isActive ? () => setActiveIndex(experience.length) : addExperience)}
                      className={`playing-card absolute w-full max-w-[580px] h-[360px] rounded-xl p-5 flex flex-col justify-center items-center gap-4 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors shadow-lg cursor-pointer group`}
                    >
                      <Plus className="h-10 w-10 stroke-1 text-[var(--color-outline-variant)] group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-all" />
                      <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                        Add Experience
                      </span>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Bottom Cycle Arrow */}
            {activeIndex < experience.length && (
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="absolute bottom-1 sm:bottom-2 z-50 p-2.5 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-md flex items-center justify-center hover:translate-y-[2px] duration-150"
                title="Next experience"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
