import type { GenerateRequest } from "../../schemas/request";
import type { GitloreOutput } from "../gitlore/client";

/**
 * Build the system prompt for Gemini 2.5 Flash.
 * This prompt handles ONLY the probabilistic zone:
 * - profile.philosophy synthesis
 * - achievement description polishing
 * - credential contextualization
 * - relevance_score assignment (0-100) for ALL items
 * - rankings.ordered_ids generation
 * - solutions[].contributions role title synthesis
 */
export function buildSystemPrompt(): string {
  return `You are a Senior Engineering Recruiter and Technical Writer producing a structured portfolio assessment.

Your task: analyze the provided engineer profile, project summaries, achievements, and credentials, then produce a comprehensive scoring and narrative enhancement.

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown fences, explanations, or preambles.
The JSON MUST match this structure:

{
  "philosophy": "string — 1-2 sentence engineering philosophy synthesized from the profile and projects",
  "items": [
    {
      "id": "string — the item ID provided in the input",
      "type": "solution" | "achievement" | "credential" | "experience",
      "relevance_score": number (0-100),
      "enhanced_contributions": "string — polished role titles (for solutions) or improved bullet points (for experiences)",
      "enhanced_description": "string — polished professional description (for achievements/credentials)"
    }
  ],
  "hobbies_enriched": [
    {
      "title": "string — the hobby name",
      "icon": "string — best matching Lucide react icon name (e.g. 'Camera', 'Gamepad2')",
      "color": "string — fitting tailwind hex color (e.g. '#3b82f6')"
    }
  ],
  "tech_skills_enriched": [
    {
      "title": "string — the skill name",
      "icon": "string — best matching Lucide react icon name (e.g. 'Code', 'Database')"
    }
  ],
  "ordered_ids": ["string — all item IDs sorted by relevance_score descending"]
}

SCORING RUBRIC (apply these weights holistically):
- Technical Complexity (30%): Depth of architecture, novel algorithms, system design patterns. Microservices > static sites.
- Impact & Scale (25%): Production deployment, user count, measurable performance improvements.
- Verifiability (20%): Live URLs, public repos, recognized certifications, published evidence.
- Recency (15%): More recent work scores higher. Apply gentle decay on older items.
- Narrative Strength (10%): How compelling the problem→solution story reads for a hiring manager.

CRITICAL RULES:
1. Score RELATIVE to other items — the best item should score 85-95, the weakest 20-40.
2. For contributions: synthesize raw notes into polished role titles (e.g., "built the database" → "Database Architect").
3. For achievements: make descriptions concise, quantified where possible, and recruiter-compelling.
4. Philosophy must reflect the engineer's actual work patterns, not generic platitudes.
5. NO hallucinated data. If specifics aren't available, describe qualitative patterns instead.
6. For Hobbies: parse the user's comma-separated hobbies and assign a highly relevant Lucide icon and aesthetically pleasing hex color.
7. For Tech Skills: assign a highly relevant Lucide icon. Use generic icons (Code, Terminal, FileCode) if a specific logo icon isn't in Lucide.
8. Write as if presenting to a hiring manager at a top-tier tech company.`;
}

/**
 * Build the user prompt containing all data for Gemini to score and enhance.
 */
export function buildUserPrompt(
  request: GenerateRequest,
  gitloreOutputs: Array<{ id: string; output: GitloreOutput }>
): string {
  const identity = `## Engineer Profile
Name: ${request.profile.name}
Role: ${request.profile.role}
${request.profile.github ? `GitHub: ${request.profile.github}` : ""}
${request.profile.linkedin ? `LinkedIn: ${request.profile.linkedin}` : ""}`;

  const projectSummaries = gitloreOutputs
    .map(({ id, output }) => {
      return `### Project [${id}]: ${output.title}
One-liner: ${output.one_liner}
Problem: ${output.problem}
Goal: ${output.goal}
Stack: ${output.tech_stack.map((s) => s.name).join(", ")}
Raw contributions: ${output.contributions}`;
    })
    .join("\n\n");

  const achievementsList = request.achievements
    .map((a, i) => {
      const aid = `achievement-${i}`;
      return `### Achievement [${aid}]: ${a.title}
Description: ${a.description}
${a.date ? `Date: ${a.date}` : ""}
${a.evidence_url ? `Evidence: ${a.evidence_url}` : ""}`;
    })
    .join("\n\n");

  const credentialsList = request.credentials
    .map((c, i) => {
      const cid = `credential-${i}`;
      return `### Credential [${cid}]: ${c.title}
Type: ${c.type}
Institution: ${c.institution}
${c.date ? `Date: ${c.date}` : ""}
${c.description ? `Description: ${c.description}` : ""}`;
    })
    .join("\n\n");

  const experienceList = request.experience
    .map((e, i) => {
      const eid = `experience-${i}`;
      return `### Experience [${eid}]: ${e.role} at ${e.company}
Location: ${e.location || "N/A"}
Dates: ${e.startDate || ""} - ${e.endDate || ""}
Contributions:
${e.contributions.map(c => `- ${c}`).join("\n")}`;
    })
    .join("\n\n");

  const techSkills = request.skills.tech.map(s => s.title).join(", ");
  const hobbies = request.profile.hobbies || "";

  return `${identity}
Hobbies: ${hobbies}

## Tech Skills
${techSkills || "No tech skills provided."}

## Projects (analyzed via Gitlore)
${projectSummaries || "No projects provided."}

## Experience
${experienceList || "No experience provided."}

## Achievements
${achievementsList || "No achievements provided."}

## Credentials
${credentialsList || "No credentials provided."}`;
}
