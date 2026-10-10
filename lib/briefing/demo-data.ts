// EXAMPLE DATA ONLY. Placeholder content for local previews, never real briefing
// data. Only bundled when the build sets NEXT_PUBLIC_BRIEFING_DEMO=1: the sole
// importer is a dynamic import behind `if (DEMO)`, which the bundler removes
// from the real build.
import type { Briefing, BriefingItem, GuardrailStatus } from "./types";

type L = "sourced" | "estimate" | "inferred";

const LOREM = "Placeholder text for layout review. Not a real finding, number, or source.";

// An example item: present from day index `from`, with an optional label that
// changes on a later day so item history has something to show.
interface Ex {
  title: string;
  from: number;
  label: L;
  relabel?: { day: number; label: L };
  tags?: string[];
  detail?: string;
}

const AGENTS_EX: Record<string, { status: (d: number) => string; skip?: number[]; items: Ex[] }> = {
  "X Desk": {
    status: (d) => `Example status: ${d % 2 ? "drafts only" : "2 drafts queued"}`,
    items: [
      { title: "Example recurring complaint", from: 0, label: "sourced" },
      { title: "Example reply angle", from: 2, label: "inferred" },
      { title: "Example thread idea", from: 4, label: "inferred" },
      { title: "Example engagement pattern", from: 5, label: "estimate" },
    ],
  },
  Research: {
    status: (d) => `Example status: ${3 + (d % 3)} watches reported`,
    items: [
      { title: "Example chokepoint pattern", from: 0, label: "estimate", tags: ["Chokepoint", "Labor: routine rounds"] },
      { title: "Example benchmark, formula shown", from: 0, label: "estimate", relabel: { day: 3, label: "sourced" }, detail: LOREM + " Formula: not a real formula." },
      { title: "Example primary-source find", from: 1, label: "sourced" },
      { title: "Example pairing idea", from: 2, label: "inferred", tags: ["Pairing"] },
      { title: "Example vendor hand-off wait", from: 3, label: "inferred", tags: ["Chokepoint", "Labor: vendor hours"] },
      { title: "Example standards cross-reference", from: 4, label: "sourced" },
      { title: "Example cost model note", from: 6, label: "estimate" },
    ],
  },
  Avoidance: {
    status: (d) => (d < 2 ? "Example status: idle" : "Example status: 1 pattern flagged"),
    skip: [1],
    items: [
      { title: "Example avoided-work pattern", from: 3, label: "inferred" },
      { title: "Example repeat-visit pattern", from: 5, label: "estimate" },
    ],
  },
  Critic: {
    status: () => "Example status: checks run",
    items: [
      { title: "Example figure check", from: 0, label: "sourced" },
      { title: "Example claim needs a source", from: 2, label: "inferred", relabel: { day: 5, label: "sourced" } },
      { title: "Example unit mismatch", from: 4, label: "sourced" },
    ],
  },
};

// Example guardrail status by day index. Variation is invented for the preview.
const GUARD: Record<string, GuardrailStatus[]> = {
  "Customer incidents": ["held", "held", "held", "held", "held", "held", "held"],
  SLA: ["held", "held", "watch", "held", "held", "held", "held"],
  "PM compliance": ["held", "watch", "watch", "watch", "held", "held", "watch"],
  "Corrective backlog": ["held", "held", "held", "watch", "held", "held", "held"],
  Safety: ["held", "held", "held", "held", "held", "held", "held"],
  "Qualified coverage": ["not_reported", "not_reported", "not_reported", "held", "held", "held", "held"],
};

function build(i: number): Briefing {
  const date = `2026-01-0${i + 1}`;
  const generated = `${date}T07:00:00-06:00`;
  const sections = Object.entries(AGENTS_EX)
    .filter(([, a]) => !a.skip?.includes(i))
    .map(([agent, a]) => ({
      agent,
      status: a.status(i),
      items: a.items
        .filter((x) => i >= x.from)
        .map<BriefingItem>((x) => ({
          title: `[Example] ${x.title}`,
          detail: x.detail ?? LOREM,
          label: x.relabel && i >= x.relabel.day ? x.relabel.label : x.label,
          date: `2026-01-0${Math.max(1, x.from + 1)}`,
          source: "example://placeholder-source",
          tags: x.tags,
        })),
    }));
  // A couple of sections from agents that are currently hidden in the UI, so the
  // "not shown" footnote can be reviewed.
  sections.push({ agent: "Builder", status: "Example status: no assigned output", items: [] });
  const disc = (AGENTS_EX.Research.items.filter((x) => i >= x.from && x.tags?.length) ?? []).map<BriefingItem>((x) => ({
    title: `[Example] Discovery: ${x.title.replace("Example ", "")}`,
    detail: LOREM,
    label: x.label,
    date: `2026-01-0${x.from + 1}`,
    source: "example://placeholder-source",
    tags: x.tags,
  }));
  return {
    generated,
    pushedAt: `2026-01-0${i + 1}T07:02:00-06:00`,
    oue: {
      labor_intensity: {
        value: 1234 - i * 9 + (i === 4 ? 14 : 0),
        unit: "hours / MW-yr",
        label: "estimate",
        delta_pct: i === 0 ? null : i === 4 ? 1.1 : -0.7,
        note: "Example number. Not a measurement of any site.",
      },
      cost_intensity: {
        value: 56789 - i * 120 + (i === 5 ? 480 : 0),
        unit: "$ / MW-yr",
        label: i < 3 ? "estimate" : "inferred",
        delta_pct: i === 0 ? null : i === 5 ? 0.9 : -0.2,
        note: "Example number. Not a measurement of any site.",
      },
      measurement_level: 1,
      as_of: generated,
      guardrails: Object.entries(GUARD).map(([name, st]) => ({ name, status: st[i], note: "Example status" })),
    },
    sections,
    discoveries: disc,
    writing:
      i >= 3
        ? [
            {
              title: "[Example] Draft post title",
              file: "example-draft.md",
              status: "draft",
              body: "# [Example] Draft post title\n\nThis is example draft text so the Writing section can be reviewed.\n\n- Not real writing.\n- Not published anywhere.\n",
            },
            {
              title: "[Example] Outline",
              file: "example-outline.md",
              status: "outline",
              body: "# [Example] Outline\n\n1. Point one (placeholder)\n2. Point two (placeholder)\n",
            },
          ]
        : [],
  };
}

export const DEMO_DAYS: Record<string, Briefing> = Object.fromEntries(
  [0, 1, 2, 3, 4, 5, 6].map((i) => [`2026-01-0${i + 1}`, build(i)])
);
export const DEMO_LATEST = "2026-01-07";

/** A sparse briefing: only what the current real push script produces (no oue, discoveries or writing). */
export const DEMO_SPARSE: Briefing = {
  generated: "2026-01-04T07:00:00-06:00",
  sections: build(3).sections.slice(0, 3),
};
