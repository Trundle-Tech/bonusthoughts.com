"use client";

import * as React from "react";
import type { Model, Item } from "@/lib/briefing/model";
import type { LiveStatus } from "@/lib/briefing/use-briefing";

export interface OpsCtx {
  model: Model;
  example: boolean;
  live: LiveStatus;
  syncedAt: Date | null;
  openItem: (item: Item) => void;
  openSearch: () => void;
  selectDay: (day: string) => void;
}

const Ctx = React.createContext<OpsCtx | null>(null);

export function OpsProvider({ value, children }: { value: OpsCtx; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOps(): OpsCtx {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useOps must be used inside OpsProvider");
  return v;
}
