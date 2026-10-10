"use client";

import * as React from "react";
import { CircleHelp, ShieldCheck, ShieldX, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { shortDay } from "@/lib/briefing/model";
import type { GuardrailStatus } from "@/lib/briefing/types";
import { go } from "@/lib/briefing/route";
import { useOps } from "./context";
import { EmptyState, Micro } from "./ui";

// ---- Agent x day activity heatmap ----

const STEPS = [
  "bg-primary/15 text-foreground",
  "bg-primary/30 text-foreground",
  "bg-primary/50 text-foreground",
  "bg-primary/75 text-primary-foreground",
  "bg-primary text-primary-foreground",
];

function stepFor(count: number, max: number) {
  if (count <= 0) return "bg-muted text-muted-foreground";
  return STEPS[Math.min(STEPS.length - 1, Math.ceil((count / Math.max(max, 1)) * STEPS.length) - 1)];
}

export function ActivityHeatmap({ className, maxDays = 30 }: { className?: string; maxDays?: number }) {
  const { model, selectDay } = useOps();
  const days = model.days.slice(-maxDays);
  const max = Math.max(0, ...model.agents.flatMap((a) => days.map((d) => model.agentDay[a.def.slug][d].count)));
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>Status timeline · {days.length} {days.length === 1 ? "day" : "days"}</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">Agent activity by day</CardTitle>
        <CardAction>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
            <span className="bg-muted inline-block size-3 rounded-[3px]" /> reported, 0 items
            <span className="inline-block size-3 rounded-[3px] border border-dashed" /> no report
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {days.length === 0 ? (
          <EmptyState title="No days loaded" />
        ) : (
          <div className="max-w-full overflow-x-auto">
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `minmax(5.5rem,auto) repeat(${days.length}, minmax(1.75rem,3.5rem))` }}>
              <div />
              {days.map((d) => (
                <div key={d} className={cn("text-muted-foreground text-center font-mono text-[10px]", d === model.selectedDay && "text-foreground font-semibold")}>
                  {shortDay(d)}
                </div>
              ))}
              {model.agents.map((a) => (
                <React.Fragment key={a.def.slug}>
                  <button
                    type="button"
                    onClick={() => go({ view: "agent", slug: a.def.slug })}
                    className="hover:text-foreground flex items-center gap-1.5 truncate pr-2 text-left text-xs font-medium"
                  >
                    <a.def.icon className="text-muted-foreground size-3.5 shrink-0" />
                    <span className="truncate">{a.def.name}</span>
                  </button>
                  {days.map((d) => {
                    const c = model.agentDay[a.def.slug][d];
                    return (
                      <Tooltip key={d}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`${a.def.name} ${d}: ${c.reported ? `${c.count} items` : "no report"}`}
                            onClick={() => selectDay(d)}
                            className={cn(
                              "h-7 rounded-[4px] text-[10px] font-medium tabular-nums transition-[outline] hover:outline-2 hover:outline-offset-1 hover:outline-ring",
                              c.reported ? stepFor(c.count, max) : "border border-dashed bg-transparent",
                              !c.reported && "text-muted-foreground",
                              d === model.selectedDay && "ring-foreground/60 ring-1 ring-offset-1 ring-offset-background"
                            )}
                          >
                            {c.reported ? c.count : ""}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="font-medium">{a.def.name} · {d}</div>
                          <div>{c.reported ? `${c.count} ${c.count === 1 ? "item" : "items"}` : "No report for this day"}</div>
                          {c.status && <div className="max-w-56 opacity-80">{c.status}</div>}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        {days.length === 1 && <p className="text-muted-foreground mt-2 text-[11px]">One day loaded. The timeline fills in as more days are uploaded.</p>}
      </CardContent>
    </Card>
  );
}

// ---- Guardrail status grid ----

const G: Record<GuardrailStatus, { icon: typeof ShieldCheck; cell: string; text: string; tone: string }> = {
  held: { icon: ShieldCheck, cell: "bg-emerald-500/80", text: "Held", tone: "text-emerald-700 dark:text-emerald-300 border-emerald-600/30 bg-emerald-600/10" },
  watch: { icon: TriangleAlert, cell: "bg-amber-500/80", text: "Watch", tone: "text-amber-700 dark:text-amber-300 border-amber-600/30 bg-amber-500/10" },
  breach: { icon: ShieldX, cell: "bg-red-500/80", text: "Breach", tone: "text-red-700 dark:text-red-300 border-red-600/30 bg-red-500/10" },
  not_reported: { icon: CircleHelp, cell: "border border-dashed bg-transparent", text: "Not reported", tone: "text-muted-foreground border-dashed" },
};

export function GuardrailGrid({ className, maxDays = 7 }: { className?: string; maxDays?: number }) {
  const { model } = useOps();
  const days = model.days.slice(-maxDays);
  const sel = model.selectedDay;
  const reportedToday = model.guardrailNames.filter((n) => sel && model.guardrails[n]?.[sel]).length;
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>OUE guardrails · all must hold</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">Guardrail status</CardTitle>
        <CardAction>
          <Badge variant="outline" className="text-[10px] tabular-nums">{reportedToday}/{model.guardrailNames.length} reported</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {model.guardrailNames.map((n) => {
          const cur = (sel && model.guardrails[n]?.[sel]) || "not_reported";
          const s = G[cur] ?? G.not_reported;
          const Icon = s.icon;
          return (
            <div key={n} className="flex items-center gap-2">
              <Badge variant="outline" className={cn("w-40 shrink-0 justify-start gap-1.5 py-0.5 text-[11px] font-normal", s.tone)}>
                <Icon className="size-3 shrink-0" />
                <span className="truncate">{n}</span>
              </Badge>
              <span className={cn("w-20 shrink-0 text-[10px] font-medium whitespace-nowrap uppercase", s.tone.split(" ").slice(0, 2).join(" "))}>{s.text}</span>
              <div className="flex flex-1 justify-end gap-1">
                {days.map((d) => {
                  const st = model.guardrails[n]?.[d];
                  return (
                    <Tooltip key={d}>
                      <TooltipTrigger asChild>
                        <span
                          className={cn("h-4 w-full max-w-5 min-w-2 rounded-[3px]", st ? G[st]?.cell ?? G.not_reported.cell : "border border-dashed bg-transparent opacity-60", d === sel && "ring-foreground/60 ring-1 ring-offset-1 ring-offset-background")}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{d}: {st ? G[st]?.text ?? st : "no OUE read"}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
        <p className="text-muted-foreground pt-1 text-[11px]">
          Strips show the last {days.length} {days.length === 1 ? "day" : "days"}, oldest to newest. Dashed = no read that day.
        </p>
      </CardContent>
    </Card>
  );
}
