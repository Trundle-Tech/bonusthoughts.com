"use client";

import * as React from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { briefingAuth, briefingDb } from "./firebase";
import { dateIdChicago } from "./format";
import { OWNER_EMAIL, type Briefing } from "./types";

// Build-time switch. With it unset (production), the demo branch and the demo
// data module are dead code and are not bundled.
export const DEMO = process.env.NEXT_PUBLIC_BRIEFING_DEMO === "1";

export type Session =
  | { state: "loading" }
  | { state: "signedOut"; error?: string }
  | { state: "denied"; email: string }
  | { state: "ready"; email: string; name?: string | null; photo?: string | null };

function demoMode(): string {
  if (typeof window === "undefined") return "ready";
  return new URLSearchParams(window.location.search).get("demo") ?? "ready";
}

export function useSession() {
  const [session, setSession] = React.useState<Session>({ state: "loading" });
  // Once a wrong account was rejected, keep showing the denial until the user
  // chooses to try again (we sign them out right away, which would otherwise
  // flip the screen back to the sign-in gate).
  const denied = React.useRef(false);

  React.useEffect(() => {
    if (DEMO) {
      const m = demoMode();
      if (m === "signin") setSession({ state: "signedOut" });
      else if (m === "denied") setSession({ state: "denied", email: "someone@example.com" });
      else if (m === "loading") setSession({ state: "loading" });
      else
        setSession({
          state: "ready",
          email: "example@example.com",
          name: "Example User",
        });
      return;
    }
    const auth = briefingAuth();
    // If auth never resolves, show the sign-in button instead of a blank page.
    const t = setTimeout(
      () => setSession((s) => (s.state === "loading" ? { state: "signedOut" } : s)),
      6000
    );
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (!denied.current) setSession({ state: "signedOut" });
        return;
      }
      const email = (user.email ?? "").toLowerCase();
      if (email === OWNER_EMAIL && user.emailVerified === true) {
        denied.current = false;
        setSession({
          state: "ready",
          email,
          name: user.displayName,
          photo: user.photoURL,
        });
      } else {
        denied.current = true;
        setSession({ state: "denied", email: user.email ?? "unknown account" });
        await signOut(auth);
      }
    });
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, []);

  const signIn = React.useCallback(async () => {
    if (DEMO) return;
    denied.current = false;
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(briefingAuth(), provider);
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      )
        return;
      setSession({
        state: "signedOut",
        error: `Sign-in failed (${err.code ?? err.message ?? "unknown error"}).`,
      });
    }
  }, []);

  const logOut = React.useCallback(async () => {
    if (DEMO) {
      setSession({ state: "signedOut" });
      return;
    }
    await signOut(briefingAuth());
  }, []);

  const retry = React.useCallback(() => {
    denied.current = false;
    setSession({ state: "signedOut" });
  }, []);

  return { session, signIn, logOut, retry };
}

export type LiveStatus = "connecting" | "live" | "offline" | "example";

export type DataState = {
  /** Dated doc ids (YYYY-MM-DD), newest first. */
  days: string[];
  /** "latest" or a dated doc id. */
  selected: string;
  select: (id: string) => void;
  data: Briefing | null;
  /** Every loaded briefing by day id (recent history, newest 30 days plus latest). */
  byDay: Record<string, Briefing>;
  /** Dated id the shown doc corresponds to (for the calendar). */
  shownDay: string | null;
  loading: boolean;
  error: string | null;
  empty: boolean;
  example: boolean;
  /** Full Firestore error (code + message chain) when loading failed, for the error screen. */
  errorDetail: string | null;
  /** Non-fatal notice, e.g. the live listener failed and a one-time read is shown instead. */
  warning: string | null;
  /** Re-run the load from scratch. */
  retry: () => void;
  live: LiveStatus;
  /** When the last Firestore snapshot arrived. */
  syncedAt: Date | null;
};

// How many dated briefings to keep (newest first, applied client-side; plus "latest").
const HISTORY_DAYS = 30;

type Store = {
  byDay: Record<string, Briefing>;
  latestId: string | null;
  ready: boolean;
  error: string | null;
  errorDetail: string | null;
  warning: string | null;
  live: LiveStatus;
  syncedAt: Date | null;
};

const EMPTY_STORE: Store = {
  byDay: {}, latestId: null, ready: false, error: null, errorDetail: null, warning: null, live: "connecting", syncedAt: null,
};

/** "code: message" for a Firestore (or any) error, never empty. */
function describe(e: unknown): string {
  const err = e as { code?: string; message?: string };
  const code = err?.code ?? "unknown";
  const msg = (err?.message ?? String(e)).replace(/\s+/g, " ").trim();
  return msg && msg !== code ? `${code}: ${msg}` : code;
}

/** Fold raw docs ("latest" + dated ids) into one Briefing per calendar day. */
function fold(docs: { id: string; data: Briefing }[]) {
  const byDay: Record<string, Briefing> = {};
  let latest: Briefing | null = null;
  // Only "latest" and YYYY-MM-DD ids count; anything else in the collection is ignored.
  const dated = docs.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.id)).sort((a, b) => b.id.localeCompare(a.id));
  for (const d of dated.slice(0, HISTORY_DAYS)) byDay[d.id] = d.data;
  for (const d of docs) if (d.id === "latest") latest = d.data;
  let latestId: string | null = null;
  if (latest) {
    latestId = dateIdChicago(latest.generated);
    if (latestId && !byDay[latestId]) byDay[latestId] = latest;
  }
  if (!latestId) latestId = Object.keys(byDay).sort().pop() ?? null;
  return { byDay, latestId };
}

export function useBriefingData(enabled: boolean): DataState {
  const [selected, setSelected] = React.useState("latest");
  const [store, setStore] = React.useState<Store>(EMPTY_STORE);
  const [attempt, setAttempt] = React.useState(0);
  const retry = React.useCallback(() => setAttempt((a) => a + 1), []);

  React.useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setStore(EMPTY_STORE);

    // The env check is written inline (not via the DEMO const) so the bundler can
    // fold it to `false` and drop the dynamic import of demo-data from real builds.
    if (process.env.NEXT_PUBLIC_BRIEFING_DEMO === "1") {
      (async () => {
        const { DEMO_DAYS, DEMO_LATEST, DEMO_SPARSE } = await import("./demo-data");
        const mode = demoMode();
        await new Promise((r) => setTimeout(r, mode === "loading" ? 60_000 : 250));
        if (cancelled) return;
        const base = { ready: true, live: "example" as const, syncedAt: new Date() };
        if (mode === "empty") setStore({ ...EMPTY_STORE, ...base });
        else if (mode === "error")
          setStore({
            ...EMPTY_STORE,
            ...base,
            error: "Couldn't load the briefing (example error: permission-denied).",
            errorDetail: "listener: permission-denied: [Example] Missing or insufficient permissions.\ngetDocs: permission-denied: [Example] Missing or insufficient permissions.\ngetDoc(briefing/latest): permission-denied: [Example] Missing or insufficient permissions.",
          });
        else if (mode === "sparse")
          setStore({ ...EMPTY_STORE, ...base, byDay: { "2026-01-04": DEMO_SPARSE }, latestId: "2026-01-04" });
        else if (mode === "single")
          setStore({ ...EMPTY_STORE, ...base, byDay: { [DEMO_LATEST]: DEMO_DAYS[DEMO_LATEST] }, latestId: DEMO_LATEST });
        else setStore({ ...EMPTY_STORE, ...base, byDay: DEMO_DAYS, latestId: DEMO_LATEST });
      })();
      return () => {
        cancelled = true;
      };
    }

    // Loading is layered so one failing method cannot blank the page. Plain reads
    // (no orderBy / limit / where, so no index is involved) run first, like v1;
    // the live listener is an upgrade on top:
    //  1. one-time getDocs of the whole (small) collection;
    //  2. if that fails, getDoc(briefing/latest) so at least the latest day renders;
    //  3. in parallel, onSnapshot on the same collection for live updates;
    //  4. only if every method fails does the error screen show, with each code + message.
    const db = briefingDb();
    const col = collection(db, "briefing");
    let liveGot = false; // listener has delivered data
    let anyData = false;
    let listenerErr: unknown = null;
    let unsub: () => void = () => {};

    const apply = (docs: { id: string; data: Briefing }[], live: LiveStatus, warning: string | null) => {
      if (cancelled) return;
      const { byDay, latestId } = fold(docs);
      anyData = true;
      setStore({ byDay, latestId, ready: true, error: null, errorDetail: null, warning, live, syncedAt: new Date() });
    };
    const toDocs = (snap: { docs: { id: string; data: () => unknown }[] }) =>
      snap.docs.map((d) => ({ id: d.id, data: d.data() as Briefing }));

    const loadOnce = async () => {
      const chain: string[] = [];
      try {
        const snap = await getDocs(col);
        if (liveGot) return; // the listener already delivered fresher data
        apply(toDocs(snap), listenerErr ? "offline" : "connecting", listenerErr ? `Live updates are unavailable (${describe(listenerErr)}). Showing a one-time read; use Retry to reconnect.` : null);
        return;
      } catch (e) {
        console.error("briefing getDocs failed", e);
        chain.push(`getDocs: ${describe(e)}`);
      }
      try {
        const one = await getDoc(doc(db, "briefing", "latest"));
        if (liveGot) return;
        apply(
          one.exists() ? [{ id: "latest", data: one.data() as Briefing }] : [],
          "offline",
          `Only the latest briefing could be read (${chain.join("; ")}). History is unavailable; use Retry to try again.`
        );
        return;
      } catch (e) {
        console.error("briefing getDoc(latest) failed", e);
        chain.push(`getDoc(briefing/latest): ${describe(e)}`);
      }
      if (cancelled || liveGot || anyData) return;
      if (listenerErr) chain.push(`listener: ${describe(listenerErr)}`);
      setStore({ ...EMPTY_STORE, ready: true, live: "offline", error: "Couldn't load the briefing.", errorDetail: chain.join("\n") });
    };

    unsub = onSnapshot(
      col,
      (snap) => {
        liveGot = true;
        apply(toDocs(snap), snap.metadata.fromCache ? "connecting" : "live", null);
      },
      (e) => {
        if (cancelled) return;
        console.error("briefing listener failed", e);
        listenerErr = e;
        // Keep whatever is already showing; just mark it as no longer live.
        if (anyData) setStore((s) => (s.error ? s : { ...s, live: "offline", warning: `Live updates stopped (${describe(e)}). Use Retry to reconnect.` }));
      }
    );
    void loadOnce();
    return () => {
      cancelled = true;
      unsub();
    };
  }, [enabled, attempt]);

  const days = React.useMemo(() => Object.keys(store.byDay).sort().reverse(), [store.byDay]);
  const shownDay = selected === "latest" ? store.latestId : store.byDay[selected] ? selected : null;
  const data = shownDay ? store.byDay[shownDay] ?? null : null;

  return {
    days,
    selected,
    select: setSelected,
    data,
    byDay: store.byDay,
    shownDay,
    loading: !store.ready,
    error: store.error,
    errorDetail: store.errorDetail,
    warning: store.warning,
    retry,
    empty: store.ready && !store.error && !data,
    example: DEMO,
    live: store.live,
    syncedAt: store.syncedAt,
  };
}
