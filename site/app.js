import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut }
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection }
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Public web config (not a secret). Access is enforced by Firestore rules.
const firebaseConfig = {
  projectId: "bonusthoughtshome",
  appId: "1:67266423536:web:62cef609a1d6f56a767035",
  storageBucket: "bonusthoughtshome.firebasestorage.app",
  apiKey: "AIzaSyDdkRXiC5bXgUk3yndUqUXA38vuXjnu9bs",
  authDomain: "bonusthoughtshome.firebaseapp.com",
  messagingSenderId: "67266423536",
  measurementId: "G-1RT82BWCEW"
};
const OWNER = "nicklynch@bonusthoughts.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = (id) => document.getElementById(id);
const views = ["loading", "signin", "denied", "briefing"];
const show = (name) => views.forEach((v) => { $("view-" + v).hidden = v !== name; });

const CT = "America/Chicago";
function fmtDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || "");
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CT, weekday: "short", month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short"
  }).format(d);
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function badge(label) {
  const l = String(label || "").toLowerCase();
  const known = ["sourced", "estimate", "inferred"].includes(l);
  return el("span", "badge " + (known ? l : "other"), l || "unlabeled");
}

function renderItem(it) {
  const box = el("div", "item");
  const row = el("div", "row");
  row.append(el("div", "title", it.title || ""), badge(it.label));
  box.append(row);
  if (it.detail) box.append(el("p", "detail", it.detail));
  const meta = el("div", "meta");
  const parts = [];
  if (it.source) parts.push(["Source: ", it.source]);
  if (it.date) parts.push(["Date: ", it.date]);
  parts.forEach((p, i) => {
    if (i) meta.append(document.createTextNode(" · "));
    meta.append(document.createTextNode(p[0]));
    if (/^https?:\/\//i.test(p[1])) {
      const a = el("a", null, p[1]);
      a.href = p[1]; a.target = "_blank"; a.rel = "noopener noreferrer";
      meta.append(a);
    } else meta.append(document.createTextNode(p[1]));
  });
  box.append(meta);
  return box;
}

function renderBriefing(data, docId) {
  $("generated").textContent = "Generated " + fmtDateTime(data.generated);
  const cards = $("cards");
  cards.replaceChildren();
  (data.sections || []).forEach((s) => {
    const card = el("article", "card");
    const head = el("header");
    head.append(el("h3", null, s.agent || "Agent"));
    if (s.status) head.append(el("p", "status", s.status));
    card.append(head);
    const items = s.items || [];
    if (!items.length) card.append(el("p", "muted", "Nothing to report."));
    items.forEach((it) => card.append(renderItem(it)));
    cards.append(card);
  });

  const w = $("writing-list");
  w.replaceChildren();
  const drafts = data.writing || [];
  $("writing").hidden = drafts.length === 0;
  drafts.forEach((d) => {
    const det = el("details", "draft");
    const sum = el("summary", null, d.title || d.file || "Draft");
    det.append(sum);
    if (d.status) det.append(el("div", "meta", d.status + (d.file ? " · " + d.file : "")));
    det.append(el("pre", null, d.body || ""));
    w.append(det);
  });
  $("foot").textContent = "Briefing " + docId + (data.pushedAt ? " · uploaded " + fmtDateTime(data.pushedAt) : "");
}

async function loadDoc(id) {
  $("data-error").hidden = true;
  try {
    const snap = await getDoc(doc(db, "briefing", id));
    if (!snap.exists()) {
      $("cards").replaceChildren();
      $("generated").textContent = "";
      $("data-error").textContent = "No briefing has been uploaded yet.";
      $("data-error").hidden = false;
      return;
    }
    renderBriefing(snap.data(), id);
  } catch (e) {
    console.error(e);
    $("data-error").textContent = "Couldn't load the briefing (" + (e.code || e.message) + ").";
    $("data-error").hidden = false;
  }
}

async function loadHistory() {
  const sel = $("history");
  try {
    const snaps = await getDocs(collection(db, "briefing"));
    const ids = snaps.docs.map((d) => d.id).filter((i) => /^\d{4}-\d{2}-\d{2}$/.test(i)).sort().reverse();
    sel.replaceChildren();
    const latest = el("option", null, "Latest"); latest.value = "latest"; sel.append(latest);
    ids.forEach((i) => { const o = el("option", null, i); o.value = i; sel.append(o); });
    sel.hidden = ids.length === 0;
  } catch (e) { console.error(e); sel.hidden = true; }
}

$("history").addEventListener("change", (e) => loadDoc(e.target.value));
$("btn-signin").addEventListener("click", async () => {
  $("signin-error").hidden = true;
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch (e) {
    if (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") return;
    $("signin-error").textContent = "Sign-in failed (" + (e.code || e.message) + ").";
    $("signin-error").hidden = false;
  }
});
$("btn-signout").addEventListener("click", () => signOut(auth));
$("btn-retry").addEventListener("click", () => { show("signin"); });

// If auth state is slow to resolve, show the sign-in button rather than a blank page.
setTimeout(() => { if (!$("view-loading").hidden) show("signin"); }, 6000);

onAuthStateChanged(auth, async (user) => {
  if (!user) { if ($("view-denied").hidden) show("signin"); return; }
  const ok = (user.email || "").toLowerCase() === OWNER && user.emailVerified === true;
  if (!ok) {
    show("denied");
    await signOut(auth);
    return;
  }
  show("briefing");
  await loadDoc("latest");
  loadHistory();
});
