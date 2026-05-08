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
    mobile: request.profile.mobile,
    philosophy: narrative.philosophy,
    hobbies: narrative.hobbies_enriched ?? [],
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

  // --- Experience (raw input + Gemini polishing) ---
  const experience: MasterPortfolio["experience"] = request.experience.map(
    (e, i) => {
      const eid = `experience-${i}`;
      const enhancement = narrative.items.find((item) => item.id === eid);
      
      // Merge enhanced bullet points if provided
      let finalContributions = e.contributions;
      if (enhancement?.enhanced_contributions) {
        // If Gemini returns a string instead of an array (per the prompt instruction), split by newlines
        const enhancedStr = enhancement.enhanced_contributions;
        finalContributions = enhancedStr.split("\n").map(s => s.replace(/^- /, "").trim()).filter(Boolean);
      }

      return {
        id: eid,
        company: e.company,
        role: e.role,
        location: e.location,
        date_range: e.startDate && e.endDate ? `${e.startDate} - ${e.endDate}` : e.startDate || e.endDate,
        contributions: finalContributions,
        relevance_score: scoreMap.get(eid) ?? 50,
      };
    }
  );

  // --- Skills (merge user proficiencies with AI assigned icons) ---
  const skills: MasterPortfolio["skills"] = {
    tech: request.skills.tech.map(t => {
      const enrichment = narrative.tech_skills_enriched?.find(e => e.title.toLowerCase() === t.title.toLowerCase());
      return {
        ...t,
        icon: enrichment?.icon || "Code", // fallback
      };
    }),
    languages: request.skills.languages,
  };

  // --- Rankings ---
  const rankings: MasterPortfolio["rankings"] = {
    generated_at: new Date().toISOString(),
    strategy: "hirer_relevance",
    ordered_ids: orderedIds,
  };

  const portfolio: MasterPortfolio = {
    profile,
    rankings,
    experience,
    achievements,
    solutions,
    credentials,
    skills,
  };

  onProgress({
    phase: "stitching",
    message: `Portfolio assembled: ${solutions.length} solutions, ${experience.length} experiences, ${achievements.length} achievements`,
  });

  return portfolio;
}
