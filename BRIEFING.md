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
