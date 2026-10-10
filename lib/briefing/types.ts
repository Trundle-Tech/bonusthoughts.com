// Shape of the Firestore docs briefing/latest and briefing/<YYYY-MM-DD>.
// Everything past `generated` and `sections` is optional; the UI says
// "not reported" instead of filling gaps.

export type Label = "sourced" | "estimate" | "inferred";

export interface BriefingItem {
  title?: string;
  detail?: string;
  source?: string;
  date?: string;
  label?: string; // normally a Label, but kept loose: unknown values render as "unlabeled"
  tags?: string[];
}

export interface BriefingSection {
  agent?: string;
  status?: string;
  items?: BriefingItem[];
}

export interface WritingDraft {
  title?: string;
  file?: string;
  status?: string; // "draft" | "outline"
  body?: string;
}

export type GuardrailStatus = "held" | "watch" | "breach" | "not_reported";

export interface OueGuardrail {
  name: string;
  status?: GuardrailStatus;
  note?: string;
}

export interface OueMetric {
  value?: number | string | null;
  unit?: string; // e.g. "hours / MW-yr" or "$ / MW-yr"
  label?: string; // sourced / estimate / inferred
  delta_pct?: number | null; // change vs previous read; |x| < 2 counts as flat
  note?: string;
  source?: string;
}

export interface Oue {
  labor_intensity?: OueMetric;
  cost_intensity?: OueMetric;
  measurement_level?: 1 | 2 | 3; // 1 estimated, 2 derived, 3 measured
  guardrails?: OueGuardrail[];
  as_of?: string;
  note?: string;
}

export interface Briefing {
  generated: string;
  sections: BriefingSection[];
  writing?: WritingDraft[];
  oue?: Oue;
  discoveries?: BriefingItem[];
  pushedAt?: string;
}

export const OWNER_EMAIL = "nicklynch@bonusthoughts.com";
export const TIME_ZONE = "America/Chicago";

// Order the agent cards appear in.
export const AGENTS = [
  "Chief of Staff",
  "Research",
  "Builder",
  "Critic",
  "Inbox Watch",
  "X Desk",
  "Avoidance",
  "MR Meta Bot",
] as const;

// The six guardrails named in the mission brief.
export const GUARDRAIL_NAMES = [
  "Customer incidents",
  "SLA",
  "PM compliance",
  "Corrective backlog",
  "Safety",
  "Qualified coverage",
] as const;

export const MEASUREMENT_LEVELS = [
  { level: 1, name: "Estimated" },
  { level: 2, name: "Derived" },
  { level: 3, name: "Measured" },
] as const;
