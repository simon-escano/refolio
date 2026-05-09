import { useState, useEffect } from "react";
import { Plus, ChevronUp, ChevronLeft, ChevronRight, Trash2, GraduationCap, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AchievementEntry {
  accomplishment: string;
  evidence_url: string;
}

export interface CredentialEntry {
  type: "education" | "certification";
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
  certification: string;
}

/* ══════════ ACHIEVEMENTS ZONE ══════════ */

interface AchievementsProps {
  achievements: AchievementEntry[];
  onChange: (a: AchievementEntry[]) => void;
  disabled?: boolean;
}

export function AchievementsZone({ achievements, onChange, disabled }: AchievementsProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = achievements.length + 1; // Achievements plus the Add card

  const addAchievement = () => {
    onChange([...achievements, { accomplishment: "", evidence_url: "" }]);
    // Select the newly added slot
    setActiveIndex(achievements.length);
  };

  const removeAchievement = (i: number) => {
    onChange(achievements.filter((_, idx) => idx !== i));
  };

  const update = (i: number, field: keyof AchievementEntry, value: string) => {
    const updated = [...achievements];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  // Keep index within bounds if cards are removed
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
        <div className="drafting-tape -rotate-[0.5deg]">
          Achievements
          {achievements.length > 0 && (
            <span className="ml-2 text-[var(--color-primary)]">{achievements.length}</span>
          )}
        </div>
        <div className={`text-[var(--color-outline)] transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-visible">
          {/* Simple Horizontal Deck Carousel Workspace */}
          <div className="relative w-full h-[240px] overflow-visible flex items-center justify-center py-4 px-10">
            
            {/* Left Nav Arrow */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="absolute left-1 z-50 p-2 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-md flex items-center justify-center hover:translate-x-[-2px] duration-150"
                title="Previous achievement"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {/* Deck Area */}
            <div className="relative w-full max-w-[580px] h-full flex items-center justify-center">
              <AnimatePresence initial={false}>
                {achievements.map((a, i) => {
                  const diff = i - activeIndex;
                  const isActive = diff === 0;

                  // Simple horizontal offsets
                  let translateX = 0;
                  let rotateAngle = 0;
                  let scale = 1;
                  let zIndex = 30;
                  let opacity = 1;

                  if (diff < 0) {
                    translateX = diff * 12 - 40;
                    rotateAngle = diff * 1.5 - 1.5;
                    scale = 0.94;
                    zIndex = 30 + i;
                    opacity = Math.max(0.15, 1 + diff * 0.4);
                  } else if (diff > 0) {
                    translateX = diff * 12 + 40;
                    rotateAngle = diff * 1.5 + 1.5;
                    scale = 0.94;
                    zIndex = 30 - i;
                    opacity = Math.max(0.15, 1 - diff * 0.4);
                  } else {
                    zIndex = 45;
                  }

                  return (
                    <motion.div
                      key={i}
                      layout
                      style={{ zIndex }}
                      animate={{
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
                        y: -8,
                        scale: 1.01,
                        zIndex: 50,
                      } : undefined}
                      onClick={!isActive ? () => setActiveIndex(i) : undefined}
                      className={`playing-card absolute w-full max-w-[580px] rounded-xl p-4 space-y-2.5 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 transition-shadow duration-200 ${
                        !isActive ? "cursor-pointer select-none" : ""
                      }`}
                    >
                      {/* Card Header with inline Trash Action */}
                      <div className="flex justify-between items-center h-6 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-1">
                        <div className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-outline-variant)]">
                          Achievement {String(i + 1).padStart(2, "0")}
                        </div>
                        {isActive && achievements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAchievement(i)}
                            disabled={disabled}
                            className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-all duration-150 active:scale-90 disabled:opacity-50 p-0.5 rounded"
                            title="Delete achievement"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">Accomplishment</label>
                        <textarea
                          value={a.accomplishment}
                          onChange={(e) => update(i, "accomplishment", e.target.value)}
                          disabled={disabled || !isActive}
                          placeholder="What did you accomplish?"
                          rows={2}
                          className="input-drafting input-drafting-sm resize-none leading-relaxed text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">Evidence URL</label>
                        <input
                          type="text"
                          value={a.evidence_url}
                          onChange={(e) => update(i, "evidence_url", e.target.value)}
                          disabled={disabled || !isActive}
                          placeholder="Evidence URL (optional)"
                          className="input-drafting input-drafting-sm font-mono text-xs"
                        />
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add Achievement Card */}
                {(() => {
                  const diff = achievements.length - activeIndex;
                  const isActive = diff === 0;

                  let translateX = 0;
                  let rotateAngle = 0;
                  let scale = 1;
                  let zIndex = 30;
                  let opacity = 1;

                  if (diff < 0) {
                    translateX = diff * 12 - 40;
                    rotateAngle = diff * 1.5 - 1.5;
                    scale = 0.94;
                    zIndex = 30 + achievements.length;
                    opacity = Math.max(0.15, 1 + diff * 0.4);
                  } else if (diff > 0) {
                    translateX = diff * 12 + 40;
                    rotateAngle = diff * 1.5 + 1.5;
                    scale = 0.94;
                    zIndex = 30 - achievements.length;
                    opacity = Math.max(0.15, 1 - diff * 0.4);
                  } else {
                    zIndex = 45;
                  }

                  return (
                    <motion.div
                      key="add-achievement-slot"
                      layout
                      style={{ zIndex }}
                      animate={{
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
                        y: -8,
                        scale: 1.01,
                        zIndex: 50,
                      } : undefined}
                      onClick={disabled ? undefined : (!isActive ? () => setActiveIndex(achievements.length) : addAchievement)}
                      className="playing-card absolute w-full max-w-[580px] h-[195px] rounded-xl flex flex-col justify-center items-center gap-3 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors shadow-md cursor-pointer group"
                    >
                      <Plus className="h-8 w-8 stroke-1 text-[var(--color-outline-variant)] group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-all" />
                      <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                        Add Achievement
                      </span>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Right Nav Arrow */}
            {activeIndex < achievements.length && (
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="absolute right-1 z-50 p-2 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-md flex items-center justify-center hover:translate-x-[2px] duration-150"
                title="Next achievement"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ CREDENTIALS ZONE ══════════ */

interface CredentialsProps {
  credentials: CredentialEntry[];
  onChange: (c: CredentialEntry[]) => void;
  disabled?: boolean;
}

export function CredentialsZone({ credentials, onChange, disabled }: CredentialsProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = credentials.length + 1; // Credentials plus the Add card

  const addCredential = () => {
    onChange([
      ...credentials,
      { type: "education", title: "", institution: "", startDate: "", endDate: "", certification: "" },
    ]);
    // Focus the new slot instantly
    setActiveIndex(credentials.length);
  };

  const removeCredential = (i: number) => {
    onChange(credentials.filter((_, idx) => idx !== i));
  };

  const update = (i: number, field: keyof CredentialEntry, value: string) => {
    const updated = [...credentials];
    updated[i] = { ...updated[i], [field]: value } as CredentialEntry;
    onChange(updated);
  };

  // Sync index bounds
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
        <div className="drafting-tape rotate-[0.5deg]">
          Credentials
          {credentials.length > 0 && (
            <span className="ml-2 text-[var(--color-primary)]">{credentials.length}</span>
          )}
        </div>
        <div className={`text-[var(--color-outline)] transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-visible">
          {/* Simple Horizontal Deck Carousel Workspace */}
          <div className="relative w-full h-[320px] overflow-visible flex items-center justify-center py-4 px-10">

            {/* Left Nav Arrow */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="absolute left-1 z-50 p-2 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-md flex items-center justify-center hover:translate-x-[-2px] duration-150"
                title="Previous credential"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {/* Deck Area */}
            <div className="relative w-full max-w-[580px] h-full flex items-center justify-center">
              <AnimatePresence initial={false}>
                {credentials.map((c, i) => {
                  const diff = i - activeIndex;
                  const isActive = diff === 0;

                  // Compute horizontal stacking values
                  let translateX = 0;
                  let rotateAngle = 0;
                  let scale = 1;
                  let zIndex = 30;
                  let opacity = 1;

                  if (diff < 0) {
                    translateX = diff * 12 - 40;
                    rotateAngle = diff * 1.5 - 1.5;
                    scale = 0.94;
                    zIndex = 30 + i;
                    opacity = Math.max(0.15, 1 + diff * 0.4);
                  } else if (diff > 0) {
                    translateX = diff * 12 + 40;
                    rotateAngle = diff * 1.5 + 1.5;
                    scale = 0.94;
                    zIndex = 30 - i;
                    opacity = Math.max(0.15, 1 - diff * 0.4);
                  } else {
                    zIndex = 45;
                  }

                  return (
                    <motion.div
                      key={i}
                      layout
                      style={{ zIndex }}
                      animate={{
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
                        y: -8,
                        scale: 1.01,
                        zIndex: 50,
                      } : undefined}
                      onClick={!isActive ? () => setActiveIndex(i) : undefined}
                      className={`playing-card absolute w-full max-w-[580px] rounded-xl p-4 space-y-3 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 transition-shadow duration-200 ${
                        !isActive ? "cursor-pointer select-none" : ""
                      }`}
                    >
                      {/* Card Header with inline Trash Action */}
                      <div className="flex justify-between items-center h-6 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-1">
                        <div className="flex items-center gap-2">
                          {c.type === "education" ? (
                            <GraduationCap className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                          ) : (
                            <Award className="h-3.5 w-3.5 text-[var(--color-tertiary)]" />
                          )}
                          <span className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-outline-variant)]">
                            {c.type}
                          </span>
                        </div>
                        {isActive && credentials.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCredential(i)}
                            disabled={disabled}
                            className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-all duration-150 active:scale-90 disabled:opacity-50 p-0.5 rounded"
                            title="Delete credential"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>

                      {/* Type Toggle */}
                      <div className="flex gap-1.5">
                        {(["education", "certification"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update(i, "type", t)}
                            disabled={disabled || !isActive}
                            className={`rounded-md px-3 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase transition-all ${
                              c.type === t
                                ? "bg-[var(--color-primary-fixed)] text-[var(--color-primary)]"
                                : "text-[var(--color-outline-variant)] hover:bg-[var(--color-surface-variant)]"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Content Fields */}
                      {c.type === "education" ? (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="flex flex-col gap-1">
                              <label className="field-label text-[10px]">Degree / Major</label>
                              <input
                                type="text"
                                value={c.title}
                                onChange={(e) => update(i, "title", e.target.value)}
                                disabled={disabled || !isActive}
                                placeholder="BS in Computer Science"
                                className="input-drafting input-drafting-sm font-semibold text-xs"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="field-label text-[10px]">Institution</label>
                              <input
                                type="text"
                                value={c.institution}
                                onChange={(e) => update(i, "institution", e.target.value)}
                                disabled={disabled || !isActive}
                                placeholder="Institution"
                                className="input-drafting input-drafting-sm text-xs"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="field-label text-[10px]">Start Date</label>
                              <input
                                type="date"
                                value={c.startDate}
                                onChange={(e) => update(i, "startDate", e.target.value)}
                                disabled={disabled || !isActive}
                                className="input-drafting input-drafting-sm text-xs font-mono"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="field-label text-[10px]">End Date</label>
                              <input
                                type="date"
                                value={c.endDate}
                                onChange={(e) => update(i, "endDate", e.target.value)}
                                disabled={disabled || !isActive}
                                className="input-drafting input-drafting-sm text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <label className="field-label text-[10px]">Description</label>
                          <textarea
                            value={c.certification}
                            onChange={(e) => update(i, "certification", e.target.value)}
                            disabled={disabled || !isActive}
                            placeholder="Explain your certification"
                            rows={3}
                            className="input-drafting input-drafting-sm resize-none leading-relaxed text-xs"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Add Credential Card */}
                {(() => {
                  const diff = credentials.length - activeIndex;
                  const isActive = diff === 0;

                  let translateX = 0;
                  let rotateAngle = 0;
                  let scale = 1;
                  let zIndex = 30;
                  let opacity = 1;

                  if (diff < 0) {
                    translateX = diff * 12 - 40;
                    rotateAngle = diff * 1.5 - 1.5;
                    scale = 0.94;
                    zIndex = 30 + credentials.length;
                    opacity = Math.max(0.15, 1 + diff * 0.4);
                  } else if (diff > 0) {
                    translateX = diff * 12 + 40;
                    rotateAngle = diff * 1.5 + 1.5;
                    scale = 0.94;
                    zIndex = 30 - credentials.length;
                    opacity = Math.max(0.15, 1 - diff * 0.4);
                  } else {
                    zIndex = 45;
                  }

                  return (
                    <motion.div
                      key="add-credential-slot"
                      layout
                      style={{ zIndex }}
                      animate={{
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
                        y: -8,
                        scale: 1.01,
                        zIndex: 50,
                      } : undefined}
                      onClick={disabled ? undefined : (!isActive ? () => setActiveIndex(credentials.length) : addCredential)}
                      className="playing-card absolute w-full max-w-[580px] h-[280px] rounded-xl flex flex-col justify-center items-center gap-4 border-2 border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/20 backdrop-blur-md hover:bg-[var(--color-surface-container-lowest)]/40 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors shadow-md cursor-pointer group"
                    >
                      <Plus className="h-10 w-10 stroke-1 text-[var(--color-outline-variant)] group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-all" />
                      <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                        Add Credential
                      </span>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Right Nav Arrow */}
            {activeIndex < credentials.length && (
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="absolute right-1 z-50 p-2 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)] transition-all active:scale-90 shadow-md flex items-center justify-center hover:translate-x-[2px] duration-150"
                title="Next credential"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
