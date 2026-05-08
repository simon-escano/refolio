import { z } from "zod";

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
    email: z.string().email().optional(),
    mobile: z.string().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
    hobbies: z.string().optional(),
  }),

  /** Hustle Zone — projects to analyze via Gitlore */
  projects: z.array(ProjectInputSchema).min(1, "At least one project is required"),

  /** Hustle Zone — free-text achievements and experience */
  achievements: z
    .array(
      z.object({
        accomplishment: z.string().min(1),
        evidence_url: z.string().url().optional(),
      })
    )
    .optional()
    .default([]),

  /** Credentials Zone */
  credentials: z
    .array(
      z.object({
        type: z.enum(["education", "certification"]),
        title: z.string().min(1),
        institution: z.string().min(1),
        date: z.string().optional(),
        description: z.string().optional(),
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
        contributions: z.array(z.string()).default([]),
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
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
export type ProjectInput = z.infer<typeof ProjectInputSchema>;
