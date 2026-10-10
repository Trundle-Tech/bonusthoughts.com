// EXAMPLE DATA ONLY. Placeholder content for local previews, never real briefing
// data. Only bundled when the build sets NEXT_PUBLIC_BRIEFING_DEMO=1.
import type { Briefing, BriefingItem } from "./types";

const it = (
  title: string,
  detail: string,
  label: "sourced" | "estimate" | "inferred",
  date = "2026-01-01",
  source = "example://placeholder-source"
): BriefingItem => ({ title: `[Example] ${title}`, detail, label, date, source });

const LOREM =
  "Placeholder text for layout review. Not a real finding, number, or source.";

function build(generated: string, variant: number): Briefing {
  return {
    generated,
    pushedAt: generated,
    oue: {
      labor_intensity: {
        value: 1234 - variant * 9,
        unit: "hours / MW-yr",
        label: "estimate",
        delta_pct: variant === 0 ? -1.2 : -3.4,
        note: "Example number. Not a measurement of any site.",
      },
      cost_intensity: {
        value: 56789 - variant * 120,
        unit: "$ / MW-yr",
        label: "estimate",
        delta_pct: variant === 0 ? 0.6 : -0.9,
        note: "Example number. Not a measurement of any site.",
      },
      measurement_level: 1,
      as_of: generated,
      guardrails: [
        { name: "Customer incidents", status: "held", note: "Example status" },
        { name: "SLA", status: "held", note: "Example status" },
        { name: "PM compliance", status: "watch", note: "Example status" },
        { name: "Corrective backlog", status: "held", note: "Example status" },
        { name: "Safety", status: "held", note: "Example status" },
        { name: "Qualified coverage", status: "not_reported" },
      ],
    },
    sections: [
      {
        agent: "Chief of Staff",
        status: "Example status: active",
        items: [
          it("Changed since last run", LOREM, "sourced"),
          it("Example board item", LOREM + " " + LOREM, "sourced"),
          it("Example open question", LOREM, "inferred"),
        ],
      },
      {
        agent: "Research",
        status: "Example status: 3 watches reported",
        items: [
          it("Example chokepoint pattern", LOREM, "estimate"),
          it("Example benchmark, formula shown", LOREM + " Formula: not a real formula.", "estimate"),
          it("Example primary-source find", LOREM, "sourced"),
          it("Example pairing idea", LOREM, "inferred"),
        ],
      },
      {
        agent: "Builder",
        status: "Example status: no assigned output",
        items: [it("Example tooling note", LOREM, "inferred")],
      },
      {
        agent: "Critic",
        status: "Example status: nothing flagged",
        items: [it("Example figure check", LOREM, "sourced")],
      },
      {
        agent: "Inbox Watch",
        status: "Example status: subject-level only, read-only",
        items: [
          it("Example vendor thread", LOREM, "sourced"),
          it("Example site-visit thread", LOREM, "sourced"),
        ],
      },
      {
        agent: "X Desk",
        status: "Example status: drafts only",
        items: [it("Example recurring complaint", LOREM, "sourced")],
      },
      {
        agent: "Avoidance",
        status: "Example status: idle",
        items: [],
      },
      {
        agent: "MR Meta Bot",
        status: "Example status: concept written",
        items: [it("Example walkdown-capture concept", LOREM, "inferred")],
      },
    ],
    discoveries: [
      {
        ...it("Example discovery: manual round that repeats", LOREM, "estimate", "2026-01-03"),
        tags: ["Chokepoint", "Labor: routine rounds"],
      },
      {
        ...it("Example discovery: vendor hand-off wait", LOREM, "inferred", "2026-01-02"),
        tags: ["Chokepoint", "Labor: vendor hours"],
      },
      {
        ...it("Example discovery: cross-industry pairing", LOREM, "sourced", "2026-01-01"),
        tags: ["Pairing"],
      },
    ],
    writing: [
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
    ],
  };
}

export const DEMO_DAYS: Record<string, Briefing> = {
  "2026-01-03": build("2026-01-03T07:00:00-06:00", 0),
  "2026-01-02": build("2026-01-02T07:00:00-06:00", 1),
  "2026-01-01": build("2026-01-01T07:00:00-06:00", 2),
};
export const DEMO_LATEST = "2026-01-03";

/** A sparse briefing: only what the current real push script produces (no oue, discoveries or writing). */
export const DEMO_SPARSE: Briefing = {
  generated: "2026-01-04T07:00:00-06:00",
  sections: build("2026-01-04T07:00:00-06:00", 0).sections.slice(0, 3),
};
