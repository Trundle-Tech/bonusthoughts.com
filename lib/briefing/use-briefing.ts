"use client";

import * as React from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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

export type DataState = {
  /** Dated doc ids (YYYY-MM-DD), newest first. */
  days: string[];
  /** "latest" or a dated doc id. */
  selected: string;
  select: (id: string) => void;
  data: Briefing | null;
  /** Dated id the shown doc corresponds to (for the calendar). */
  shownDay: string | null;
  loading: boolean;
  error: string | null;
  empty: boolean;
  example: boolean;
};

export function useBriefingData(enabled: boolean): DataState {
  const [days, setDays] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState("latest");
  const [data, setData] = React.useState<Briefing | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [empty, setEmpty] = React.useState(false);

  // Day list.
  React.useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      if (DEMO) {
        const { DEMO_DAYS } = await import("./demo-data");
        if (!cancelled) setDays(Object.keys(DEMO_DAYS).sort().reverse());
        return;
      }
      try {
        const snaps = await getDocs(collection(briefingDb(), "briefing"));
        const ids = snaps.docs
          .map((d) => d.id)
          .filter((i) => /^\d{4}-\d{2}-\d{2}$/.test(i))
          .sort()
          .reverse();
        if (!cancelled) setDays(ids);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Selected doc.
  React.useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEmpty(false);
    (async () => {
      try {
        if (DEMO) {
          const { DEMO_DAYS, DEMO_LATEST, DEMO_SPARSE } = await import("./demo-data");
          const mode = demoMode();
          await new Promise((r) => setTimeout(r, mode === "loading" ? 60_000 : 250));
          if (cancelled) return;
          if (mode === "empty") setEmpty(true);
          else if (mode === "error") setError("Couldn't load the briefing (example error: permission-denied).");
          else if (mode === "sparse") setData(DEMO_SPARSE);
          else setData(DEMO_DAYS[selected === "latest" ? DEMO_LATEST : selected] ?? null);
          return;
        }
        const snap = await getDoc(doc(briefingDb(), "briefing", selected));
        if (cancelled) return;
        if (!snap.exists()) {
          setData(null);
          setEmpty(true);
        } else {
          setData(snap.data() as Briefing);
        }
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        const err = e as { code?: string; message?: string };
        setError(`Couldn't load the briefing (${err.code ?? err.message ?? "unknown error"}).`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, selected]);

  const shownDay = data ? (selected === "latest" ? dateIdChicago(data.generated) : selected) : null;

  return {
    days,
    selected,
    select: setSelected,
    data,
    shownDay,
    loading,
    error,
    empty,
    example: DEMO,
  };
}
