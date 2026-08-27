export type Locale = "en" | "es";

export type Localized = Record<Locale, string>;

export type CareerNodeKind = "job" | "contract" | "freelance" | "education";

export interface Metric {
  value: string;
  label: Localized;
}

export interface CareerNode {
  id: string;
  kind: CareerNodeKind;
  company: string;
  /** Short name shown as the node label in the 3D scene; falls back to company */
  sceneLabel?: string;
  role: Localized;
  start: string; // ISO date (YYYY-MM)
  end: string | null; // null = present
  mode: Localized; // e.g. "Remote (US)", "Hybrid"
  summary: Localized;
  highlights: Localized[];
  tech: string[];
  metrics?: Metric[];
}

export type ProjectKind =
  | "professional"
  | "hackathon"
  | "experiment"
  | "archive";

export interface Project {
  id: string;
  kind: ProjectKind;
  name: string;
  description: Localized;
  tech: string[];
  repo?: string;
  live?: string;
  featured: boolean;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  location: Localized;
  socials: { label: string; url: string }[];
}
