import type { GenerateRequest } from "../../schemas/request";
import type { GitloreOutput } from "../gitlore/client";

/**
 * Build the system prompt for Gemini 2.5 Flash.
 * This prompt handles ONLY the probabilistic zone:
 * - profile.philosophy synthesis
 * - achievement description polishing
 * - credential contextualization
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
      "enhanced_contributions": "string — polished role titles (for solutions) or improved bullet points (for experiences)",
      "enhanced_description": "string — polished professional description (for achievements/credentials)",
      "generated_title": "string — (ONLY FOR ACHIEVEMENTS OR CERTIFICATIONS) A concise, professional title summarizing the accomplishment or certification",
      "generated_institution": "string — (ONLY FOR CERTIFICATIONS) The issuing organization",
      "generated_date": "string — (ONLY FOR ACHIEVEMENTS OR CERTIFICATIONS) Extracted or estimated date/timeframe if mentioned (e.g. '2023' or 'May 2024'), otherwise omit"
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
      "category": "string — best fitting professional category (e.g. 'Frontend', 'Backend', 'DevOps', 'Design')",
      "category_icon": "string — best matching Lucide react icon name for that category (e.g. 'Layout', 'Server', 'Terminal', 'Palette')"
    }
  ]
}

CRITICAL RULES:
1. For contributions: synthesize raw notes into polished role titles (e.g., "built the database" → "Database Architect").
2. For achievements: make descriptions concise, quantified where possible, and recruiter-compelling.
3. Philosophy must reflect the engineer's actual work patterns, not generic platitudes.
4. NO hallucinated data. If specifics aren't available, describe qualitative patterns instead.
5. For Hobbies: parse the user's comma-separated hobbies and assign a highly relevant Lucide icon and aesthetically pleasing hex color.
6. For Tech Skills: group them into a logical professional category, and select a fitting category-level Lucide icon (e.g. 'Layout' for Frontend, 'Server' or 'Database' for Backend, 'Terminal' for DevOps, 'Palette' for Design).
7. Write as if presenting to a hiring manager at a top-tier tech company.`;
}

/**
 * Build the user prompt containing all data for Gemini to enhance.
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
      const stackItems = [
        ...(output.tech_stack?.Primary || []),
        ...(output.tech_stack?.Supporting || []),
        ...(output.tech_stack?.Infrastructure || []),
      ];
      return `### Project [${id}]: ${output.title}
One-liner: ${output.one_liner}
Problem: ${output.problem}
Goal: ${output.goal}
Stack: ${stackItems.map((s) => s.name).join(", ")}
Raw contributions: ${output.contributions}`;
    })
    .join("\n\n");

  const achievementsList = request.achievements
    .map((a, i) => {
      const aid = `achievement-${i}`;
      return `### Achievement [${aid}]:
Accomplishment: ${a.accomplishment}
${a.evidence_url ? `Evidence: ${a.evidence_url}` : ""}`;
    })
    .join("\n\n");

  const credentialsList = request.credentials
    .map((c, i) => {
      const cid = `credential-${i}`;
      if (c.type === "education") {
        return `### Credential [${cid}]: ${c.title}
Type: education
Institution: ${c.institution}
Dates: ${c.startDate || ""} - ${c.endDate || ""}`;
      } else {
        return `### Credential [${cid}]:
Type: certification
Details: ${c.certification}`;
      }
    })
    .join("\n\n");

  const experienceList = request.experience
    .map((e, i) => {
      const eid = `experience-${i}`;
      return `### Experience [${eid}]: ${e.role} at ${e.company}
Location: ${e.location || "N/A"}
Dates: ${e.startDate || ""} - ${e.endDate || ""}
Contributions:
${e.contributions}`;
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
