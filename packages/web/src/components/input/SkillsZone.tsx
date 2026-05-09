import { useState } from "react";
import { Plus, X, ChevronUp, Languages, Cpu } from "lucide-react";

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

  // Tech change helpers
  const updateTechTitle = (i: number, title: string) => {
    const updated = [...tech];
    updated[i] = { ...updated[i], title };
    onTechChange(updated);
  };

  const updateTechProficiency = (i: number, proficiency: number) => {
    const updated = [...tech];
    updated[i] = { ...updated[i], proficiency };
    onTechChange(updated);
  };

  const addTech = () => {
    onTechChange([...tech, { title: "", proficiency: 5 }]);
  };

  const removeTech = (i: number) => {
    onTechChange(tech.filter((_, idx) => idx !== i));
  };

  // Language change helpers
  const updateLanguageTitle = (i: number, title: string) => {
    const updated = [...languages];
    updated[i] = { ...updated[i], title };
    onLanguagesChange(updated);
  };

  const updateLanguageProficiency = (i: number, proficiency: number) => {
    const updated = [...languages];
    updated[i] = { ...updated[i], proficiency };
    onLanguagesChange(updated);
  };

  const addLanguage = () => {
    onLanguagesChange([...languages, { title: "", proficiency: 5 }]);
  };

  const removeLanguage = (i: number) => {
    onLanguagesChange(languages.filter((_, idx) => idx !== i));
  };

  // Helper to validate and clamp typed proficiency scores (0-10)
  const handleProficiencyChange = (valStr: string, isTech: boolean, idx: number) => {
    const digits = valStr.replace(/\D/g, ""); // Keep only digits
    let num = digits === "" ? 0 : Number(digits);
    if (num > 10) num = 10; // Cap at 10
    
    if (isTech) {
      updateTechProficiency(idx, num);
    } else {
      updateLanguageProficiency(idx, num);
    }
  };

  return (
    <section className="relative z-0">
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

      {/* Collapsible Content */}
      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ═══ TECH PROFICIENCY MODULE ═══ */}
            <div className="playing-card rounded-xl p-5 flex flex-col gap-4 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 relative">
              <div className="flex items-center gap-2 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-1">
                <Cpu className="h-4 w-4 text-[var(--color-primary)]" />
                <h4 className="font-mono text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-primary)]">
                  Tech Proficiency
                </h4>
              </div>

              {/* Flex wrapping badges container */}
              <div className="flex flex-wrap gap-2.5 items-center min-h-[50px]">
                {tech.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-lowest)] shadow-sm hover:border-[var(--color-primary)]/60 transition-all duration-150 font-mono text-xs"
                  >
                    {/* Inline title input */}
                    <input
                      type="text"
                      value={skill.title}
                      onChange={(e) => updateTechTitle(i, e.target.value)}
                      disabled={disabled}
                      placeholder="React"
                      className="bg-transparent border-none p-0 outline-none w-[80px] text-xs font-mono font-medium focus:ring-0 placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]"
                    />
                    
                    <span className="text-[var(--color-outline-variant)]">:</span>

                    {/* Typed inline proficiency value */}
                    <div className="flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={skill.proficiency === 0 ? "" : skill.proficiency}
                        onChange={(e) => handleProficiencyChange(e.target.value, true, i)}
                        disabled={disabled}
                        placeholder="5"
                        className="bg-transparent border-none p-0 outline-none w-5 text-xs font-mono font-bold text-[var(--color-primary)] text-center focus:ring-0"
                        title="Proficiency (1-10)"
                      />
                      <span className="text-[var(--color-outline-variant)] text-[10px] scale-90">/10</span>
                    </div>

                    {/* Direct Badge delete button */}
                    <button
                      type="button"
                      onClick={() => removeTech(i)}
                      disabled={disabled}
                      className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-colors active:scale-90 ml-1 p-0.5 rounded"
                      title="Delete skill"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add Badge slot inside the badge flow */}
                <button
                  type="button"
                  onClick={addTech}
                  disabled={disabled}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/30 backdrop-blur-sm text-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-container-lowest)] transition-all font-mono text-xs cursor-pointer active:scale-95"
                  title="Add skill"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>

            {/* ═══ LANGUAGES MODULE ═══ */}
            <div className="playing-card rounded-xl p-5 flex flex-col gap-4 shadow-md bg-[var(--color-surface-container-lowest)]/85 backdrop-blur-md border border-[var(--color-outline-variant)]/40 relative">
              <div className="flex items-center gap-2 border-b border-[var(--color-outline-variant)]/30 pb-2 mb-1">
                <Languages className="h-4 w-4 text-[var(--color-secondary)]" />
                <h4 className="font-mono text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-secondary)]">
                  Languages
                </h4>
              </div>

              {/* Flex wrapping badges container */}
              <div className="flex flex-wrap gap-2.5 items-center min-h-[50px]">
                {languages.map((lang, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-lowest)] shadow-sm hover:border-[var(--color-secondary)]/60 transition-all duration-150 font-mono text-xs"
                  >
                    {/* Inline title input */}
                    <input
                      type="text"
                      value={lang.title}
                      onChange={(e) => updateLanguageTitle(i, e.target.value)}
                      disabled={disabled}
                      placeholder="Japanese"
                      className="bg-transparent border-none p-0 outline-none w-[80px] text-xs font-mono font-medium focus:ring-0 placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]"
                    />

                    <span className="text-[var(--color-outline-variant)]">:</span>

                    {/* Typed inline proficiency value */}
                    <div className="flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={lang.proficiency === 0 ? "" : lang.proficiency}
                        onChange={(e) => handleProficiencyChange(e.target.value, false, i)}
                        disabled={disabled}
                        placeholder="5"
                        className="bg-transparent border-none p-0 outline-none w-5 text-xs font-mono font-bold text-[var(--color-secondary)] text-center focus:ring-0"
                        title="Proficiency (1-10)"
                      />
                      <span className="text-[var(--color-outline-variant)] text-[10px] scale-90">/10</span>
                    </div>

                    {/* Direct Badge delete button */}
                    <button
                      type="button"
                      onClick={() => removeLanguage(i)}
                      disabled={disabled}
                      className="text-[var(--color-outline-variant)] hover:text-[var(--color-error)] transition-colors active:scale-90 ml-1 p-0.5 rounded"
                      title="Delete language"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add Badge slot inside the language flow */}
                <button
                  type="button"
                  onClick={addLanguage}
                  disabled={disabled}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-outline-variant)]/60 bg-[var(--color-surface-container-lowest)]/30 backdrop-blur-sm text-[var(--color-outline-variant)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-lowest)] transition-all font-mono text-xs cursor-pointer active:scale-95"
                  title="Add language"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Language</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
