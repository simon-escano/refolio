import { useState } from "react";
import { Code, Globe, Plus, Trash2, ChevronUp } from "lucide-react";

export interface SkillEntry {
  title: string;
  category?: string;
  proficiency: number;
}

export interface LanguageEntry {
  title: string;
  proficiency: number;
}

interface Props {
  tech: SkillEntry[];
  languages: LanguageEntry[];
  onTechChange: (data: SkillEntry[]) => void;
  onLanguagesChange: (data: LanguageEntry[]) => void;
  disabled?: boolean;
}

export function SkillsZone({ tech, languages, onTechChange, onLanguagesChange, disabled }: Props) {
  const [techExpanded, setTechExpanded] = useState(true);
  const [langExpanded, setLangExpanded] = useState(true);

  // -- Tech Handlers --
  const updateTech = (index: number, field: keyof SkillEntry, value: string | number) => {
    const next = [...tech];
    next[index] = { ...next[index], [field]: value };
    onTechChange(next);
  };
  const addTech = () => onTechChange([...tech, { title: "", category: "", proficiency: 5 }]);
  const removeTech = (index: number) => onTechChange(tech.filter((_, i) => i !== index));

  // -- Language Handlers --
  const updateLang = (index: number, field: keyof LanguageEntry, value: string | number) => {
    const next = [...languages];
    next[index] = { ...next[index], [field]: value };
    onLanguagesChange(next);
  };
  const addLang = () => onLanguagesChange([...languages, { title: "", proficiency: 5 }]);
  const removeLang = (index: number) => onLanguagesChange(languages.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {/* Tech Skills */}
      <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up stagger-4">
        <button
          type="button"
          onClick={() => setTechExpanded(!techExpanded)}
          className="flex w-full items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent p-4 transition-colors hover:bg-emerald-500/15"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/20">
              <Code className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h2 className="text-sm font-semibold text-(--color-text)">Tech Proficiency</h2>
              <p className="text-[11px] text-(--color-text-secondary)">Languages, tools, software</p>
            </div>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {tech.length}
            </span>
            <div className={`text-(--color-text-muted) transition-transform duration-300 ${techExpanded ? "" : "-rotate-180"}`}>
              <ChevronUp className="h-4 w-4" />
            </div>
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${techExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="p-4 space-y-3 bg-(--color-bg)/30">
            {tech.map((t, i) => (
              <div key={i} className="group relative flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => removeTech(i)}
                  disabled={disabled}
                  className="rounded-md p-1.5 text-(--color-text-muted) hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 disabled:opacity-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <input
                  value={t.title}
                  onChange={(e) => updateTech(i, "title", e.target.value)}
                  disabled={disabled}
                  placeholder="Skill (e.g. React)"
                  className="input-field flex-1 min-w-[100px]"
                />
                <input
                  value={t.category || ""}
                  onChange={(e) => updateTech(i, "category", e.target.value)}
                  disabled={disabled}
                  placeholder="Category"
                  className="input-field w-1/4 min-w-[70px]"
                />
                <div className="flex flex-col items-center gap-1 w-[60px]">
                  <label className="text-[9px] font-bold uppercase text-(--color-text-muted)">{t.proficiency}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={t.proficiency}
                    onChange={(e) => updateTech(i, "proficiency", parseInt(e.target.value, 10))}
                    disabled={disabled}
                    className="w-full h-1.5 bg-(--color-border) rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTech}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-2.5 text-xs font-medium text-(--color-text-muted) transition-all hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Tech Skill
            </button>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up stagger-5">
        <button
          type="button"
          onClick={() => setLangExpanded(!langExpanded)}
          className="flex w-full items-center justify-between bg-gradient-to-r from-orange-500/10 to-transparent p-4 transition-colors hover:bg-orange-500/15"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h2 className="text-sm font-semibold text-(--color-text)">Languages</h2>
              <p className="text-[11px] text-(--color-text-secondary)">Spoken & written</p>
            </div>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30 px-1.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 tabular-nums">
              {languages.length}
            </span>
            <div className={`text-(--color-text-muted) transition-transform duration-300 ${langExpanded ? "" : "-rotate-180"}`}>
              <ChevronUp className="h-4 w-4" />
            </div>
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${langExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="p-4 space-y-3 bg-(--color-bg)/30">
            {languages.map((l, i) => (
              <div key={i} className="group relative flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => removeLang(i)}
                  disabled={disabled}
                  className="rounded-md p-1.5 text-(--color-text-muted) hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 disabled:opacity-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <input
                  value={l.title}
                  onChange={(e) => updateLang(i, "title", e.target.value)}
                  disabled={disabled}
                  placeholder="Language (e.g. Japanese)"
                  className="input-field flex-1"
                />
                <div className="flex flex-col items-center gap-1 w-[60px]">
                  <label className="text-[9px] font-bold uppercase text-(--color-text-muted)">{l.proficiency}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={l.proficiency}
                    onChange={(e) => updateLang(i, "proficiency", parseInt(e.target.value, 10))}
                    disabled={disabled}
                    className="w-full h-1.5 bg-(--color-border) rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLang}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-2.5 text-xs font-medium text-(--color-text-muted) transition-all hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
