"use client";

import * as React from "react";

// Tiny hash router. The dashboard is a static export served from /briefing/, so
// views live in the URL hash (#/overview, #/agents/research, ...). That keeps
// every view linkable and the browser back button working without extra pages.
export type View =
  | "overview"
  | "oue"
  | "items"
  | "history"
  | "agent"
  | "discoveries"
  | "writing"
  | "library";

export interface Route {
  view: View;
  slug?: string;
}

const VIEWS: View[] = ["overview", "oue", "items", "history", "discoveries", "writing", "library"];

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "agents" && parts[1]) return { view: "agent", slug: parts[1] };
  const v = parts[0] as View;
  return { view: VIEWS.includes(v) ? v : "overview" };
}

export function hrefFor(r: Route): string {
  return r.view === "agent" ? `#/agents/${r.slug}` : `#/${r.view}`;
}

const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export function useRoute(): Route {
  const hash = React.useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  return React.useMemo(() => parseHash(hash), [hash]);
}

export function go(r: Route) {
  window.location.hash = hrefFor(r);
  window.scrollTo({ top: 0 });
}
