import { useState } from "react";
import { Plus, X, ChevronUp } from "lucide-react";

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

  const addExperience = () => onChange([...experience, { ...emptyExperience }]);
  const removeExperience = (i: number) => onChange(experience.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...experience];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <section className="relative">
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
        <div className="overflow-hidden">
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div
                key={i}
                className="playing-card rounded-xl p-5 space-y-3 relative group/exp animate-fade-up card-hover"
                style={{
                  animationDelay: `${i * 60}ms`,
                  transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)`,
                }}
              >
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeExperience(i)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)] text-white shadow-md hover:bg-red-700 transition-all opacity-0 group-hover/exp:opacity-100 disabled:opacity-0 active:scale-90 z-20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-[var(--color-outline-variant)]">
                  Role {String(i + 1).padStart(2, "0")}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="field-label text-[10px]">Role</label>
                    <input type="text" value={exp.role} onChange={(e) => update(i, "role", e.target.value)} disabled={disabled} placeholder="Senior Backend Engineer" className="input-drafting input-drafting-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="field-label text-[10px]">Company</label>
                    <input type="text" value={exp.company} onChange={(e) => update(i, "company", e.target.value)} disabled={disabled} placeholder="Acme Corp" className="input-drafting input-drafting-sm" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="field-label text-[10px]">Location</label>
                  <input type="text" value={exp.location} onChange={(e) => update(i, "location", e.target.value)} disabled={disabled} placeholder="San Francisco, Remote" className="input-drafting input-drafting-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="field-label text-[10px]">Start Date</label>
                    <input type="date" value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} disabled={disabled} className="input-drafting input-drafting-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="field-label text-[10px]">End Date</label>
                    <input type="date" value={exp.endDate} onChange={(e) => update(i, "endDate", e.target.value)} disabled={disabled} className="input-drafting input-drafting-sm" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="field-label text-[10px]">Contributions</label>
                  <textarea value={exp.contributions} onChange={(e) => update(i, "contributions", e.target.value)} disabled={disabled} placeholder="What did you contribute?" rows={3} className="input-drafting input-drafting-sm resize-none leading-relaxed" />
                </div>
              </div>
            ))}

            {/* Add Experience */}
            <button
              type="button"
              onClick={addExperience}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]/30 py-3.5 font-mono text-xs font-medium text-[var(--color-outline-variant)] tracking-wider uppercase transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-fixed)]/10 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Experience
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
