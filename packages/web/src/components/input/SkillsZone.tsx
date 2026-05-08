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

function ProficiencyBars({
  value,
  onChange,
  disabled
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1 mt-1 cursor-pointer w-24" onMouseLeave={() => {}}>
      {Array.from({ length: 10 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i + 1)}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < value ? "bg-(--color-accent)" : "bg-(--color-border) hover:bg-(--color-border-focus)"
          }`}
        />
      ))}
    </div>
  );
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
  const addTech = () => onTechChange([...tech, { title: "", proficiency: 5 }]);
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
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-purple-500 text-white shadow-sm">
              <Code className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Tech Proficiency</h3>
              <p className="text-[11px] text-(--color-text-secondary)">Languages, tools, software</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30 px-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              {tech.length}
            </span>
            <div className={`text-(--color-text-muted) transition-transform duration-300 ${techExpanded ? "" : "-rotate-180"}`}>
              <ChevronUp className="h-4 w-4" />
            </div>
          </div>
        </button>

        <div
          className={`grid transition-all duration-300 ease-out ${
            techExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 px-5 pb-5 pt-1">
            {tech.map((t, i) => (
              <div 
                key={i} 
                className="group/proj flex items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-4 shadow-xs transition-colors hover:border-(--color-border-focus) animate-scale-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  type="button"
                  onClick={() => removeTech(i)}
                  disabled={disabled}
                  className="rounded-md p-1.5 text-(--color-text-muted) hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 opacity-0 group-hover/proj:opacity-100 transition-all disabled:opacity-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <input
                    value={t.title}
                    onChange={(e) => updateTech(i, "title", e.target.value)}
                    disabled={disabled}
                    placeholder="Skill (e.g. React)"
                    className="w-full bg-transparent text-sm font-medium text-(--color-text) placeholder:text-(--color-text-muted) outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <label className="text-[9px] font-bold uppercase text-(--color-text-muted)">{t.proficiency}/10</label>
                  <ProficiencyBars value={t.proficiency} onChange={(v) => updateTech(i, "proficiency", v)} disabled={disabled} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTech}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-3 text-xs font-medium text-(--color-text-muted) transition-all hover:border-(--color-accent) hover:text-(--color-accent) hover:bg-(--color-accent-subtle)/30 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Tech Skill
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up stagger-5">
        <button
          type="button"
          onClick={() => setLangExpanded(!langExpanded)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Languages</h3>
              <p className="text-[11px] text-(--color-text-secondary)">Spoken & written</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/30 px-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {languages.length}
            </span>
            <div className={`text-(--color-text-muted) transition-transform duration-300 ${langExpanded ? "" : "-rotate-180"}`}>
              <ChevronUp className="h-4 w-4" />
            </div>
          </div>
        </button>

        <div
          className={`grid transition-all duration-300 ease-out ${
            langExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 px-5 pb-5 pt-1">
            {languages.map((l, i) => (
              <div 
                key={i} 
                className="group/proj flex items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-4 shadow-xs transition-colors hover:border-(--color-border-focus) animate-scale-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  type="button"
                  onClick={() => removeLang(i)}
                  disabled={disabled}
                  className="rounded-md p-1.5 text-(--color-text-muted) hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 opacity-0 group-hover/proj:opacity-100 transition-all disabled:opacity-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <input
                    value={l.title}
                    onChange={(e) => updateLang(i, "title", e.target.value)}
                    disabled={disabled}
                    placeholder="Language (e.g. Japanese)"
                    className="w-full bg-transparent text-sm font-medium text-(--color-text) placeholder:text-(--color-text-muted) outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <label className="text-[9px] font-bold uppercase text-(--color-text-muted)">{l.proficiency}/10</label>
                  <ProficiencyBars value={l.proficiency} onChange={(v) => updateLang(i, "proficiency", v)} disabled={disabled} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLang}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-3 text-xs font-medium text-(--color-text-muted) transition-all hover:border-(--color-accent) hover:text-(--color-accent) hover:bg-(--color-accent-subtle)/30 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Language
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
