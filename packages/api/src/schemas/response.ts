import { z } from "zod";

const optionalString = z.string().nullish().transform((val) => val ?? undefined);

// --- Shared sub-schemas ---

const ContactSchema = z.object({
  email: z.string().default(""),
  github: z.string().default(""),
  linkedin: optionalString,
  website: optionalString,
});

const HobbySchema = z.object({
  title: z.string(),
  icon: z.string(),
  color: z.string(),
});

const ProfileSchema = z.object({
  name: z.string(),
  role: z.string(),
  contact: ContactSchema,
  mobile: optionalString,
  philosophy: optionalString,
  hobbies: z.array(HobbySchema).default([]),
});

const RankingsSchema = z.object({
  generated_at: z.string(),
  strategy: z.literal("hirer_relevance"),
  ordered_ids: z.array(z.string()),
});

const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: optionalString,
  verifiable: z.boolean().default(false),
  evidence_url: optionalString,
  relevance_score: z.number().min(0).max(100).default(50),
});

const StackItemSchema = z.preprocess((val) => {
  if (val && typeof val === "object" && "name" in val) return val;
  if (typeof val === "string") return { name: val, role: "Supporting" };
  return val;
}, z.object({
  name: z.string(),
  role: z.string().default("Supporting"),
}));

const ResultMetricSchema = z.object({
  icon: z.string().default("zap"),
  text: z.string().default(""),
});

const ResultsSchema = z.object({
  performance: ResultMetricSchema,
  scale: ResultMetricSchema,
  utility: ResultMetricSchema,
});

const FeatureSchema = z.preprocess((val) => {
  if (typeof val === "string") return { icon: "zap", text: val };
  return val;
}, z.object({
  icon: z.string().default("zap"),
  text: z.string().default(""),
}));

const LinkSchema = z.preprocess((val) => {
  if (typeof val === "string") return { icon: "link", label: val, url: val };
  return val;
}, z.object({
  icon: z.string().default("link"),
  label: z.string().default("Link"),
  url: z.string().default("#"),
}));

const SolutionSchema = z.object({
  id: z.string(),
  title: z.string().default("Project"),
  one_liner: z.string().default(""),
  contributions: z.string().default(""),
  problem: z.string().default(""),
  goal: z.string().default(""),
  key_features: z.array(FeatureSchema).default([]),
  architecture_diagram_code: z.string().default(""),
  tech_stack: z.array(StackItemSchema).default([]),
  stack_reason: z.string().default(""),
  results: ResultsSchema.optional().default({
    performance: { icon: "zap", text: "" },
    scale: { icon: "layers", text: "" },
    utility: { icon: "shield", text: "" },
  }),
  links: z.array(LinkSchema).default([]),
  gallery: z.array(z.string()).default([]),
  source: z.literal("gitlore").default("gitlore"),
  relevance_score: z.number().min(0).max(100).default(50),
});

const CredentialSchema = z.object({
  id: z.string(),
  type: z.enum(["education", "certification"]),
  title: z.string(),
  institution: z.string(),
  date: optionalString,
  description: optionalString,
  relevance_score: z.number().min(0).max(100).default(50),
});

const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: optionalString,
  date_range: optionalString,
  contributions: z.array(z.string()).default([]),
  relevance_score: z.number().min(0).max(100).default(50),
});

const SkillSchema = z.object({
  title: z.string(),
  category: optionalString,
  icon: optionalString,
  proficiency: z.number().min(1).max(10),
});

// --- Master Schema ---

export const MasterPortfolioSchema = z.object({
  profile: ProfileSchema,
  rankings: RankingsSchema,
  experience: z.array(ExperienceSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  solutions: z.array(SolutionSchema).default([]),
  credentials: z.array(CredentialSchema).default([]),
  skills: z.object({
    tech: z.array(SkillSchema).default([]),
    languages: z.array(SkillSchema).default([]),
  }).default({ tech: [], languages: [] }),
});

export type MasterPortfolio = z.infer<typeof MasterPortfolioSchema>;
export type Solution = z.infer<typeof SolutionSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Credential = z.infer<typeof CredentialSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Hobby = z.infer<typeof HobbySchema>;
