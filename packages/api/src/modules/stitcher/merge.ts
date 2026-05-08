import type { GenerateRequest } from "../../schemas/request";
import type { GitloreOutput } from "../gitlore/client";
import type { NarrativeOutput } from "../narrative/gemini";
import type { MasterPortfolio } from "../../schemas/response";
import type { ProgressCallback } from "../../lib/progress";

/**
 * Stitch together deterministic Gitlore data and probabilistic Gemini narratives
 * into the final MasterPortfolio schema.
 *
 * This is the core of the Hybrid Thrift Strategy:
 * - Gitlore fields (diagrams, stacks, features) are passed through verbatim
 * - Gemini fields (philosophy, scores, polished descriptions) are merged in
 */
export function stitchPortfolio(
  request: GenerateRequest,
  gitloreOutputs: Array<{ id: string; output: GitloreOutput }>,
  narrative: NarrativeOutput,
  orderedIds: string[],
  scoreMap: Map<string, number>,
  onProgress: ProgressCallback
): MasterPortfolio {
  onProgress({ phase: "stitching", message: "Assembling MasterPortfolio..." });

  // --- Profile ---
  const profile: MasterPortfolio["profile"] = {
    name: request.profile.name,
    role: request.profile.role,
    contact: {
      email: request.profile.email ?? "",
      github: request.profile.github ?? "",
      linkedin: request.profile.linkedin,
      website: request.profile.website,
    },
    philosophy: narrative.philosophy,
  };

  // --- Solutions (Gitlore deterministic + Gemini enhancements) ---
  const solutions: MasterPortfolio["solutions"] = gitloreOutputs.map(
    ({ id, output }) => {
      const enhancement = narrative.items.find((i) => i.id === id);
      return {
        id,
        title: output.title,
        one_liner: output.one_liner,
        contributions: enhancement?.enhanced_contributions ?? output.contributions,
        problem: output.problem,
        goal: output.goal,
        key_features: output.key_features,
        architecture_diagram_code: output.architecture_diagram_code,
        tech_stack: output.tech_stack,
        stack_reason: output.stack_reason,
        results: output.results,
        links: output.links,
        gallery: output.gallery,
        source: "gitlore" as const,
        relevance_score: scoreMap.get(id) ?? 50,
      };
    }
  );

  // --- Achievements (raw input + Gemini polishing) ---
  const achievements: MasterPortfolio["achievements"] = request.achievements.map(
    (a, i) => {
      const aid = `achievement-${i}`;
      const enhancement = narrative.items.find((item) => item.id === aid);
      return {
        id: aid,
        title: a.title,
        description: enhancement?.enhanced_description ?? a.description,
        date: a.date,
        verifiable: !!a.evidence_url,
        evidence_url: a.evidence_url,
        relevance_score: scoreMap.get(aid) ?? 50,
      };
    }
  );

  // --- Credentials (raw input + Gemini contextualization) ---
  const credentials: MasterPortfolio["credentials"] = request.credentials.map(
    (c, i) => {
      const cid = `credential-${i}`;
      const enhancement = narrative.items.find((item) => item.id === cid);
      return {
        id: cid,
        type: c.type,
        title: c.title,
        institution: c.institution,
        date: c.date,
        description: enhancement?.enhanced_description ?? c.description,
        relevance_score: scoreMap.get(cid) ?? 50,
      };
    }
  );

  // --- Rankings ---
  const rankings: MasterPortfolio["rankings"] = {
    generated_at: new Date().toISOString(),
    strategy: "hirer_relevance",
    ordered_ids: orderedIds,
  };

  const portfolio: MasterPortfolio = {
    profile,
    rankings,
    achievements,
    solutions,
    credentials,
  };

  onProgress({
    phase: "stitching",
    message: `Portfolio assembled: ${solutions.length} solutions, ${achievements.length} achievements, ${credentials.length} credentials`,
  });

  return portfolio;
}
