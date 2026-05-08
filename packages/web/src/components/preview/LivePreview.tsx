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

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    Primary: "bg-(--color-role-primary-subtle) text-(--color-role-primary)",
    Supporting: "bg-(--color-role-supporting-subtle) text-(--color-role-supporting)",
    Infrastructure: "bg-(--color-role-infra-subtle) text-(--color-role-infra)",
  };
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${colors[role] ?? "bg-(--color-bg-tertiary) text-(--color-text-muted)"}`}>
      {role}
    </span>
  );
}

function ProjectCard({ proj, index }: { proj: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-(--color-border) glass-card p-5 space-y-4 card-hover"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-(--color-text) truncate">{proj.title}</h4>
            <span className="shrink-0 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-[9px] font-medium text-teal-600 dark:text-teal-400">
              gitlore
            </span>
          </div>
          <p className="text-xs text-(--color-text-secondary) line-clamp-2 leading-relaxed">
            {proj.one_liner}
          </p>
          {proj.contributions && (
            <p className="text-[11px] text-(--color-accent) font-medium mt-1">
              {proj.contributions}
            </p>
          )}
        </div>
      </div>

      {/* Tech Stack Pills */}
      {proj.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {proj.tech_stack.slice(0, 8).map((tech, i) => (
            <div key={i} className="flex items-center gap-1">
              <RoleBadge role={tech.role} />
              <span className="text-[10px] text-(--color-text-secondary) font-medium">
                {tech.name}
              </span>
            </div>
          ))}
          {proj.tech_stack.length > 8 && (
            <span className="text-[10px] text-(--color-text-muted)">
              +{proj.tech_stack.length - 8} more
            </span>
          )}
        </div>
      )}

      {/* Results Row */}
      {proj.results && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { data: proj.results.performance, icon: Zap, label: "Perf" },
            { data: proj.results.scale, icon: Layers, label: "Scale" },
            { data: proj.results.utility, icon: Shield, label: "Utility" },
          ].map(
            ({ data, icon: Icon, label }) =>
              data.text && (
                <div
                  key={label}
                  className="rounded-xl bg-(--color-bg) border border-(--color-border)/50 p-2.5 space-y-1"
                >
                  <div className="flex items-center gap-1">
                    <Icon className="h-3 w-3 text-(--color-text-muted)" />
                    <span className="text-[9px] font-medium uppercase tracking-wider text-(--color-text-muted)">
                      {label}
                    </span>
                  </div>
                  <p className="text-[10px] text-(--color-text-secondary) leading-relaxed line-clamp-2">
                    {data.text}
                  </p>
                </div>
              )
          )}
        </div>
      )}

      {/* Links */}
      {proj.architecture_diagram_code && (
        <div className="pt-2">
          <Mermaid chart={proj.architecture_diagram_code} />
        </div>
      )}

      {/* External Links */}
      {proj.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {proj.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-(--color-border) px-2.5 py-1 text-[10px] font-medium text-(--color-text-secondary) transition-all hover:border-(--color-accent) hover:text-(--color-accent) hover:bg-(--color-accent-subtle)/30 active:scale-95"
            >
              {link.url.includes("github") ? (
                <Github className="h-3 w-3" />
              ) : (
                <ExternalLink className="h-3 w-3" />
              )}
              {link.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AchievementCard({ ach, index }: { ach: Achievement; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-medium text-(--color-text) truncate">{ach.title}</h4>
            <p className="text-xs text-(--color-text-secondary) leading-relaxed line-clamp-3">
              {ach.description}
            </p>
            {ach.date && (
              <span className="text-[10px] text-(--color-text-muted)">{ach.date}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CredentialCard({ cred, index }: { cred: Credential; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group rounded-2xl border border-(--color-border) bg-(--color-bg-secondary) p-4 space-y-2 card-hover relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-(--color-accent)/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg) border border-(--color-border) shadow-sm group-hover:border-(--color-accent)/30 transition-colors">
            {cred.type === "education" ? (
              <LucideIcons.GraduationCap className="h-5 w-5 text-indigo-500" />
            ) : (
              <LucideIcons.Award className="h-5 w-5 text-rose-500" />
            )}
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-semibold text-(--color-text) truncate">{cred.title}</h4>
            <div className="flex items-center gap-2 text-xs text-(--color-text-secondary) truncate">
              <span className="font-medium text-(--color-text)">{cred.institution}</span>
              {cred.date && (
                <>
                  <span className="h-1 w-1 rounded-full bg-(--color-border)" />
                  <span>{cred.date}</span>
                </>
              )}
            </div>
            {cred.description && (
              <p className="text-xs text-(--color-text-muted) leading-relaxed mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">
                {cred.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group rounded-2xl border border-(--color-border) bg-(--color-bg-secondary) p-5 space-y-4 card-hover relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--color-bg) border border-(--color-border) shadow-sm group-hover:border-blue-500/30 transition-colors">
            <LucideIcons.Briefcase className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <h4 className="text-base font-semibold text-(--color-text) truncate">{exp.role}</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-(--color-text-secondary)">
              <span className="font-medium text-(--color-text)">{exp.company}</span>
              {(exp.location || exp.date_range) && <span className="h-1 w-1 rounded-full bg-(--color-border)" />}
              {exp.location && <span>{exp.location}</span>}
              {exp.location && exp.date_range && <span className="h-1 w-1 rounded-full bg-(--color-border)" />}
              {exp.date_range && <span>{exp.date_range}</span>}
            </div>
          </div>
        </div>
      </div>
      {exp.contributions.length > 0 && (
        <ul className="space-y-2 mt-2 ml-14 relative z-10">
          {exp.contributions.map((c, i) => (
            <li key={i} className="text-xs text-(--color-text-muted) leading-relaxed flex items-start gap-2">
              <span className="text-blue-500/50 mt-0.5 shrink-0">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function DynamicIcon({ name, colorClass, size = "w-4 h-4" }: { name: string; colorClass?: string; size?: string }) {
  // @ts-ignore
  const Icon = LucideIcons[name] || LucideIcons.Zap;
  return <Icon className={`${size} ${colorClass || "text-(--color-text-muted)"}`} />;
}

export const LivePreview = memo(function LivePreview({ portfolio }: Props) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-(--color-border) glass-card p-6 space-y-3 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-rose-500 to-purple-500 text-white text-lg font-bold shadow-lg shadow-teal-500/15">
            {portfolio.profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight text-(--color-text)">
              {portfolio.profile.name}
            </h2>
            <p className="text-sm text-(--color-text-secondary)">{portfolio.profile.role}</p>
          </div>
        </div>
        {portfolio.profile.philosophy && (
          <p className="text-xs text-(--color-text-muted) italic leading-relaxed border-l-2 border-(--color-accent)/30 pl-3">
            "{portfolio.profile.philosophy}"
          </p>
        )}
        {/* Quick stats and Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {portfolio.profile.contact.email && (
            <div className="flex items-center gap-1.5">
              <LucideIcons.Mail className="h-3 w-3 text-(--color-text-muted)" />
              <span className="text-xs text-(--color-text-secondary)">{portfolio.profile.contact.email}</span>
            </div>
          )}
          {portfolio.profile.mobile && (
            <div className="flex items-center gap-1.5">
              <LucideIcons.Phone className="h-3 w-3 text-(--color-text-muted)" />
              <span className="text-xs text-(--color-text-secondary)">{portfolio.profile.mobile}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            <LucideIcons.Star className="h-3 w-3 text-(--color-text-muted)" />
            <span className="text-xs text-(--color-text-secondary)">
              <span className="font-semibold tabular-nums">{portfolio.projects.length}</span> Projects
            </span>
          </div>
        </div>

        {/* Hobbies */}
        {portfolio.profile.hobbies && portfolio.profile.hobbies.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-(--color-border)/50">
            <span className="text-[10px] font-semibold uppercase text-(--color-text-muted) mr-1">Hobbies</span>
            {portfolio.profile.hobbies.map((hobby, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-full bg-(--color-bg-tertiary) px-2.5 py-1 text-[10px] font-medium text-(--color-text-secondary) border border-(--color-border)/50">
                <DynamicIcon name={hobby.icon} colorClass="text-current" size="w-3 h-3" />
                <span style={{ color: hobby.color }}>{hobby.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects */}
      {portfolio.projects.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Projects
          </h3>
          <AnimatePresence mode="popLayout">
            {portfolio.projects.map((proj, i) => (
              <ProjectCard key={proj.id} proj={proj} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Experience */}
      {portfolio.experience.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Work Experience
          </h3>
          <AnimatePresence mode="popLayout">
            {portfolio.experience.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tech Proficiency */}
      {portfolio.tech.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Tech Proficiency
          </h3>
          <div className="rounded-2xl border border-(--color-border) glass-card p-5 space-y-4">
            <h4 className="text-xs font-semibold text-(--color-text) flex items-center gap-2">
              <LucideIcons.Code className="h-4 w-4 text-emerald-500" /> Technical
            </h4>
            <div className="space-y-3">
              {[...portfolio.tech].sort((a, b) => b.proficiency - a.proficiency).map((skill, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-(--color-text-secondary) flex items-center gap-1.5">
                      <DynamicIcon name={skill.icon || "Code"} size="w-3 h-3 text-(--color-text-muted)" />
                      {skill.title}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-(--color-border) rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.proficiency / 10) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      {portfolio.achievements.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Achievements
          </h3>
          <AnimatePresence mode="popLayout">
            {portfolio.achievements.map((ach, i) => (
              <AchievementCard key={ach.id} ach={ach} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Credentials */}
      {portfolio.credentials.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Credentials
          </h3>
          <AnimatePresence mode="popLayout">
            {portfolio.credentials.map((cred, i) => (
              <CredentialCard key={cred.id} cred={cred} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Languages */}
      {portfolio.languages.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Language Proficiency
          </h3>
          <div className="rounded-2xl border border-(--color-border) glass-card p-5 space-y-4">
            <h4 className="text-xs font-semibold text-(--color-text) flex items-center gap-2">
              <LucideIcons.Globe className="h-4 w-4 text-orange-500" /> Languages
            </h4>
            <div className="space-y-3">
              {[...portfolio.languages].sort((a, b) => b.proficiency - a.proficiency).map((lang, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-(--color-text-secondary)">{lang.title}</span>
                  </div>
                  <div className="h-1.5 w-full bg-(--color-border) rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(lang.proficiency / 10) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});
