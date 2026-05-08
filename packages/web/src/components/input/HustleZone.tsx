import { useState } from "react";
import { Plus, X, ChevronUp, GraduationCap, Award } from "lucide-react";

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

/* ─── Achievements ─── */

interface AchievementsProps {
  achievements: AchievementEntry[];
  onChange: (a: AchievementEntry[]) => void;
  disabled?: boolean;
}

export function AchievementsZone({ achievements, onChange, disabled }: AchievementsProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="relative">
      <button type="button" onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 mb-4 group">
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

      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="playing-card rounded-xl p-4 space-y-3 relative group/ach animate-fade-up card-hover"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => onChange(achievements.filter((_, j) => j !== i))}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)] text-white shadow-md hover:bg-red-700 transition-all opacity-0 group-hover/ach:opacity-100 disabled:opacity-0 active:scale-90 z-20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-outline-variant)]">
                  Achievement {String(i + 1).padStart(2, "0")}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="field-label text-[10px]">Accomplishment</label>
                  <textarea
                    value={a.accomplishment}
                    onChange={(e) => {
                      const updated = [...achievements];
                      updated[i] = { ...updated[i], accomplishment: e.target.value };
                      onChange(updated);
                    }}
                    disabled={disabled}
                    placeholder="What did you accomplish?"
                    rows={2}
                    className="input-drafting input-drafting-sm resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="field-label text-[10px]">Evidence URL</label>
                  <input
                    type="text"
                    value={a.evidence_url}
                    onChange={(e) => {
                      const updated = [...achievements];
                      updated[i] = { ...updated[i], evidence_url: e.target.value };
                      onChange(updated);
                    }}
                    disabled={disabled}
                    placeholder="Evidence URL (optional)"
                    className="input-drafting input-drafting-sm font-mono text-xs"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onChange([...achievements, { accomplishment: "", evidence_url: "" }])}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]/30 py-3 font-mono text-xs font-medium text-[var(--color-outline-variant)] tracking-wider uppercase transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Achievement
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Credentials ─── */

interface CredentialsProps {
  credentials: CredentialEntry[];
  onChange: (c: CredentialEntry[]) => void;
  disabled?: boolean;
}

export function CredentialsZone({ credentials, onChange, disabled }: CredentialsProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="relative">
      <button type="button" onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 mb-4 group">
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

      <div className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-3">
            {credentials.map((c, i) => (
              <div
                key={i}
                className="playing-card rounded-xl p-4 space-y-3 relative group/cred animate-fade-up card-hover"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => onChange(credentials.filter((_, j) => j !== i))}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)] text-white shadow-md hover:bg-red-700 transition-all opacity-0 group-hover/cred:opacity-100 disabled:opacity-0 active:scale-90 z-20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

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

                {/* Type Toggle */}
                <div className="flex gap-1.5">
                  {(["education", "certification"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        const updated = [...credentials];
                        updated[i] = { ...updated[i], type: t };
                        onChange(updated);
                      }}
                      disabled={disabled}
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

                {/* Dynamic Fields */}
                {c.type === "education" ? (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="field-label text-[10px]">Degree / Major</label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => {
                          const updated = [...credentials];
                          updated[i] = { ...updated[i], title: e.target.value };
                          onChange(updated);
                        }}
                        disabled={disabled}
                        placeholder="BS in Computer Science"
                        className="input-drafting input-drafting-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="field-label text-[10px]">Institution</label>
                      <input
                        type="text"
                        value={c.institution}
                        onChange={(e) => {
                          const updated = [...credentials];
                          updated[i] = { ...updated[i], institution: e.target.value };
                          onChange(updated);
                        }}
                        disabled={disabled}
                        placeholder="Institution"
                        className="input-drafting input-drafting-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">Start Date</label>
                        <input
                          type="date"
                          value={c.startDate}
                          onChange={(e) => {
                            const updated = [...credentials];
                            updated[i] = { ...updated[i], startDate: e.target.value };
                            onChange(updated);
                          }}
                          disabled={disabled}
                          className="input-drafting input-drafting-sm text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="field-label text-[10px]">End Date</label>
                        <input
                          type="date"
                          value={c.endDate}
                          onChange={(e) => {
                            const updated = [...credentials];
                            updated[i] = { ...updated[i], endDate: e.target.value };
                            onChange(updated);
                          }}
                          disabled={disabled}
                          className="input-drafting input-drafting-sm text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="field-label text-[10px]">Description</label>
                    <textarea
                      value={c.certification}
                      onChange={(e) => {
                        const updated = [...credentials];
                        updated[i] = { ...updated[i], certification: e.target.value };
                        onChange(updated);
                      }}
                      disabled={disabled}
                      placeholder="Explain your certification"
                      rows={3}
                      className="input-drafting input-drafting-sm resize-none leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                onChange([
                  ...credentials,
                  { type: "education", title: "", institution: "", startDate: "", endDate: "", certification: "" },
                ])
              }
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]/30 py-3 font-mono text-xs font-medium text-[var(--color-outline-variant)] tracking-wider uppercase transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Credential
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
