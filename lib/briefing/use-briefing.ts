"use client";

import * as React from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, documentId, limit, onSnapshot, orderBy, query } from "firebase/firestore";
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
  live: LiveStatus;
  /** When the last Firestore snapshot arrived. */
  syncedAt: Date | null;
};

// How many dated briefings to keep in the live listener (plus "latest").
const HISTORY_DAYS = 30;

type Store = {
  byDay: Record<string, Briefing>;
  latestId: string | null;
  ready: boolean;
  error: string | null;
  live: LiveStatus;
  syncedAt: Date | null;
};

const EMPTY_STORE: Store = { byDay: {}, latestId: null, ready: false, error: null, live: "connecting", syncedAt: null };

/** Fold raw docs ("latest" + dated ids) into one Briefing per calendar day. */
function fold(docs: { id: string; data: Briefing }[]) {
  const byDay: Record<string, Briefing> = {};
  let latest: Briefing | null = null;
  for (const d of docs) {
    if (d.id === "latest") latest = d.data;
    else if (/^\d{4}-\d{2}-\d{2}$/.test(d.id)) byDay[d.id] = d.data;
  }
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
          setStore({ ...EMPTY_STORE, ...base, error: "Couldn't load the briefing (example error: permission-denied)." });
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

    // Live listener: "latest" sorts after the dated ids when descending, so one
    // query returns latest + the most recent days. Updates arrive as the push
    // script writes them; no polling.
    const q = query(collection(briefingDb(), "briefing"), orderBy(documentId(), "desc"), limit(HISTORY_DAYS + 1));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (cancelled) return;
        const { byDay, latestId } = fold(snap.docs.map((d) => ({ id: d.id, data: d.data() as Briefing })));
        setStore({
          byDay,
          latestId,
          ready: true,
          error: null,
          live: snap.metadata.fromCache ? "connecting" : "live",
          syncedAt: new Date(),
        });
      },
      (e) => {
        if (cancelled) return;
        console.error(e);
        const err = e as { code?: string; message?: string };
        setStore((s) => ({
          ...s,
          ready: true,
          live: "offline",
          error: `Couldn't load the briefing (${err.code ?? err.message ?? "unknown error"}).`,
        }));
      }
    );
    return () => {
      cancelled = true;
      unsub();
    };
  }, [enabled]);

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
    empty: store.ready && !store.error && !data,
    example: DEMO,
    live: store.live,
    syncedAt: store.syncedAt,
  };
}
