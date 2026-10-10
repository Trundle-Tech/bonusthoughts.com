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
- Data: one live Firestore listener (`onSnapshot`) on `briefing` (latest + the newest 30 dated docs). History charts,
  item history and the activity feed are all derived from those docs in `lib/briefing/model.ts`. No extra collections.
- Item identity across days = agent + normalized title. Same title on a later day = same item (history shows label changes).
- Charts with history show an empty state until 2+ days exist. Labor and cost intensity are always separate charts.
- Example data (`lib/briefing/demo-data.ts`, every title prefixed `[Example]`) only loads when built with
  `NEXT_PUBLIC_BRIEFING_DEMO=1`. `next.config.ts` pins that variable at build time so the module is dropped from the real build.
  Check: `grep -r "\[Example\]" out` must find nothing after `npm run build`.
- Demo preview modes: `?demo=single` (one day), `sparse`, `empty`, `error`, `loading`, `signin`, `denied`.
- Optional upload fields the new views use when present: `oue.guardrails[]` per day (guardrail history),
  `oue.*.value` per day (trend lines), `discoveries[]`, `writing[]`. Missing fields show "Not reported".
