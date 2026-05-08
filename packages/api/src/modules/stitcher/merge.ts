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
 * - Gemini fields (philosophy, polished descriptions) are merged in
 */
export function stitchPortfolio(
  request: GenerateRequest,
  gitloreOutputs: Array<{ id: string; output: GitloreOutput }>,
  narrative: NarrativeOutput,
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

  // --- Projects (Gitlore deterministic + Gemini enhancements) ---
  const projects: MasterPortfolio["projects"] = gitloreOutputs.map(
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
        title: enhancement?.generated_title || a.accomplishment,
        description: enhancement?.enhanced_description || a.accomplishment,
        date: enhancement?.generated_date,
        verifiable: !!a.evidence_url,
        evidence_url: a.evidence_url,
      };
    }
  );

  // --- Credentials (raw input + Gemini contextualization) ---
  const credentials: MasterPortfolio["credentials"] = request.credentials.map(
    (c, i) => {
      const cid = `credential-${i}`;
      const enhancement = narrative.items.find((item) => item.id === cid);
      
      if (c.type === "education") {
        return {
          id: cid,
          type: "education",
          title: c.title || "",
          institution: c.institution || "",
          date: c.startDate && c.endDate ? `${c.startDate} - ${c.endDate}` : c.startDate || c.endDate,
          description: enhancement?.enhanced_description,
        };
      } else {
        return {
          id: cid,
          type: "certification",
          title: enhancement?.generated_title || "Certification",
          institution: enhancement?.generated_institution || "",
          date: enhancement?.generated_date,
          description: enhancement?.enhanced_description || c.certification,
        };
      }
    }
  );

  // --- Experience (raw input + Gemini polishing) ---
  const experience: MasterPortfolio["experience"] = request.experience.map(
    (e, i) => {
      const eid = `experience-${i}`;
      const enhancement = narrative.items.find((item) => item.id === eid);
      
      // Merge enhanced bullet points if provided
      let finalContributions: string[] = [];
      if (enhancement?.enhanced_contributions) {
        // If Gemini returns a string instead of an array (per the prompt instruction), split by newlines
        const enhancedStr = enhancement.enhanced_contributions;
        finalContributions = enhancedStr.split("\n").map(s => s.replace(/^- /, "").trim()).filter(Boolean);
      } else if (e.contributions) {
        finalContributions = e.contributions.split("\n").map(s => s.trim()).filter(Boolean);
      }

      return {
        id: eid,
        company: e.company,
        role: e.role,
        location: e.location,
        date_range: e.startDate && e.endDate ? `${e.startDate} - ${e.endDate}` : e.startDate || e.endDate,
        contributions: finalContributions,
      };
    }
  );

  // --- Skills (group by AI assigned categories and category-level icons) ---
  const tech: MasterPortfolio["tech"] = {};
  
  for (const t of request.skills.tech) {
    const enrichment = narrative.tech_skills_enriched?.find(
      (e) => e.title.toLowerCase() === t.title.toLowerCase()
    );
    const category = enrichment?.category || "Other";
    const categoryIcon = enrichment?.category_icon || "Code";
    
    if (!tech[category]) {
      tech[category] = {
        icon: categoryIcon,
        items: [],
      };
    }
    
    tech[category].items.push({
      title: t.title,
      proficiency: t.proficiency,
    });
  }
  
  const languages: MasterPortfolio["languages"] = request.skills.languages;

  const portfolio: MasterPortfolio = {
    profile,
    projects,
    experience,
    tech,
    achievements,
    credentials,
    languages,
  };

  onProgress({
    phase: "stitching",
    message: `Portfolio assembled: ${projects.length} projects, ${experience.length} experiences, ${achievements.length} achievements`,
  });

  return portfolio;
}
