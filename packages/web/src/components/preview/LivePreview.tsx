import { memo, useMemo } from "react";
import {
  ExternalLink, Github, Zap, Layers, Shield,
  GraduationCap, Award, Trophy, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MasterPortfolio, Solution, Achievement, Credential } from "../../types/portfolio";
import type { SortMode } from "../sort/SortBar";
import { Mermaid } from "./Mermaid";

interface Props {
  portfolio: MasterPortfolio;
  sortMode: SortMode;
}

function ScoreBadge({ score }: { score: number }) {
  const tier =
    score >= 70 ? "high" : score >= 40 ? "mid" : "low";
  const colors = {
    high: "bg-(--color-rank-high-subtle) text-(--color-rank-high)",
    mid: "bg-(--color-rank-mid-subtle) text-(--color-rank-mid)",
    low: "bg-(--color-rank-low-subtle) text-(--color-rank-low)",
  };
  const barColors = {
    high: "bg-(--color-rank-high)",
    mid: "bg-(--color-rank-mid)",
    low: "bg-(--color-rank-low)",
  };

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold tabular-nums ${colors[tier]}`}>
        {score}
      </div>
      <div className="w-16 h-1.5 rounded-full bg-(--color-border) overflow-hidden hidden sm:block">
        <div
          className={`h-full rounded-full animate-score-fill ${barColors[tier]}`}
          style={{ "--score-width": `${score}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
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

function SolutionCard({ sol, index }: { sol: Solution; index: number }) {
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
            <h4 className="text-sm font-semibold text-(--color-text) truncate">{sol.title}</h4>
            <span className="shrink-0 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-[9px] font-medium text-teal-600 dark:text-teal-400">
              gitlore
            </span>
          </div>
          <p className="text-xs text-(--color-text-secondary) line-clamp-2 leading-relaxed">
            {sol.one_liner}
          </p>
          {sol.contributions && (
            <p className="text-[11px] text-(--color-accent) font-medium mt-1">
              {sol.contributions}
            </p>
          )}
        </div>
        <ScoreBadge score={sol.relevance_score} />
      </div>

      {/* Tech Stack Pills */}
      {sol.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sol.tech_stack.slice(0, 8).map((tech, i) => (
            <div key={i} className="flex items-center gap-1">
              <RoleBadge role={tech.role} />
              <span className="text-[10px] text-(--color-text-secondary) font-medium">
                {tech.name}
              </span>
            </div>
          ))}
          {sol.tech_stack.length > 8 && (
            <span className="text-[10px] text-(--color-text-muted)">
              +{sol.tech_stack.length - 8} more
            </span>
          )}
        </div>
      )}

      {/* Results Row */}
      {sol.results && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { data: sol.results.performance, icon: Zap, label: "Perf" },
            { data: sol.results.scale, icon: Layers, label: "Scale" },
            { data: sol.results.utility, icon: Shield, label: "Utility" },
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
      {sol.architecture_diagram_code && (
        <div className="pt-2">
          <Mermaid chart={sol.architecture_diagram_code} />
        </div>
      )}

      {/* External Links */}
      {sol.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {sol.links.map((link, i) => (
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
        <ScoreBadge score={ach.relevance_score} />
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
      className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
            {cred.type === "education" ? (
              <GraduationCap className="h-4 w-4 text-emerald-500" />
            ) : (
              <Award className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-medium text-(--color-text) truncate">{cred.title}</h4>
            <p className="text-xs text-(--color-text-secondary)">{cred.institution}</p>
            {cred.description && (
              <p className="text-[10px] text-(--color-text-muted) leading-relaxed line-clamp-2">
                {cred.description}
              </p>
            )}
          </div>
        </div>
        <ScoreBadge score={cred.relevance_score} />
      </div>
    </motion.div>
  );
}

export const LivePreview = memo(function LivePreview({ portfolio, sortMode }: Props) {
  // Sort items based on current mode
  const sortedSolutions = useMemo(() => {
    const items = [...portfolio.solutions];
    if (sortMode === "rank") {
      const idxMap = new Map(portfolio.rankings.ordered_ids.map((id, i) => [id, i]));
      items.sort((a, b) => (idxMap.get(a.id) ?? 99) - (idxMap.get(b.id) ?? 99));
    }
    return items;
  }, [portfolio.solutions, portfolio.rankings.ordered_ids, sortMode]);

  const sortedAchievements = useMemo(() => {
    const items = [...portfolio.achievements];
    if (sortMode === "rank") {
      items.sort((a, b) => b.relevance_score - a.relevance_score);
    }
    return items;
  }, [portfolio.achievements, sortMode]);

  const sortedCredentials = useMemo(() => {
    const items = [...portfolio.credentials];
    if (sortMode === "rank") {
      items.sort((a, b) => b.relevance_score - a.relevance_score);
    }
    return items;
  }, [portfolio.credentials, sortMode]);

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
        {/* Quick stats */}
        <div className="flex gap-4 pt-2">
          {[
            { label: "Solutions", count: portfolio.solutions.length, icon: Star },
            { label: "Achievements", count: portfolio.achievements.length, icon: Trophy },
            { label: "Credentials", count: portfolio.credentials.length, icon: Award },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <s.icon className="h-3 w-3 text-(--color-text-muted)" />
              <span className="text-xs text-(--color-text-secondary)">
                <span className="font-semibold tabular-nums">{s.count}</span> {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Solutions */}
      {sortedSolutions.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Solutions
          </h3>
          <AnimatePresence mode="popLayout">
            {sortedSolutions.map((sol, i) => (
              <SolutionCard key={sol.id} sol={sol} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Achievements */}
      {sortedAchievements.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Achievements
          </h3>
          <AnimatePresence mode="popLayout">
            {sortedAchievements.map((ach, i) => (
              <AchievementCard key={ach.id} ach={ach} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Credentials */}
      {sortedCredentials.length > 0 && (
        <motion.div layout className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-muted) px-1">
            Credentials
          </h3>
          <AnimatePresence mode="popLayout">
            {sortedCredentials.map((cred, i) => (
              <CredentialCard key={cred.id} cred={cred} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
});
