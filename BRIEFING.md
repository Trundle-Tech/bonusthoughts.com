# Private briefing dashboard (/briefing)

Next.js static export + shadcn/ui (sidebar-16 shell, login-03 sign-in) + client-side Firebase.

- Route: `app/briefing/page.tsx` -> `components/briefing/*`, `lib/briefing/*`.
- Auth: Google popup, Firebase project `bonusthoughtshome` (named app "briefing", separate from `lib/firebase.ts`).
  Only `nicklynch@bonusthoughts.com` (email verified) gets in; everyone else sees the denied screen and is signed out.
  The real enforcement is Firestore rules (`site/firestore.rules`): owner read, no client writes.
- Data: Firestore `briefing/latest`, `briefing/<YYYY-MM-DD>`. No briefing data lives in the repo.
  Optional fields the UI reads when present: `oue` {labor_intensity, cost_intensity, measurement_level, guardrails[]},
  `discoveries[]`, `writing[]`. Missing fields show "Not reported", never filler.
- Run: `npm run dev` (open /briefing), or `npm run build` then serve `out/`.
- Example-data preview (placeholders only, no Firebase): `npm run build:demo`, serve `out/`,
  open `/briefing/` (also `?demo=signin|denied|loading|sparse|empty|error`).


## Operations center (v2)

Hash-routed views inside `/briefing/` (`#/overview`, `#/oue`, `#/items`, `#/history`, `#/agents/<slug>`,
`#/discoveries`, `#/writing`, `#/library`). Cmd/Ctrl-K opens search over views, agents and items.

- Agents shown: `lib/briefing/agents.ts` (`AGENT_CONFIG`). Currently X Desk, Research, Avoidance, Critic.
  Set `enabled: true` on another entry to bring it back everywhere (sidebar, board, charts, heatmap, diagram, search).
- Data: plain reads first (`getDocs` of the whole `briefing` collection, then `getDoc(briefing/latest)` if that fails), plus an
  `onSnapshot` listener on the same collection for live updates. No orderBy/limit/where, so no index is involved. Only `latest`
  and `YYYY-MM-DD` ids are used; the newest 30 dated days are kept client-side. If every method fails the error screen prints each
  Firestore code + message and a Retry button. The Firestore instance uses memory cache only (no IndexedDB persistence). History charts,
  item history and the activity feed are all derived from those docs in `lib/briefing/model.ts`. No extra collections.
- Item identity across days = agent + normalized title. Same title on a later day = same item (history shows label changes).
- Charts with history show an empty state until 2+ days exist. Labor and cost intensity are always separate charts.
- Example data (`lib/briefing/demo-data.ts`, every title prefixed `[Example]`) only loads when built with
  `NEXT_PUBLIC_BRIEFING_DEMO=1`. `next.config.ts` pins that variable at build time so the module is dropped from the real build.
  Check: `grep -r "\[Example\]" out` must find nothing after `npm run build`.
- Demo preview modes: `?demo=single` (one day), `sparse`, `empty`, `error`, `loading`, `signin`, `denied`.
- Optional upload fields the new views use when present: `oue.guardrails[]` per day (guardrail history),
  `oue.*.value` per day (trend lines), `discoveries[]`, `writing[]`. Missing fields show "Not reported".


### Exact JSON the UI reads (per `briefing/<day>` and `briefing/latest` doc)

Everything except `generated` and `sections` is optional; a missing field shows "Not reported" and never breaks a view.

```jsonc
{
  "generated": "2026-10-10T07:00:00-05:00",        // ISO 8601, required; day id = this date in America/Chicago
  "pushedAt": "2026-10-10T12:00:00.000Z",          // ISO, optional
  "sections": [                                    // required; only X Desk, Research, Avoidance, Critic are shown (see agents.ts)
    {
      "agent": "Research",                         // must match an agent name, case-insensitive
      "status": "one-line status text",            // shown verbatim
      "items": [
        {
          "title": "Stable title across days",     // item identity = agent + normalized title, so keep it stable to get history
          "detail": "free text",
          "source": "https://... or free text",
          "date": "2026-10-09",                    // item date, YYYY-MM-DD string
          "label": "sourced",                      // "sourced" | "estimate" | "inferred"; anything else shows as unlabeled
          "tags": ["Chokepoint", "Labor: routine rounds"]
        }
      ]
    }
  ],
  "oue": {                                         // optional; enables KPI tiles, OUE view, trends, guardrail grid
    "labor_intensity": { "value": 1180, "unit": "hours / MW-yr", "label": "estimate", "delta_pct": -0.7, "note": "...", "source": "..." },
    "cost_intensity":  { "value": 56069, "unit": "$ / MW-yr",   "label": "estimate", "delta_pct": -0.2, "note": "...", "source": "..." },
    //   value must be a number (numeric strings are accepted); trend charts need a numeric value on 2+ days
    "measurement_level": 1,                        // 1 estimated, 2 derived, 3 measured
    "guardrails": [                                // names matched case-insensitively; the six standard names are always listed
      { "name": "Customer incidents", "status": "held", "note": "..." }   // status: "held" | "watch" | "breach" | "not_reported"
    ],                                             // standard names: Customer incidents, SLA, PM compliance, Corrective backlog, Safety, Qualified coverage
    "as_of": "2026-10-10T07:00:00-05:00",
    "note": "optional footnote"
  },
  "discoveries": [                                 // optional; same item shape as above (title, detail, source, date, label, tags)
    { "title": "...", "detail": "...", "source": "...", "date": "2026-10-09", "label": "estimate", "tags": ["Chokepoint"] }
  ],                                               // when absent, the Discoveries view falls back to the Research items
  "writing": [ { "title": "...", "file": "x.md", "status": "draft", "body": "markdown text" } ]
}
```
