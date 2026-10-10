import * as React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabelKey } from "@/lib/briefing/model";
import type { ChartConfig } from "@/components/ui/chart";

// Same hues as LabelBadge, as chart colors.
export const LABEL_CHART: ChartConfig = {
  sourced: { label: "Sourced", theme: { light: "oklch(0.596 0.145 163.2)", dark: "oklch(0.765 0.177 163.2)" } },
  estimate: { label: "Estimate", theme: { light: "oklch(0.666 0.179 58.3)", dark: "oklch(0.828 0.189 84.4)" } },
  inferred: { label: "Inferred", theme: { light: "oklch(0.541 0.281 293)", dark: "oklch(0.702 0.183 293.5)" } },
  unlabeled: { label: "Unlabeled", theme: { light: "oklch(0.708 0 0)", dark: "oklch(0.556 0 0)" } },
};
export const LABEL_VAR = (l: LabelKey) => `var(--color-${l})`;

/** Tiny uppercase section label used across the ops views. */
export function Micro({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("text-muted-foreground text-[10px] font-medium tracking-[0.12em] uppercase", className)}>
      {children}
    </span>
  );
}

export function StatusDot({ tone, pulse, className }: { tone: "ok" | "warn" | "bad" | "idle" | "info"; pulse?: boolean; className?: string }) {
  const c = {
    ok: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-red-500",
    idle: "bg-muted-foreground/40",
    info: "bg-sky-500",
  }[tone];
  return (
    <span className={cn("relative inline-flex size-2 shrink-0", className)} aria-hidden>
      {pulse && <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden", c)} />}
      <span className={cn("relative inline-flex size-2 rounded-full", c)} />
    </span>
  );
}

/** Change vs. the previous day. Direction only; no good/bad coloring (more items is not "better"). */
export function Delta({ now, prev, unit = "" }: { now?: number; prev?: number; unit?: string }) {
  if (now === undefined || prev === undefined) return <span className="text-muted-foreground text-[11px]">no prior day</span>;
  const d = now - prev;
  const Icon = d === 0 ? ArrowRight : d > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="text-muted-foreground inline-flex items-center gap-0.5 text-[11px] tabular-nums">
      <Icon className="size-3" />
      {d === 0 ? "no change" : `${d > 0 ? "+" : ""}${d}${unit}`} vs prior day
    </span>
  );
}

export function EmptyState({ icon, title, children, className }: { icon?: React.ReactNode; title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-muted-foreground flex min-h-32 flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-4 text-center text-sm", className)}>
      {icon}
      <div className="text-foreground text-sm font-medium">{title}</div>
      {children && <div className="max-w-xs text-xs leading-snug">{children}</div>}
    </div>
  );
}

export const fmtNum = (n: number) => n.toLocaleString("en-US");

/** Plain CSS colors for places where the chart CSS variables are not in scope (e.g. HTML bars). */
export const LABEL_VAR_FALLBACK: Record<LabelKey, string> = {
  sourced: "oklch(0.696 0.17 162.48)",
  estimate: "oklch(0.769 0.188 70.08)",
  inferred: "oklch(0.627 0.265 303.9)",
  unlabeled: "oklch(0.708 0 0 / 0.6)",
};
