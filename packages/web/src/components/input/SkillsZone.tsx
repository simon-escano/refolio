import { useState } from "react";
import { Plus, X, ChevronUp } from "lucide-react";

export interface SkillEntry {
  title: string;
  proficiency: number;
}

export interface LanguageEntry {
  title: string;
  proficiency: number;
}

interface Props {
  tech: SkillEntry[];
  languages: LanguageEntry[];
  onTechChange: (tech: SkillEntry[]) => void;
  onLanguagesChange: (languages: LanguageEntry[]) => void;
  disabled?: boolean;
}

export function SkillsZone({ tech, languages, onTechChange, onLanguagesChange, disabled }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="relative">
      {/* Tape + Toggle Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 mb-4 group"
      >
        <div className="drafting-tape rotate-1">
          Skills
        </div>
        <div className={`text-[var(--color-outline)] transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-6">
            {/* Tech Proficiency Module */}
            <div className="playing-card rounded-xl p-5 space-y-4">
              <h4 className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-primary)]">
                Tech Proficiency
              </h4>

              <div className="space-y-3">
                {tech.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <input
                      type="text"
                      value={skill.title}
                      onChange={(e) => {
                        const updated = [...tech];
                        updated[i] = { ...updated[i], title: e.target.value };
                        onTechChange(updated);
                      }}
                      disabled={disabled}
                      placeholder="Skill (e.g. React)"
                      className="input-drafting input-drafting-sm flex-1"
                    />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }, (_, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => {
                            const updated = [...tech];
                            updated[i] = { ...updated[i], proficiency: j + 1 };
                            onTechChange(updated);
                          }}
                          disabled={disabled}
                          className={`h-4 w-2 rounded-[1px] transition-all duration-150 ${
                            j < skill.proficiency
                              ? "bg-[var(--color-primary)]"
                              : "bg-[var(--color-surface-variant)]"
                          } hover:bg-[var(--color-primary-container)] disabled:opacity-50`}
                          title={`${j + 1}/10`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => onTechChange(tech.filter((_, idx) => idx !== i))}
                      disabled={disabled}
                      className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-colors disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onTechChange([...tech, { title: "", proficiency: 5 }])}
                disabled={disabled}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-outline-variant)] py-2 font-mono text-[10px] font-medium text-[var(--color-outline-variant)] tracking-wider uppercase transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                Add Tech Skill
              </button>
            </div>

            {/* Languages Module */}
            <div className="playing-card rounded-xl p-5 space-y-4">
              <h4 className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-primary)]">
                Languages
              </h4>

              <div className="space-y-3">
                {languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <input
                      type="text"
                      value={lang.title}
                      onChange={(e) => {
                        const updated = [...languages];
                        updated[i] = { ...updated[i], title: e.target.value };
                        onLanguagesChange(updated);
                      }}
                      disabled={disabled}
                      placeholder="Language (e.g. Japanese)"
                      className="input-drafting input-drafting-sm flex-1"
                    />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }, (_, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => {
                            const updated = [...languages];
                            updated[i] = { ...updated[i], proficiency: j + 1 };
                            onLanguagesChange(updated);
                          }}
                          disabled={disabled}
                          className={`h-4 w-2 rounded-[1px] transition-all duration-150 ${
                            j < lang.proficiency
                              ? "bg-[var(--color-secondary)]"
                              : "bg-[var(--color-surface-variant)]"
                          } hover:bg-[var(--color-secondary-container)] disabled:opacity-50`}
                          title={`${j + 1}/10`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => onLanguagesChange(languages.filter((_, idx) => idx !== i))}
                      disabled={disabled}
                      className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-colors disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onLanguagesChange([...languages, { title: "", proficiency: 5 }])}
                disabled={disabled}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-outline-variant)] py-2 font-mono text-[10px] font-medium text-[var(--color-outline-variant)] tracking-wider uppercase transition-all hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                Add Language
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
