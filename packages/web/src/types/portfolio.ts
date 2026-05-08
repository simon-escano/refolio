/** Frontend type definitions mirroring the API's Zod schemas */

// ─── MasterPortfolio ───

export interface Contact {
  email: string;
  github: string;
  linkedin?: string;
  website?: string;
}

export interface Hobby {
  title: string;
  icon: string;
  color: string;
}

export interface Profile {
  name: string;
  role: string;
  contact: Contact;
  mobile?: string;
  philosophy?: string;
  hobbies: Hobby[];
}


export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  verifiable: boolean;
  evidence_url?: string;
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

export interface Project {
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
}

export interface Credential {
  id: string;
  type: "education" | "certification";
  title: string;
  institution: string;
  date?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  date_range?: string;
  contributions: string[];
}

export interface Skill {
  title: string;
  proficiency: number;
}

export interface TechCategory {
  icon?: string;
  items: Skill[];
}

export interface MasterPortfolio {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  tech: Record<string, TechCategory>;
  achievements: Achievement[];
  credentials: Credential[];
  languages: Skill[];
}

// ─── Progress Events ───

export type ProgressPhase =
  | "cache"
  | "gitlore"
  | "narrative"
  | "stitching"
  | "validation";

export interface ProgressEvent {
  phase: ProgressPhase;
  message: string;
  detail?: string;
}
