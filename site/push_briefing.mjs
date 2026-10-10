#!/usr/bin/env node
// Upload /workspace/bt/briefing.json (+ drafts) to Firestore: briefing/latest and briefing/<YYYY-MM-DD>.
// No dependencies (Node 18+). Uses Firestore REST with a Google service-account key.
//
// Credential: set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path with
// "Cloud Datastore User" (roles/datastore.user) on project bonusthoughtshome, or place the key at
// /workspace/bt/secrets/service-account.json (outside the repo). The key is never printed.
//
// Usage: node push_briefing.mjs [--dry-run] [--briefing path] [--drafts dir]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const PROJECT = "bonusthoughtshome";
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const briefingPath = opt("--briefing", "/workspace/bt/briefing.json");
const draftsDir = opt("--drafts", "/workspace/bt/drafts");

const data = JSON.parse(fs.readFileSync(briefingPath, "utf8"));
if (!data.generated || !Array.isArray(data.sections)) throw new Error("briefing.json: expected {generated, sections[]}");

// Writing section from drafts/*.md
data.writing = [];
if (fs.existsSync(draftsDir)) {
  for (const f of fs.readdirSync(draftsDir).filter((f) => f.endsWith(".md")).sort()) {
    const body = fs.readFileSync(path.join(draftsDir, f), "utf8");
    const h = body.match(/^#\s+(.+)$/m);
    data.writing.push({
      title: h ? h[1].trim() : f.replace(/\.md$/, "").replace(/-/g, " "),
      file: f,
      status: /outline/i.test(f) ? "outline" : "draft",
      body: body.slice(0, 20000),
    });
  }
}
data.pushedAt = new Date().toISOString();

// Dated doc id = date of `generated` in America/Chicago
const dateId = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" })
  .format(new Date(data.generated));

// --- Firestore value encoding
function enc(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } };
}
const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, enc(v)]));

if (dry) {
  console.log(`dry run: would write briefing/latest and briefing/${dateId} (${data.sections.length} sections, ${data.writing.length} drafts)`);
  process.exit(0);
}

// --- Credential: service account -> OAuth access token (JWT bearer)
function keyPath() {
  const c = [process.env.GOOGLE_APPLICATION_CREDENTIALS, "/workspace/bt/secrets/service-account.json"].filter(Boolean);
  return c.find((p) => fs.existsSync(p));
}
async function accessToken() {
  const p = keyPath();
  if (!p) {
    console.error("No credential found. Set GOOGLE_APPLICATION_CREDENTIALS (or create /workspace/bt/secrets/service-account.json) " +
      `with a service-account key for project ${PROJECT} that has roles/datastore.user.`);
    process.exit(2);
  }
  const sa = JSON.parse(fs.readFileSync(p, "utf8"));
  if (sa.type !== "service_account") { console.error("Credential file is not a service_account key."); process.exit(2); }
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = b64({ alg: "RS256", typ: "JWT" }) + "." + b64({
    iss: sa.client_email, scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 });
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(sa.private_key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + sig }) });
  if (!r.ok) { console.error("Token exchange failed: HTTP " + r.status); process.exit(3); }
  return (await r.json()).access_token;
}

const token = await accessToken();
for (const id of ["latest", dateId]) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/briefing/${id}`;
  const r = await fetch(url, { method: "PATCH", headers: { authorization: "Bearer " + token, "content-type": "application/json" },
    body: JSON.stringify({ fields }) });
  if (!r.ok) { console.error(`briefing/${id}: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`); process.exit(4); }
  console.log(`wrote briefing/${id}`);
}
