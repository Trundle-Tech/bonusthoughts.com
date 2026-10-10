"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, Label, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { LabelBadge } from "../label-badge";
import { EmptyState, LABEL_CHART, LABEL_VAR, Micro, fmtNum } from "./ui";
import { agentColorVar } from "@/lib/briefing/agents";
import { LABEL_KEYS, shortDay, type LabelKey, type Model } from "@/lib/briefing/model";
import { useOps } from "./context";

// ---- OUE trend (one series per chart; labor and cost are never combined) ----

type Kind = "labor" | "cost";

export function OueTrendChart({ kind, className }: { kind: Kind; className?: string }) {
  const { model } = useOps();
  const title = kind === "labor" ? "Labor intensity (LI)" : "Cost intensity (CI)";
  const unit = model.oueUnits[kind];
  const rows = model.oue.map((p) => ({
    day: p.day,
    value: kind === "labor" ? p.labor : p.cost,
    label: (kind === "labor" ? p.laborLabel : p.costLabel) ?? "unlabeled",
  }));
  const reported = rows.filter((r) => r.value !== undefined);
  const config = { value: { label: title, color: "var(--chart-2)" } } satisfies ChartConfig;
  const cfg: ChartConfig = { ...config, ...LABEL_CHART };
  const prefix = unit.startsWith("$") ? "$" : "";

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription className="flex items-center justify-between">
          <Micro>{title} · {unit}</Micro>
          <Micro>lower is better</Micro>
        </CardDescription>
        <CardTitle className="text-sm font-medium">{kind === "labor" ? "Labor intensity trend" : "Cost intensity trend"}</CardTitle>
      </CardHeader>
      <CardContent>
        {reported.length === 0 ? (
          <EmptyState title="Not reported" className="h-44">
            No {title.toLowerCase()} value in the loaded briefings.
          </EmptyState>
        ) : reported.length === 1 ? (
          <EmptyState title="Trend needs 2 or more days" className="h-44">
            Only one reading so far: <span className="text-foreground font-medium tabular-nums">{prefix}{fmtNum(reported[0].value!)}</span>{" "}
            on {shortDay(reported[0].day)} <LabelBadge label={reported[0].label} className="ml-1" />
          </EmptyState>
        ) : (
          <ChartContainer config={cfg} className="h-44 w-full">
            <LineChart data={rows} margin={{ left: 4, right: 12, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={6} tickFormatter={shortDay} />
              <YAxis
                width={52}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(v: number) => prefix + (v >= 10000 ? `${(v / 1000).toFixed(1)}k` : fmtNum(v))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={(_, p) => (p?.[0]?.payload?.day as string) ?? ""}
                    formatter={(v, _n, item) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="font-mono font-medium tabular-nums">{prefix}{fmtNum(Number(v))}</span>
                        <span className="text-muted-foreground uppercase">{String(item.payload.label)}</span>
                      </div>
                    )}
                  />
                }
              />
              <Line
                dataKey="value"
                type="linear"
                stroke="var(--color-value)"
                strokeWidth={1.75}
                connectNulls={false}
                isAnimationActive={false}
                dot={(p: { cx?: number; cy?: number; payload?: { label: LabelKey; value?: number }; index?: number }) =>
                  p.payload?.value === undefined || p.cx === undefined ? (
                    <g key={p.index} />
                  ) : (
                    <circle key={p.index} cx={p.cx} cy={p.cy} r={4} fill={LABEL_VAR(p.payload.label)} stroke="var(--background)" strokeWidth={1.5} />
                  )
                }
              />
            </LineChart>
          </ChartContainer>
        )}
        <p className="text-muted-foreground mt-2 text-[11px]">Dot color = label on that day&apos;s reading (green sourced, amber estimate, violet inferred).</p>
      </CardContent>
    </Card>
  );
}

// ---- Items per agent (selected day) ----

export function ItemsPerAgentChart({ className }: { className?: string }) {
  const { model } = useOps();
  const data = model.agents.map((a) => ({ agent: a.def.name, slug: a.def.slug, items: a.today.count, fill: agentColorVar(a.index) }));
  const total = data.reduce((s, d) => s + d.items, 0);
  const config: ChartConfig = { items: { label: "Items" } };
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>Volume · {model.selectedDay}</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">Items per agent</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState title="No items reported" className="h-44">None of the enabled agents reported items for this day.</EmptyState>
        ) : (
          <ChartContainer config={config} className="h-44 w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="agent" type="category" tickLine={false} axisLine={false} width={72} />
              <XAxis type="number" allowDecimals={false} hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="items" radius={4} isAnimationActive={false} label={{ position: "right", className: "fill-foreground text-xs tabular-nums" }}>
                {data.map((d) => <Cell key={d.slug} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Label mix donut ----

export function LabelMixDonut({ className, mix, title = "Label mix" }: { className?: string; mix?: Model["labelMix"]; title?: string }) {
  const { model } = useOps();
  const m = mix ?? model.labelMix;
  const data = LABEL_KEYS.map((k) => ({ label: k, value: m[k], fill: LABEL_VAR(k) })).filter((d) => d.value > 0);
  const total = LABEL_KEYS.reduce((s, k) => s + m[k], 0);
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>Evidence quality · {model.selectedDay}</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState title="No labeled items" className="h-44">Nothing to count for this day.</EmptyState>
        ) : (
          <ChartContainer config={LABEL_CHART} className="mx-auto h-44 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={42} outerRadius={64} strokeWidth={2} isAnimationActive={false}>
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox)) return null;
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 4} className="fill-foreground text-xl font-semibold tabular-nums">{total}</tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 12} className="fill-muted-foreground text-[10px]">items</tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="label" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Items per day, stacked by agent (history) ----

export function ItemsPerDayChart({ className }: { className?: string }) {
  const { model } = useOps();
  const config: ChartConfig = Object.fromEntries(
    model.agents.map((a) => [a.def.slug, { label: a.def.name, color: agentColorVar(a.index) }])
  );
  const rows = model.days.map((d) => ({
    day: d,
    ...Object.fromEntries(model.agents.map((a) => [a.def.slug, model.agentDay[a.def.slug][d].count])),
  }));
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>History · {model.days.length} {model.days.length === 1 ? "day" : "days"} loaded</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">Items per day, by agent</CardTitle>
        <CardAction>
          {model.days.length < 2 && <Badge variant="outline" className="border-dashed text-[10px]">1 day so far</Badge>}
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-48 w-full">
          <BarChart data={rows} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={6} tickFormatter={shortDay} />
            <YAxis width={28} allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {model.agents.map((a, i) => (
              <Bar
                key={a.def.slug}
                dataKey={a.def.slug}
                stackId="a"
                fill={`var(--color-${a.def.slug})`}
                radius={i === model.agents.length - 1 ? [3, 3, 0, 0] : 0}
                isAnimationActive={false}
                maxBarSize={36}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ---- Label mix over days, stacked ----

export function LabelsPerDayChart({ className, agentSlug }: { className?: string; agentSlug?: string }) {
  const { model } = useOps();
  const rows = model.days.map((d) => {
    const labels = { sourced: 0, estimate: 0, inferred: 0, unlabeled: 0 } as Record<LabelKey, number>;
    for (const a of model.agents) {
      if (agentSlug && a.def.slug !== agentSlug) continue;
      const x = model.agentDay[a.def.slug][d];
      for (const k of LABEL_KEYS) labels[k] += x.labels[k];
    }
    return { day: d, ...labels };
  });
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardDescription><Micro>History</Micro></CardDescription>
        <CardTitle className="text-sm font-medium">Label mix per day</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={LABEL_CHART} className="h-48 w-full">
          <BarChart data={rows} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={6} tickFormatter={shortDay} />
            <YAxis width={28} allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {LABEL_KEYS.map((k, i) => (
              <Bar key={k} dataKey={k} stackId="l" fill={LABEL_VAR(k)} isAnimationActive={false} maxBarSize={36} radius={i === LABEL_KEYS.length - 1 ? [3, 3, 0, 0] : 0} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
