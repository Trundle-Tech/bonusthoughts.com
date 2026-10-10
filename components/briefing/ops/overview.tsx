"use client";

import * as React from "react";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabelBadge } from "../label-badge";
import { agentColorVar } from "@/lib/briefing/agents";
import { fmtDateTime } from "@/lib/briefing/format";
import { LABEL_KEYS, longDay, shortDay, type FeedEvent, type LabelKey } from "@/lib/briefing/model";
import { go } from "@/lib/briefing/route";
import { cn } from "@/lib/utils";
import { useOps } from "./context";
import { Delta, EmptyState, LABEL_VAR_FALLBACK, Micro, StatusDot, fmtNum } from "./ui";
import { ItemsPerAgentChart, LabelMixDonut, OueTrendChart } from "./charts";
import { ActivityHeatmap, GuardrailGrid } from "./status-grids";
import { FlowDiagram } from "./flow-diagram";

// ---------- tiny sparkline (no chart lib needed at this size) ----------
export function Spark({ values, className }: { values: (number | undefined)[]; className?: string }) {
  const pts = values.map((v, i) => ({ v, i })).filter((p): p is { v: number; i: number } => p.v !== undefined);
  if (pts.length < 2) return <span className="text-muted-foreground text-[10px]">trend needs 2+ days</span>;
  const min = Math.min(...pts.map((p) => p.v));
  const max = Math.max(...pts.map((p) => p.v));
  const W = 80, H = 22;
  const x = (i: number) => (i / Math.max(values.length - 1, 1)) * W;
  const y = (v: number) => (max === min ? H / 2 : H - 2 - ((v - min) / (max - min)) * (H - 4));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-5.5 w-20", className)} aria-hidden>
      <polyline points={pts.map((p) => `${x(p.i)},${y(p.v)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(pts[pts.length - 1].i)} cy={y(pts[pts.length - 1].v)} r="2" fill="currentColor" />
    </svg>
  );
}

function Tile({ label, children, foot, tone, badge, onClick }: { label: string; children: React.ReactNode; foot?: React.ReactNode; tone?: "ok" | "warn" | "bad" | "idle"; badge?: React.ReactNode; onClick?: () => void }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Card className={cn("gap-1.5 py-3", onClick && "hover:bg-accent/40 cursor-pointer text-left transition-colors")}>
      <Comp type={onClick ? "button" : undefined} onClick={onClick} className="contents text-left">
        <CardHeader className="gap-0 px-4">
          <CardDescription className="flex items-center justify-between gap-2">
            <Micro>{label}</Micro>
            {tone && <StatusDot tone={tone} />}
            {badge}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 px-4">
          <div className="text-2xl leading-none font-semibold tabular-nums">{children}</div>
          {foot && <div className="min-h-4 text-[11px]">{foot}</div>}
        </CardContent>
      </Comp>
    </Card>
  );
}

function age(iso: string | undefined, now: number) {
  if (!iso) return null;
  const ms = now - new Date(iso).getTime();
  if (!isFinite(ms) || ms < 0) return null;
  const h = ms / 3_600_000;
  return h < 1 ? `${Math.max(1, Math.round(h * 60))}m` : h < 48 ? `${Math.round(h)}h` : `${Math.round(h / 24)}d`;
}

export function KpiTiles() {
  const { model, example, syncedAt } = useOps();
  // "Now" for age math: the last sync time (re-renders on every live update).
  const [mountedAt] = React.useState(() => Date.now());
  const now = syncedAt?.getTime() ?? mountedAt;
  const b = model.briefing;
  const reporting = model.agents.filter((a) => a.today.reported).length;
  const total = model.totals.items;
  const mix = model.labelMix;
  const sourcedPct = total ? Math.round((mix.sourced / total) * 100) : null;
  const sel = model.selectedDay;
  const gStates = sel ? model.guardrailNames.map((n) => model.guardrails[n]?.[sel]).filter(Boolean) : [];
  const held = gStates.filter((s) => s === "held").length;
  const watch = gStates.filter((s) => s === "watch").length;
  const breach = gStates.filter((s) => s === "breach").length;
  const newCount = model.items.filter((i) => i.isNew).length;
  const oue = b?.oue;
  const lastIsLatest = sel === model.days[model.days.length - 1];
  const ageTxt = lastIsLatest && !example ? age(b?.generated, now) : null;
  const stale = lastIsLatest && !example && b?.generated ? now - new Date(b.generated).getTime() > 36 * 3_600_000 : false;

  const oueTile = (title: string, k: "labor_intensity" | "cost_intensity") => {
    const m = oue?.[k];
    const v = typeof m?.value === "number" ? m.value : m?.value ? Number(m.value) : undefined;
    const unit = m?.unit || (k === "labor_intensity" ? "hours / MW-yr" : "$ / MW-yr");
    return (
      <Tile
        label={title}
        onClick={() => go({ view: "oue" })}
        badge={v !== undefined && isFinite(v) ? <LabelBadge label={m?.label} className="py-0 text-[9px]" /> : undefined}
        foot={
          v !== undefined && isFinite(v) ? (
            <span className="text-muted-foreground">{unit}</span>
          ) : (
            <span className="text-muted-foreground">No OUE read for this day</span>
          )
        }
      >
        {v !== undefined && isFinite(v) ? (unit.startsWith("$") ? "$" : "") + fmtNum(v) : <span className="text-muted-foreground text-lg font-normal">Not reported</span>}
      </Tile>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 2xl:grid-cols-8">
      <Tile
        label="Briefing"
        tone={!b ? "idle" : stale ? "warn" : "ok"}
        foot={<span className="text-muted-foreground">{b ? fmtDateTime(b.generated) : "none loaded"}</span>}
      >
        {ageTxt ? <>{ageTxt}<span className="text-muted-foreground ml-1 text-xs font-normal">old</span></> : sel ? longDay(sel) : "—"}
      </Tile>
      <Tile
        label="Agents reporting"
        tone={reporting === model.agents.length ? "ok" : reporting === 0 ? "bad" : "warn"}
        foot={<span className="text-muted-foreground">{model.agents.length - reporting === 0 ? "all enabled agents" : `${model.agents.length - reporting} with no report`}</span>}
      >
        {reporting}<span className="text-muted-foreground text-base font-normal">/{model.agents.length}</span>
      </Tile>
      <Tile
        label="Items"
        onClick={() => go({ view: "items" })}
        foot={<span className="flex items-center justify-between"><Delta now={total} prev={model.totals.prevItems} /></span>}
      >
        {total}
      </Tile>
      <Tile
        label="New since prior day"
        foot={<span className="text-muted-foreground">{model.prevDay ? `vs ${shortDay(model.prevDay)}` : "needs 2+ days"}</span>}
      >
        {model.prevDay ? newCount : <span className="text-muted-foreground text-lg font-normal">n/a</span>}
      </Tile>
      <Tile
        label="Sourced share"
        foot={<span className="text-muted-foreground tabular-nums">{mix.sourced} sourced · {mix.estimate} est · {mix.inferred} inf{mix.unlabeled ? ` · ${mix.unlabeled} unl` : ""}</span>}
      >
        {sourcedPct === null ? <span className="text-muted-foreground text-lg font-normal">n/a</span> : <>{sourcedPct}<span className="text-muted-foreground text-base font-normal">%</span></>}
      </Tile>
      {oueTile("Labor intensity", "labor_intensity")}
      {oueTile("Cost intensity", "cost_intensity")}
      <Tile
        label="Guardrails"
        tone={breach ? "bad" : watch ? "warn" : gStates.length ? "ok" : "idle"}
        onClick={() => go({ view: "oue" })}
        foot={
          <span className="text-muted-foreground">
            {gStates.length ? `${watch} watch · ${breach} breach · ${model.guardrailNames.length - gStates.length} not reported` : "No OUE read"}
          </span>
        }
      >
        {gStates.length ? <>{held}<span className="text-muted-foreground text-base font-normal">/{model.guardrailNames.length} held</span></> : <span className="text-muted-foreground text-lg font-normal">Not reported</span>}
      </Tile>
    </div>
  );
}

// ---------- agent status board ----------
export function AgentBoard() {
  const { model } = useOps();
  return (
    <section aria-label="Agent status board" className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Agent status board</h2>
        <Micro>{model.agents.length} enabled</Micro>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {model.agents.map((a) => {
          const c = a.today;
          const tone = !c.reported ? "idle" : c.count === 0 ? "warn" : "ok";
          const state = !c.reported ? "No report" : c.count === 0 ? "Reported · 0 items" : "Reported";
          return (
            <Card key={a.def.slug} className="gap-3 py-3">
              <CardHeader className="gap-1 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex size-6 items-center justify-center rounded-md" style={{ background: `color-mix(in oklch, ${agentColorVar(a.index)} 22%, transparent)` }}>
                    <a.def.icon className="size-3.5" />
                  </span>
                  {a.def.name}
                </CardTitle>
                <CardAction>
                  <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide uppercase">
                    <StatusDot tone={tone} pulse={tone === "ok"} /> {state}
                  </span>
                </CardAction>
                <CardDescription className="line-clamp-2 min-h-8 text-xs leading-snug">
                  {c.reported ? c.status || "No status text reported." : "No section for this agent in the selected briefing."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 px-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl leading-none font-semibold tabular-nums">{c.count}</div>
                    <Delta now={a.prev ? c.count : undefined} prev={a.prev?.count} />
                  </div>
                  <span style={{ color: agentColorVar(a.index) }}>
                    <Spark values={a.series.map((s) => (s.reported ? s.count : undefined))} />
                  </span>
                </div>
                <LabelBar labels={c.labels} />
                <Button variant="ghost" size="sm" className="-mx-2 h-7 w-[calc(100%+1rem)] justify-between px-2 text-xs" onClick={() => go({ view: "agent", slug: a.def.slug })}>
                  Open {a.def.name} <ArrowRight />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function LabelBar({ labels }: { labels: Record<LabelKey, number> }) {
  const total = LABEL_KEYS.reduce((s, k) => s + labels[k], 0);
  if (!total) return <div className="bg-muted h-1.5 rounded-full" aria-label="No items" />;
  return (
    <div className="flex h-1.5 gap-px overflow-hidden rounded-full" role="img" aria-label={LABEL_KEYS.filter((k) => labels[k]).map((k) => `${labels[k]} ${k}`).join(", ")}>
      {LABEL_KEYS.filter((k) => labels[k]).map((k) => (
        <div key={k} style={{ flex: labels[k], background: LABEL_VAR_FALLBACK[k] }} title={`${labels[k]} ${k}`} />
      ))}
    </div>
  );
}

// ---------- activity feed ----------
export function ActivityFeed({ className, height = "h-[26rem]", limit = 80 }: { className?: string; height?: string; limit?: number }) {
  const { model, openItem, live, example } = useOps();
  const events: FeedEvent[] = model.feed.slice(0, limit);
  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>Activity · first reported</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">Activity feed</CardTitle>
        <CardAction>
          <Badge variant="outline" className="gap-1.5 text-[10px] uppercase">
            <StatusDot tone={live === "live" ? "ok" : live === "example" ? "info" : "idle"} pulse={live === "live"} />
            {example ? "Example" : live === "live" ? "Live" : live === "offline" ? "Offline" : "Connecting"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {events.length === 0 ? (
          <div className="px-6"><EmptyState title="Nothing yet">No briefings loaded.</EmptyState></div>
        ) : (
          <ScrollArea className={height}>
            <ol className="relative space-y-0.5 px-6 pb-2">
              <span className="bg-border absolute top-1 bottom-1 left-[1.62rem] w-px" aria-hidden />
              {events.map((e) =>
                e.type === "briefing" ? (
                  <li key={e.id} className="relative flex gap-3 py-1.5">
                    <span className="bg-background relative z-10 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border">
                      <FileText className="size-2.5" />
                    </span>
                    <div className="min-w-0 text-xs">
                      <span className="font-medium">Briefing {e.day}</span>
                      <span className="text-muted-foreground"> · generated {fmtDateTime(e.generated)}{e.pushedAt ? ` · uploaded ${fmtDateTime(e.pushedAt)}` : ""}</span>
                    </div>
                  </li>
                ) : (
                  <li key={e.id} className="relative">
                    <button type="button" onClick={() => openItem(e.item)} className="hover:bg-accent/60 relative flex w-full gap-3 rounded-md py-1.5 pr-2 text-left">
                      <span className="bg-background relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border">
                        <span className="size-1.5 rounded-full" style={{ background: agentColorVar(Math.max(0, model.agents.findIndex((a) => a.def.slug === e.item.agentSlug))) }} />
                      </span>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs leading-snug font-medium">{e.item.title}</span>
                          <LabelBadge label={e.item.label} className="py-0 text-[9px]" />
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 text-[11px]">
                          <span>{e.item.agent}</span>
                          <span aria-hidden>·</span>
                          <span className="font-mono">{e.item.date ?? e.day}</span>
                          {e.item.isNew && (
                            <Badge className="ml-0.5 h-4 gap-0.5 px-1 text-[9px]"><Sparkles className="size-2.5" />NEW</Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              )}
            </ol>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- overview page ----------
export function Overview() {
  const { model } = useOps();
  return (
    <div className="space-y-4">
      <KpiTiles />
      <AgentBoard />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <ActivityFeed className="xl:col-span-1" />
        <div className="grid grid-cols-1 content-start gap-3 xl:col-span-2">
          <FlowDiagram />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <ItemsPerAgentChart />
            <LabelMixDonut />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <OueTrendChart kind="labor" />
        <OueTrendChart kind="cost" />
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <ActivityHeatmap />
        <GuardrailGrid />
      </div>
      {model.hiddenSections > 0 && (
        <p className="text-muted-foreground text-[11px]">
          {model.hiddenSections} section{model.hiddenSections === 1 ? "" : "s"} from agents that are not enabled in the dashboard are in this briefing but not shown.
        </p>
      )}
    </div>
  );
}
