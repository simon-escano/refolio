/** Frontend type definitions mirroring the API's Zod schemas */

// ─── MasterPortfolio ───

export interface Contact {
  email: string;
  github: string;
  linkedin?: string;
  website?: string;
}

export interface Profile {
  name: string;
  role: string;
  contact: Contact;
  philosophy?: string;
}

export interface Rankings {
  generated_at: string;
  strategy: "hirer_relevance";
  ordered_ids: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  verifiable: boolean;
  evidence_url?: string;
  relevance_score: number;
}

export interface StackItem {
  name: string;
  role: string;
}

export interface ResultMetric {
  icon: string;
  text: string;
}

export interface Results {
  performance: ResultMetric;
  scale: ResultMetric;
  utility: ResultMetric;
}

export interface Feature {
  icon: string;
  text: string;
}

export interface LinkItem {
  icon: string;
  label: string;
  url: string;
}

export interface Solution {
  id: string;
  title: string;
  one_liner: string;
  contributions: string;
  problem: string;
  goal: string;
  key_features: Feature[];
  architecture_diagram_code: string;
  tech_stack: StackItem[];
  stack_reason: string;
  results: Results;
  links: LinkItem[];
  gallery: string[];
  source: "gitlore";
  relevance_score: number;
}

export interface Credential {
  id: string;
  type: "education" | "certification";
  title: string;
  institution: string;
  date?: string;
  description?: string;
  relevance_score: number;
}

export interface MasterPortfolio {
  profile: Profile;
  rankings: Rankings;
  achievements: Achievement[];
  solutions: Solution[];
  credentials: Credential[];
}

// ─── Progress Events ───

export type ProgressPhase =
  | "cache"
  | "gitlore"
  | "narrative"
  | "ranking"
  | "stitching"
  | "validation";

export interface ProgressEvent {
  phase: ProgressPhase;
  message: string;
  detail?: string;
}
