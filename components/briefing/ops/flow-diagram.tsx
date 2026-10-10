"use client";

import { ArrowDown, FileText, Gauge, Lightbulb, PenLine, Radio } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { go } from "@/lib/briefing/route";
import { cn } from "@/lib/utils";
import { agentColorVar } from "@/lib/briefing/agents";
import { useOps } from "./context";
import { Micro } from "./ui";

// How the agents feed the briefing. Widths and counts come from the selected
// day's real item counts; nothing here is decorative data.
export function FlowDiagram({ className }: { className?: string }) {
  const { model } = useOps();
  const b = model.briefing;
  const n = model.agents.length;
  const H = Math.max(200, n * 64 + 24);
  const agentY = (i: number) => 24 + i * ((H - 48) / Math.max(n - 1, 1));
  const midY = H / 2;
  const maxCount = Math.max(1, ...model.agents.map((a) => a.today.count));
  const outs = [
    { icon: Gauge, label: "OUE read", value: b?.oue ? "reported" : "not reported", view: "oue" as const },
    { icon: Lightbulb, label: "Discoveries", value: model.discoveriesDerived ? `${model.discoveries.length} (from Research)` : String(model.discoveries.length), view: "discoveries" as const },
    { icon: PenLine, label: "Writing", value: String(b?.writing?.length ?? 0), view: "writing" as const },
  ];
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>Data flow</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">How the agents feed the briefing</CardTitle>
      </CardHeader>
      <CardContent>
        {/* md+ : SVG flow */}
        <div className="hidden md:block">
          <svg viewBox={`0 0 760 ${H}`} className="h-auto w-full" role="img" aria-label="Diagram: each agent's items flow into the daily briefing, which feeds this dashboard">
            {model.agents.map((a, i) => {
              const y = agentY(i);
              const w = 1.5 + (a.today.count / maxCount) * 7;
              return (
                <g key={a.def.slug}>
                  <path d={`M 190 ${y} C 280 ${y}, 270 ${midY}, 340 ${midY}`} fill="none" stroke={agentColorVar(a.index)} strokeWidth={w} strokeLinecap="round" opacity={a.today.reported ? 0.75 : 0.25} strokeDasharray={a.today.reported ? undefined : "4 5"} />
                  <g className="cursor-pointer" onClick={() => go({ view: "agent", slug: a.def.slug })}>
                    <rect x="8" y={y - 20} width="182" height="40" rx="8" className="fill-card stroke-border" />
                    <rect x="8" y={y - 20} width="4" height="40" rx="2" fill={agentColorVar(a.index)} />
                    <text x="24" y={y - 3} className="fill-foreground text-[13px] font-medium">{a.def.name}</text>
                    <text x="24" y={y + 12} className="fill-muted-foreground text-[11px]">
                      {a.today.reported ? `${a.today.count} ${a.today.count === 1 ? "item" : "items"}` : "no report"}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* briefing node */}
            <rect x="340" y={midY - 44} width="150" height="88" rx="10" className="fill-primary" />
            <text x="415" y={midY - 8} textAnchor="middle" className="fill-primary-foreground text-[14px] font-semibold">Daily briefing</text>
            <text x="415" y={midY + 10} textAnchor="middle" className="fill-primary-foreground text-[11px] opacity-80">{model.totals.items} items</text>
            <text x="415" y={midY + 26} textAnchor="middle" className="fill-primary-foreground text-[10px] opacity-70">Firestore · {model.selectedDay ?? "no day"}</text>
            {/* outputs */}
            {outs.map((o, i) => {
              const y = midY + (i - 1) * 62;
              return (
                <g key={o.label} className="cursor-pointer" onClick={() => go({ view: o.view })}>
                  <path d={`M 490 ${midY} C 540 ${midY}, 530 ${y}, 570 ${y}`} fill="none" className="stroke-muted-foreground/50" strokeWidth="1.5" strokeDasharray={o.value === "not reported" ? "4 5" : undefined} />
                  <rect x="570" y={y - 22} width="182" height="44" rx="8" className="fill-card stroke-border" />
                  <text x="586" y={y - 3} className="fill-foreground text-[12px] font-medium">{o.label}</text>
                  <text x="586" y={y + 13} className="fill-muted-foreground text-[11px]">{o.value}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* mobile: stacked */}
        <div className="flex flex-col items-stretch gap-2 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {model.agents.map((a) => (
              <button key={a.def.slug} type="button" onClick={() => go({ view: "agent", slug: a.def.slug })} className={cn("bg-card rounded-lg border p-2 text-left", !a.today.reported && "border-dashed")}>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="size-2 rounded-full" style={{ background: agentColorVar(a.index) }} />
                  {a.def.name}
                </div>
                <div className="text-muted-foreground text-[11px]">{a.today.reported ? `${a.today.count} items` : "no report"}</div>
              </button>
            ))}
          </div>
          <ArrowDown className="text-muted-foreground mx-auto size-4" />
          <div className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-semibold">
            <FileText className="size-4" /> Daily briefing · {model.totals.items} items
          </div>
          <ArrowDown className="text-muted-foreground mx-auto size-4" />
          <div className="grid grid-cols-3 gap-2">
            {outs.map((o) => (
              <button key={o.label} type="button" onClick={() => go({ view: o.view })} className="bg-card rounded-lg border p-2 text-left">
                <div className="flex items-center gap-1 text-xs font-medium"><o.icon className="size-3" />{o.label}</div>
                <div className="text-muted-foreground text-[11px]">{o.value}</div>
              </button>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-[11px]">
          <Radio className="size-3" /> Line width follows each agent&apos;s item count for the selected day. Dashed = no report. Click a node to open it.
        </p>
      </CardContent>
    </Card>
  );
}
