import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .transform((val) => (val === "" ? undefined : val))
  .optional();

const optionalEmailSchema = z
  .string()
  .email("Must be a valid email")
  .or(z.literal(""))
  .transform((val) => (val === "" ? undefined : val))
  .optional();

/** Single project URL entry for Gitlore processing */
const ProjectInputSchema = z.object({
  url: z.string().url("Must be a valid GitHub URL"),
  title: z.string().min(1, "Title is required"),
  contributions: z.string().min(1, "Contributions are required"),
  context: z.string().optional(),
  gallery: z.array(z.string()).optional().default([]),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      })
    )
    .optional()
    .default([]),
});

/** Top-level generation request covering all Zonal inputs */
export const GenerateRequestSchema = z.object({
  /** Identity Zone */
  profile: z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    email: optionalEmailSchema,
    mobile: z.string().optional(),
    github: optionalUrlSchema,
    linkedin: optionalUrlSchema,
    website: optionalUrlSchema,
    hobbies: z.string().optional(),
  }),

  /** Hustle Zone — projects to analyze via Gitlore */
  projects: z.array(ProjectInputSchema).optional().default([]),

  /** Pre-analyzed/Pre-computed projects to bypass Gitlore queue */
  preComputedProjects: z.array(z.any()).optional().default([]),

  /** Hustle Zone — free-text achievements and experience */
  achievements: z
    .array(
      z.object({
        accomplishment: z.string().min(1),
        evidence_url: optionalUrlSchema,
      })
    )
    .optional()
    .default([]),

  /** Credentials Zone */
  credentials: z
    .array(
      z.object({
        type: z.enum(["education", "certification"]),
        title: z.string().optional(),
        institution: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        certification: z.string().optional(),
      })
    )
    .optional()
    .default([]),

  /** Work Experience Zone */
  experience: z
    .array(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        location: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        contributions: z.string().default(""),
      })
    )
    .optional()
    .default([]),

  /** Skills Zone */
  skills: z.object({
    tech: z.array(
      z.object({
        title: z.string().min(1),
        proficiency: z.number().min(1).max(10),
      })
    ).default([]),
    languages: z.array(
      z.object({
        title: z.string().min(1),
        proficiency: z.number().min(1).max(10),
      })
    ).default([]),
  }).default({ tech: [], languages: [] }),

  /** Skip sending projects to Gemini to save tokens and prevent limits/truncations */
  skipProjectNarratives: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  const hasProjects = data.projects && data.projects.length > 0;
  const hasPrecomputed = data.preComputedProjects && data.preComputedProjects.length > 0;
  if (!hasProjects && !hasPrecomputed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either projects (Gitlore queue) or preComputedProjects must be provided",
      path: ["projects"],
    });
  }
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
export type ProjectInput = z.infer<typeof ProjectInputSchema>;
