# Bonus Thoughts briefing (private)

Static page: `index.html`, `style.css`, `app.js` (Firebase modular SDK from CDN, no build).
Google sign-in; only `nicklynch@bonusthoughts.com` (email verified) can read the data.
Data: Firestore `briefing/latest` and `briefing/<YYYY-MM-DD>`; rules in `firestore.rules` (read owner only, no client writes).
Upload: `node push_briefing.mjs` (needs a service-account key; see header of the script). `--dry-run` to check.
Firebase Auth authorized domains must include `bonusthoughts.com` and `www.bonusthoughts.com`.
