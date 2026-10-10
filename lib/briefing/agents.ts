import {
  Ban, Compass, FlaskConical, Glasses, Hammer, Inbox, MessageSquareText, Scale,
  type LucideIcon,
} from "lucide-react";

/**
 * The single list that controls which agents appear in the dashboard (sidebar,
 * status board, charts, heatmap, flow diagram, tables, search).
 *
 * To bring an agent back, flip `enabled` to true. Nothing else changes.
 * Order here is the order shown in the UI. `name` must match the `agent` field
 * of the section the push script uploads (case-insensitive).
 */
export interface AgentDef {
  name: string;
  slug: string;
  icon: LucideIcon;
  enabled: boolean;
}

export const AGENT_CONFIG: AgentDef[] = [
  { name: "X Desk", slug: "x-desk", icon: MessageSquareText, enabled: true },
  { name: "Research", slug: "research", icon: FlaskConical, enabled: true },
  { name: "Avoidance", slug: "avoidance", icon: Ban, enabled: true },
  { name: "Critic", slug: "critic", icon: Scale, enabled: true },
  // Parked for now (flip `enabled` to show them again):
  { name: "Chief of Staff", slug: "chief-of-staff", icon: Compass, enabled: false },
  { name: "Builder", slug: "builder", icon: Hammer, enabled: false },
  { name: "Inbox Watch", slug: "inbox-watch", icon: Inbox, enabled: false },
  { name: "MR Meta Bot", slug: "mr-meta-bot", icon: Glasses, enabled: false },
];

export const ENABLED_AGENTS = AGENT_CONFIG.filter((a) => a.enabled);

export function agentByName(name?: string): AgentDef | undefined {
  const n = (name ?? "").trim().toLowerCase();
  return AGENT_CONFIG.find((a) => a.name.toLowerCase() === n || a.slug === n);
}
export function agentBySlug(slug?: string): AgentDef | undefined {
  return ENABLED_AGENTS.find((a) => a.slug === slug);
}

/** Chart color per enabled agent (shadcn chart tokens, cycled). */
export function agentColorVar(index: number): string {
  return `var(--chart-${(index % 5) + 1})`;
}
