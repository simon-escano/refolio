import { z } from "zod";

// --- Shared sub-schemas ---

const ContactSchema = z.object({
  email: z.string().default(""),
  github: z.string().default(""),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

const ProfileSchema = z.object({
  name: z.string(),
  role: z.string(),
  contact: ContactSchema,
  philosophy: z.string().optional(),
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
  date: z.string().optional(),
  verifiable: z.boolean().default(false),
  evidence_url: z.string().optional(),
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
  date: z.string().optional(),
  description: z.string().optional(),
  relevance_score: z.number().min(0).max(100).default(50),
});

// --- Master Schema ---

export const MasterPortfolioSchema = z.object({
  profile: ProfileSchema,
  rankings: RankingsSchema,
  achievements: z.array(AchievementSchema).default([]),
  solutions: z.array(SolutionSchema).default([]),
  credentials: z.array(CredentialSchema).default([]),
});

export type MasterPortfolio = z.infer<typeof MasterPortfolioSchema>;
export type Solution = z.infer<typeof SolutionSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Credential = z.infer<typeof CredentialSchema>;
