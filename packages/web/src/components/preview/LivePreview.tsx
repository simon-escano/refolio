import { memo } from "react";
import * as LucideIcons from "lucide-react";
import {
  ExternalLink, Github, Zap, Layers, Shield, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MasterPortfolio, Project, Achievement, Credential, Experience } from "../../types/portfolio";
import { Mermaid } from "./Mermaid";

interface Props {
  portfolio: MasterPortfolio;
}

/* ─── Section Divider with centered heading ─── */
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="h-px bg-[var(--color-outline-variant)] flex-grow" />
      <h3 className="text-xl font-semibold text-[var(--color-primary)]">{title}</h3>
      <div className="h-px bg-[var(--color-outline-variant)] flex-grow" />
    </div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ proj, index }: { proj: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="border border-[var(--color-outline-variant)] rounded-xl p-8 bg-[var(--color-surface-bright)] shadow-sm hover:shadow-md transition-shadow space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-[var(--color-on-surface)] mb-2">{proj.title}</h4>
          {proj.one_liner && (
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-2">{proj.one_liner}</p>
          )}
          {proj.contributions && (
            <p className="text-xs font-medium text-[var(--color-primary)] mt-1">{proj.contributions}</p>
          )}
          {/* Tags */}
          <div className="flex gap-2 mt-3">
            <span className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-mono text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider">
              gitlore
            </span>
          </div>
        </div>
        <LucideIcons.GitBranch className="h-5 w-5 text-[var(--color-secondary)] shrink-0" />
      </div>

      {/* Tech Stack - 3 Column Grid */}
      {proj.tech_stack.length > 0 && (() => {
        const groupedTech = proj.tech_stack.reduce((acc, tech) => {
          const role = tech.role || "Supporting";
          if (!acc[role]) acc[role] = [];
          acc[role].push(tech.name);
          return acc;
        }, {} as Record<string, string[]>);

        return (
          <div className="grid grid-cols-3 gap-6 text-sm">
            {(["Primary", "Infrastructure", "Supporting"] as const).map((role) => {
              const items = groupedTech[role];
              if (!items || items.length === 0) return null;
              return (
                <div key={role}>
                  <strong className="text-[var(--color-primary)] font-mono text-xs font-bold tracking-[0.1em] uppercase block mb-2 border-b border-[var(--color-outline-variant)] pb-1">
                    {role}
                  </strong>
                  <span className="text-sm text-[var(--color-on-surface-variant)]">
                    {items.join(", ")}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Mermaid Diagram */}
      {proj.architecture_diagram_code && (
        <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/50 rounded-lg overflow-hidden relative">
          <Mermaid chart={proj.architecture_diagram_code} />
        </div>
      )}

      {/* Results Metrics */}
      {proj.results && (
        <div className="flex gap-8 border-t border-[var(--color-outline-variant)] pt-6">
          {[
            { data: proj.results.performance, icon: Zap, label: "Perf" },
            { data: proj.results.scale, icon: Layers, label: "Scale" },
            { data: proj.results.utility, icon: Shield, label: "Utility" },
          ].map(
            ({ data, icon: Icon, label }) =>
              data.text && (
                <div key={label}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="h-4 w-4 text-[var(--color-primary)]" />
                    <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)]">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {data.text}
                  </p>
                </div>
              )
          )}
        </div>
      )}

      {/* External Links */}
      {proj.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {proj.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-outline-variant)] px-3 py-1.5 font-mono text-xs text-[var(--color-on-surface-variant)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95"
            >
              {link.url.includes("github") ? (
                <Github className="h-3.5 w-3.5" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              {link.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Experience Card (Timeline) ─── */
function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="relative border-l-2 border-[var(--color-surface-variant)] pl-6 pb-6"
    >
      <div className="absolute w-3 h-3 bg-[var(--color-primary)] rounded-full -left-[7px] top-1.5 ring-4 ring-[var(--color-surface-container-lowest)]" />
      <h4 className="text-base font-bold text-[var(--color-on-surface)]">{exp.role}</h4>
      <div className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)] mb-3">
        {exp.company}
        {exp.location && ` · ${exp.location}`}
        {exp.date_range && ` · ${exp.date_range}`}
      </div>
      {exp.contributions.length > 0 && (
        <ul className="list-disc list-inside text-sm text-[var(--color-on-surface-variant)] space-y-2 marker:text-[var(--color-primary)]">
          {exp.contributions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/* ─── Achievement Card ─── */
function AchievementCard({ ach, index }: { ach: Achievement; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="flex items-start gap-3 py-3 border-b border-[var(--color-outline-variant)]/50 last:border-0"
    >
      <Trophy className="h-5 w-5 text-[var(--color-tertiary-fixed-dim)] shrink-0 mt-0.5" />
      <div className="space-y-1 min-w-0">
        <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">{ach.title}</h4>
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">{ach.description}</p>
        {ach.date && (
          <span className="font-mono text-[10px] text-[var(--color-outline)]">{ach.date}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Credential Card ─── */
function CredentialCard({ cred, index }: { cred: Credential; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="flex items-start gap-3 py-3 border-b border-[var(--color-outline-variant)]/50 last:border-0"
    >
      {cred.type === "education" ? (
        <LucideIcons.GraduationCap className="h-5 w-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
      ) : (
        <LucideIcons.Award className="h-5 w-5 text-[var(--color-tertiary)] shrink-0 mt-0.5" />
      )}
      <div className="space-y-1 min-w-0">
        <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">{cred.title}</h4>
        <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
          <span className="font-medium">{cred.institution}</span>
          {cred.date && (
            <>
              <span className="h-1 w-1 rounded-full bg-[var(--color-outline-variant)]" />
              <span>{cred.date}</span>
            </>
          )}
        </div>
        {cred.description && (
          <p className="text-xs text-[var(--color-outline)] leading-relaxed mt-1">{cred.description}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Dynamic Icon ─── */
function DynamicIcon({ name, colorClass, size = "w-4 h-4", style }: { name: string; colorClass?: string; size?: string; style?: React.CSSProperties }) {
  // @ts-ignore
  const Icon = LucideIcons[name] || LucideIcons.Zap;
  return <Icon className={`${size} ${colorClass || "text-[var(--color-outline)]"}`} style={style} />;
}

/* ═══════════════════════════════════════════
   MAIN LIVE PREVIEW — Architectural Portfolio Document
   ═══════════════════════════════════════════ */
export const LivePreview = memo(function LivePreview({ portfolio }: Props) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-b-xl overflow-y-auto p-12 shadow-[0_20px_40px_-10px_rgba(21,66,18,0.1)] relative border-x border-b border-[var(--color-outline-variant)]/20">
      {/* Profile Header — Centered */}
      <header className="flex flex-col items-center text-center mb-16 animate-fade-up">
        <div className="w-24 h-24 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center text-4xl font-bold text-[var(--color-primary)] mb-6 border-4 border-[var(--color-surface)]">
          {portfolio.profile.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-on-surface)] mb-2" style={{ lineHeight: 1.2 }}>
          {portfolio.profile.name}
        </h1>
        <h2 className="font-mono text-lg tracking-[0.15em] uppercase text-[var(--color-primary)] mb-4">
          {portfolio.profile.role}
        </h2>
        {portfolio.profile.philosophy && (
          <p className="text-base italic text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed">
            "{portfolio.profile.philosophy}"
          </p>
        )}

        {/* Contact Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-[var(--color-on-surface-variant)]">
          {portfolio.profile.contact.email && (
            <div className="flex items-center gap-1.5">
              <LucideIcons.Mail className="h-4 w-4 text-[var(--color-outline)]" />
              <span>{portfolio.profile.contact.email}</span>
            </div>
          )}
          {portfolio.profile.mobile && (
            <div className="flex items-center gap-1.5">
              <LucideIcons.Phone className="h-4 w-4 text-[var(--color-outline)]" />
              <span>{portfolio.profile.mobile}</span>
            </div>
          )}
        </div>

        {/* Hobbies */}
        {portfolio.profile.hobbies && portfolio.profile.hobbies.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {portfolio.profile.hobbies.map((hobby, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-container)] px-3 py-1 text-xs text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]/50">
                <DynamicIcon name={hobby.icon} colorClass="text-current" size="w-3.5 h-3.5" style={{ color: hobby.color }} />
                <span>{hobby.title}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Projects */}
      {portfolio.projects.length > 0 && (
        <section className="mb-16">
          <SectionDivider title="Key Architectures" />
          <AnimatePresence mode="popLayout">
            <div className="space-y-6">
              {portfolio.projects.map((proj, i) => (
                <ProjectCard key={proj.id} proj={proj} index={i} />
              ))}
            </div>
          </AnimatePresence>
        </section>
      )}

      {/* Experience + Tech Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Experience */}
        {portfolio.experience.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-6 flex items-center gap-2">
              <LucideIcons.Briefcase className="h-5 w-5" />
              Professional History
            </h3>
            <AnimatePresence mode="popLayout">
              {portfolio.experience.map((exp, i) => (
                <ExperienceCard key={exp.id} exp={exp} index={i} />
              ))}
            </AnimatePresence>
          </section>
        )}

        {/* Tech Proficiency */}
        {Object.keys(portfolio.tech).length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-6 flex items-center gap-2">
              <LucideIcons.Terminal className="h-5 w-5" />
              Technical Proficiency
            </h3>
            <div className="space-y-5">
              {Object.entries(portfolio.tech).map(([category, data]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
                    <DynamicIcon name={data.icon || "Code"} size="w-4 h-4" colorClass="text-[var(--color-primary)]" />
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {[...data.items]
                      .sort((a, b) => b.proficiency - a.proficiency)
                      .map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between font-mono text-xs font-bold tracking-[0.05em] mb-1">
                            <span className="text-[var(--color-on-surface)]">{skill.title}</span>
                            <span className="text-[var(--color-primary)]">{skill.proficiency}/10</span>
                          </div>
                          <div className="w-full bg-[var(--color-surface-variant)] rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(skill.proficiency / 10) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-[var(--color-primary)] rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Achievements */}
      {portfolio.achievements.length > 0 && (
        <section className="mb-16">
          <SectionDivider title="Achievements" />
          <div className="space-y-0">
            <AnimatePresence mode="popLayout">
              {portfolio.achievements.map((ach, i) => (
                <AchievementCard key={ach.id} ach={ach} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Credentials */}
      {portfolio.credentials.length > 0 && (
        <section className="mb-16">
          <SectionDivider title="Credentials" />
          <div className="space-y-0">
            <AnimatePresence mode="popLayout">
              {portfolio.credentials.map((cred, i) => (
                <CredentialCard key={cred.id} cred={cred} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Languages */}
      {portfolio.languages.length > 0 && (
        <section>
          <SectionDivider title="Language Proficiency" />
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
              <LucideIcons.Globe className="h-4 w-4 text-[var(--color-secondary)]" />
              Languages
            </h4>
            {[...portfolio.languages].sort((a, b) => b.proficiency - a.proficiency).map((lang, i) => (
              <div key={i}>
                <div className="flex justify-between font-mono text-xs font-bold tracking-[0.05em] mb-1">
                  <span className="text-[var(--color-on-surface)]">{lang.title}</span>
                  <span className="text-[var(--color-secondary)]">{lang.proficiency}/10</span>
                </div>
                <div className="w-full bg-[var(--color-surface-variant)] rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(lang.proficiency / 10) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[var(--color-secondary)] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});
