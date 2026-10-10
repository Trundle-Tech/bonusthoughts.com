// Pure derivation layer: turns the Firestore docs (one Briefing per day) into
// everything the operations-center views show. Nothing here invents data:
// every value is computed from fields the push script uploaded, and missing
// fields stay missing (undefined / "not reported").
import { ENABLED_AGENTS, type AgentDef } from "./agents";
import { dateIdChicago } from "./format";
import {
  GUARDRAIL_NAMES,
  type Briefing,
  type BriefingItem,
  type BriefingSection,
  type GuardrailStatus,
} from "./types";

export type LabelKey = "sourced" | "estimate" | "inferred" | "unlabeled";
export const LABEL_KEYS: LabelKey[] = ["sourced", "estimate", "inferred", "unlabeled"];

export function normLabel(l?: string): LabelKey {
  const x = (l ?? "").trim().toLowerCase();
  return x === "sourced" || x === "estimate" || x === "inferred" ? x : "unlabeled";
}

const emptyLabels = (): Record<LabelKey, number> => ({ sourced: 0, estimate: 0, inferred: 0, unlabeled: 0 });

export interface Sighting {
  day: string;
  label: LabelKey;
  date?: string;
  source?: string;
  detail?: string;
}

export interface Item {
  /** Stable identity across days: agent + normalized title. */
  key: string;
  /** Unique per day (key + day), for React keys. */
  uid: string;
  kind: "report" | "discovery";
  agent: string;
  agentSlug: string;
  title: string;
  detail: string;
  source?: string;
  date?: string;
  label: LabelKey;
  tags: string[];
  day: string;
  /** Every day this item was seen (ascending), including this one. */
  history: Sighting[];
  firstSeen: string;
  isNew: boolean;
  labelChanged: boolean;
}

export interface AgentDay {
  reported: boolean;
  status?: string;
  count: number;
  labels: Record<LabelKey, number>;
}

export interface AgentRow {
  def: AgentDef;
  index: number;
  today: AgentDay;
  prev?: AgentDay;
  items: Item[];
  series: { day: string; count: number; reported: boolean }[];
}

export interface OuePoint {
  day: string;
  labor?: number;
  laborLabel?: LabelKey;
  cost?: number;
  costLabel?: LabelKey;
}

export type FeedEvent =
  | { type: "briefing"; id: string; day: string; generated?: string; pushedAt?: string }
  | { type: "item"; id: string; day: string; item: Item };

export interface Model {
  /** All loaded days, ascending. */
  days: string[];
  selectedDay: string | null;
  prevDay: string | null;
  briefing: Briefing | null;
  items: Item[]; // selected day: enabled-agent report items
  discoveries: Item[];
  discoveriesDerived: boolean;
  agents: AgentRow[];
  agentDay: Record<string, Record<string, AgentDay>>;
  oue: OuePoint[];
  oueUnits: { labor: string; cost: string };
  guardrailNames: string[];
  guardrails: Record<string, Record<string, GuardrailStatus | undefined>>;
  hiddenSections: number;
  feed: FeedEvent[];
  labelMix: Record<LabelKey, number>;
  totals: { items: number; prevItems?: number };
}

const norm = (s?: string) => (s ?? "").trim().toLowerCase().replace(/\s+/g, " ").replace(/^\[example\]\s*/, "");

function findSection(b: Briefing, def: AgentDef): BriefingSection | undefined {
  return (b.sections ?? []).find((s) => {
    const n = (s.agent ?? "").trim().toLowerCase();
    return n === def.name.toLowerCase() || n === def.slug;
  });
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && isFinite(Number(v))) return Number(v);
  return undefined;
}

export function buildModel(byDay: Record<string, Briefing>, selectedDay: string | null): Model {
  const days = Object.keys(byDay).sort();
  const sel = selectedDay && byDay[selectedDay] ? selectedDay : null;
  const briefing = sel ? byDay[sel] : null;
  const prevDay = sel ? days[days.indexOf(sel) - 1] ?? null : null;

  // Pass 1: raw items per day, and sightings per key.
  type Raw = { kind: Item["kind"]; def?: AgentDef; agentName: string; slug: string; it: BriefingItem; day: string };
  const rawByDay: Record<string, Raw[]> = {};
  const sightings = new Map<string, Sighting[]>();
  const keyOf = (kind: Item["kind"], slug: string, title?: string) => `${kind}|${slug}|${norm(title)}`;

  for (const d of days) {
    const b = byDay[d];
    const raws: Raw[] = [];
    for (const def of ENABLED_AGENTS) {
      const s = findSection(b, def);
      for (const it of s?.items ?? []) raws.push({ kind: "report", def, agentName: def.name, slug: def.slug, it, day: d });
    }
    for (const it of b.discoveries ?? []) raws.push({ kind: "discovery", agentName: "Discoveries", slug: "discoveries", it, day: d });
    rawByDay[d] = raws;
    for (const r of raws) {
      const k = keyOf(r.kind, r.slug, r.it.title);
      const arr = sightings.get(k) ?? [];
      if (!arr.some((x) => x.day === d))
        arr.push({ day: d, label: normLabel(r.it.label), date: r.it.date, source: r.it.source, detail: r.it.detail });
      sightings.set(k, arr);
    }
  }

  const toItem = (r: Raw): Item => {
    const key = keyOf(r.kind, r.slug, r.it.title);
    const hist = (sightings.get(key) ?? []).slice().sort((a, b) => a.day.localeCompare(b.day));
    const first = hist[0]?.day ?? r.day;
    const labels = new Set(hist.map((h) => h.label));
    return {
      key,
      uid: `${key}@${r.day}`,
      kind: r.kind,
      agent: r.agentName,
      agentSlug: r.slug,
      title: r.it.title || "Untitled",
      detail: r.it.detail ?? "",
      source: r.it.source,
      date: r.it.date,
      label: normLabel(r.it.label),
      tags: r.it.tags ?? [],
      day: r.day,
      history: hist,
      firstSeen: first,
      isNew: first === r.day && days.length > 1 && r.day !== days[0],
      labelChanged: labels.size > 1,
    };
  };

  const itemsByDay: Record<string, Item[]> = {};
  for (const d of days) itemsByDay[d] = rawByDay[d].map(toItem);

  const items = sel ? itemsByDay[sel].filter((i) => i.kind === "report") : [];
  const realDisc = sel ? itemsByDay[sel].filter((i) => i.kind === "discovery") : [];
  const discoveriesDerived = !!briefing && !briefing.discoveries;
  const discoveries = discoveriesDerived ? items.filter((i) => i.agentSlug === "research") : realDisc;

  // Agent x day.
  const agentDay: Record<string, Record<string, AgentDay>> = {};
  for (const def of ENABLED_AGENTS) {
    agentDay[def.slug] = {};
    for (const d of days) {
      const s = findSection(byDay[d], def);
      const labels = emptyLabels();
      for (const it of s?.items ?? []) labels[normLabel(it.label)]++;
      agentDay[def.slug][d] = { reported: !!s, status: s?.status, count: s?.items?.length ?? 0, labels };
    }
  }
  const agents: AgentRow[] = ENABLED_AGENTS.map((def, index) => ({
    def,
    index,
    today: (sel && agentDay[def.slug][sel]) || { reported: false, count: 0, labels: emptyLabels() },
    prev: prevDay ? agentDay[def.slug][prevDay] : undefined,
    items: items.filter((i) => i.agentSlug === def.slug),
    series: days.map((d) => ({ day: d, count: agentDay[def.slug][d].count, reported: agentDay[def.slug][d].reported })),
  }));

  // OUE series.
  const oue: OuePoint[] = days.map((d) => {
    const o = byDay[d].oue;
    return {
      day: d,
      labor: num(o?.labor_intensity?.value),
      laborLabel: o?.labor_intensity?.label ? normLabel(o.labor_intensity.label) : undefined,
      cost: num(o?.cost_intensity?.value),
      costLabel: o?.cost_intensity?.label ? normLabel(o.cost_intensity.label) : undefined,
    };
  });
  const lastOue = (sel && byDay[sel].oue) || undefined;
  const oueUnits = {
    labor: lastOue?.labor_intensity?.unit || "hours / MW-yr",
    cost: lastOue?.cost_intensity?.unit || "$ / MW-yr",
  };

  // Guardrails x day.
  const names: string[] = [...GUARDRAIL_NAMES];
  const guardrails: Model["guardrails"] = {};
  for (const d of days)
    for (const g of byDay[d].oue?.guardrails ?? []) {
      if (!names.some((n) => n.toLowerCase() === g.name.toLowerCase())) names.push(g.name);
    }
  for (const n of names) {
    guardrails[n] = {};
    for (const d of days) {
      const g = byDay[d].oue?.guardrails?.find((x) => x.name.toLowerCase() === n.toLowerCase());
      guardrails[n][d] = g ? g.status ?? "not_reported" : undefined;
    }
  }

  const known = new Set(ENABLED_AGENTS.flatMap((a) => [a.name.toLowerCase(), a.slug]));
  const hiddenSections = briefing ? (briefing.sections ?? []).filter((s) => !known.has((s.agent ?? "").trim().toLowerCase())).length : 0;

  // Activity feed: "first reported" events, newest day first.
  const feed: FeedEvent[] = [];
  for (const d of [...days].reverse()) {
    feed.push({ type: "briefing", id: `b-${d}`, day: d, generated: byDay[d].generated, pushedAt: byDay[d].pushedAt });
    const fresh = itemsByDay[d]
      .filter((i) => i.firstSeen === d)
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    for (const it of fresh) feed.push({ type: "item", id: it.uid, day: d, item: it });
  }

  const labelMix = emptyLabels();
  for (const i of items) labelMix[i.label]++;

  return {
    days,
    selectedDay: sel,
    prevDay,
    briefing,
    items,
    discoveries,
    discoveriesDerived,
    agents,
    agentDay,
    oue,
    oueUnits,
    guardrailNames: names,
    guardrails,
    hiddenSections,
    feed,
    labelMix,
    totals: {
      items: items.length,
      prevItems: prevDay ? itemsByDay[prevDay].filter((i) => i.kind === "report").length : undefined,
    },
  };
}

export const dayOfBriefing = (b?: Briefing | null) => dateIdChicago(b?.generated);

export function shortDay(id: string): string {
  const [, m, d] = id.split("-").map(Number);
  return `${m}/${d}`;
}

export function longDay(id: string): string {
  const [y, m, d] = id.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(y, m - 1, d));
}
