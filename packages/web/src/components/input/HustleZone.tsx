import { useState } from "react";
import { Trophy, Plus, X, ChevronUp, GraduationCap, Award } from "lucide-react";

export interface AchievementEntry {
  accomplishment: string;
  evidence_url: string;
}

export interface CredentialEntry {
  type: "education" | "certification";
  // Education fields
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
  // Certification fields
  certification: string;
}

interface Props {
  achievements: AchievementEntry[];
  credentials: CredentialEntry[];
  onAchievementsChange: (a: AchievementEntry[]) => void;
  onCredentialsChange: (c: CredentialEntry[]) => void;
  disabled?: boolean;
}

export function HustleZone({
  achievements,
  credentials,
  onAchievementsChange,
  onCredentialsChange,
  disabled,
}: Props) {
  const [achievementsExpanded, setAchievementsExpanded] = useState(true);
  const [credentialsExpanded, setCredentialsExpanded] = useState(true);

  return (
    <div className="space-y-3">
      {/* Achievements Section */}
      <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up stagger-2">
        <button
          type="button"
          onClick={() => setAchievementsExpanded(!achievementsExpanded)}
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-sm shadow-red-500/20">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Achievements</h3>
            <p className="text-[11px] text-(--color-text-muted)">
              Milestones, awards & notable accomplishments
            </p>
          </div>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30 px-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {achievements.length}
          </span>
          <div className={`text-(--color-text-muted) transition-transform duration-300 ${achievementsExpanded ? "" : "-rotate-180"}`}>
            <ChevronUp className="h-4 w-4" />
          </div>
        </button>

        <div className={`grid transition-all duration-300 ease-out ${achievementsExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="space-y-3 px-5 pb-5 pt-1">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className="group/ach relative rounded-xl border border-(--color-border) bg-(--color-bg) p-3.5 space-y-2.5 animate-scale-in hover:border-(--color-border-focus) transition-all"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Offset Delete Button */}
                  <button
                    type="button"
                    onClick={() => onAchievementsChange(achievements.filter((_, j) => j !== i))}
                    disabled={disabled}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-all opacity-0 group-hover/ach:opacity-100 disabled:opacity-0 active:scale-90"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
                      Achievement {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <textarea
                    value={a.accomplishment}
                    onChange={(e) => {
                      const updated = [...achievements];
                      updated[i] = { ...updated[i], accomplishment: e.target.value };
                      onAchievementsChange(updated);
                    }}
                    disabled={disabled}
                    placeholder="What did you accomplish? (e.g. Rank #1 in Batch, Published an article on dev.to)"
                    rows={2}
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50 resize-none"
                  />
                  <input
                    type="text"
                    value={a.evidence_url}
                    onChange={(e) => {
                      const updated = [...achievements];
                      updated[i] = { ...updated[i], evidence_url: e.target.value };
                      onAchievementsChange(updated);
                    }}
                    disabled={disabled}
                    placeholder="Evidence URL (optional)"
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => onAchievementsChange([...achievements, { accomplishment: "", evidence_url: "" }])}
                disabled={disabled}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-2.5 text-xs font-medium text-(--color-text-muted) transition-all hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/30 dark:hover:bg-red-950/10 disabled:opacity-50 active:scale-[0.98]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Achievement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up stagger-3">
        <button
          type="button"
          onClick={() => setCredentialsExpanded(!credentialsExpanded)}
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-sm shadow-purple-500/20">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Credentials</h3>
            <p className="text-[11px] text-(--color-text-muted)">
              Education & certifications
            </p>
          </div>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-950/30 px-1.5 text-[10px] font-bold text-violet-600 dark:text-violet-400 tabular-nums">
            {credentials.length}
          </span>
          <div className={`text-(--color-text-muted) transition-transform duration-300 ${credentialsExpanded ? "" : "-rotate-180"}`}>
            <ChevronUp className="h-4 w-4" />
          </div>
        </button>

        <div className={`grid transition-all duration-300 ease-out ${credentialsExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="space-y-3 px-5 pb-5 pt-1">
              {credentials.map((c, i) => (
                <div
                  key={i}
                  className="group/cred relative rounded-xl border border-(--color-border) bg-(--color-bg) p-3.5 space-y-2.5 animate-scale-in hover:border-(--color-border-focus) transition-all"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Offset Delete Button */}
                  <button
                    type="button"
                    onClick={() => onCredentialsChange(credentials.filter((_, j) => j !== i))}
                    disabled={disabled}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-all opacity-0 group-hover/cred:opacity-100 disabled:opacity-0 active:scale-90"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.type === "education" ? (
                        <GraduationCap className="h-3 w-3 text-violet-500" />
                      ) : (
                        <Award className="h-3 w-3 text-blue-500" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
                        {c.type}
                      </span>
                    </div>
                  </div>

                  {/* Type toggle */}
                  <div className="flex gap-1.5">
                    {(["education", "certification"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          const updated = [...credentials];
                          updated[i] = { ...updated[i], type: t };
                          onCredentialsChange(updated);
                        }}
                        disabled={disabled}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-all ${
                          c.type === t
                            ? "bg-(--color-accent-subtle) text-(--color-accent)"
                            : "text-(--color-text-muted) hover:bg-(--color-bg-secondary)"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Fields */}
                  {c.type === "education" ? (
                    <>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => {
                          const updated = [...credentials];
                          updated[i] = { ...updated[i], title: e.target.value };
                          onCredentialsChange(updated);
                        }}
                        disabled={disabled}
                        placeholder="Degree/Major (e.g., BS in Computer Science)"
                        className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                      />
                      <input
                        type="text"
                        value={c.institution}
                        onChange={(e) => {
                          const updated = [...credentials];
                          updated[i] = { ...updated[i], institution: e.target.value };
                          onCredentialsChange(updated);
                        }}
                        disabled={disabled}
                        placeholder="Institution"
                        className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={c.startDate}
                          onChange={(e) => {
                            const updated = [...credentials];
                            updated[i] = { ...updated[i], startDate: e.target.value };
                            onCredentialsChange(updated);
                          }}
                          disabled={disabled}
                          placeholder="Start Date"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                        />
                        <input
                          value={c.endDate}
                          onChange={(e) => {
                            const updated = [...credentials];
                            updated[i] = { ...updated[i], endDate: e.target.value };
                            onCredentialsChange(updated);
                          }}
                          disabled={disabled}
                          placeholder="End Date"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                        />
                      </div>
                    </>
                  ) : (
                    <textarea
                      value={c.certification}
                      onChange={(e) => {
                        const updated = [...credentials];
                        updated[i] = { ...updated[i], certification: e.target.value };
                        onCredentialsChange(updated);
                      }}
                      disabled={disabled}
                      placeholder="Explain your certification (e.g., AWS Certified Solutions Architect - May 2024)"
                      rows={3}
                      className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50 resize-none leading-relaxed"
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onCredentialsChange([
                    ...credentials,
                    { type: "education", title: "", institution: "", startDate: "", endDate: "", certification: "" },
                  ])
                }
                disabled={disabled}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-bg)/50 py-2.5 text-xs font-medium text-(--color-text-muted) transition-all hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/30 dark:hover:bg-violet-950/10 disabled:opacity-50 active:scale-[0.98]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Credential
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
