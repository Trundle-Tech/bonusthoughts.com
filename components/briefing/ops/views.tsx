"use client";

import * as React from "react";
import { ArrowLeft, Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agentBySlug, agentColorVar } from "@/lib/briefing/agents";
import { go } from "@/lib/briefing/route";
import { DiscoveriesFeed } from "../discoveries-feed";
import { FixLibrary } from "../fix-library";
import { OueStrip } from "../oue-strip";
import { WritingSection } from "../writing-section";
import { useOps } from "./context";
import { ItemsTable } from "./items-table";
import { ItemsPerDayChart, LabelMixDonut, LabelsPerDayChart, OueTrendChart } from "./charts";
import { ActivityHeatmap, GuardrailGrid } from "./status-grids";
import { ActivityFeed, LabelBar, Spark } from "./overview";
import { Delta, EmptyState, Micro, StatusDot } from "./ui";
import { LABEL_KEYS, type Model } from "@/lib/briefing/model";

export function PageTitle({ title, sub, back }: { title: React.ReactNode; sub?: React.ReactNode; back?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {back && (
        <Button variant="outline" size="icon-sm" aria-label="Back to overview" onClick={() => go({ view: "overview" })}>
          <ArrowLeft />
        </Button>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-lg leading-tight font-semibold tracking-tight">{title}</h1>
        {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      </div>
    </div>
  );
}

// ---------- OUE north star: strip + trends + guardrail history ----------
export function OueView() {
  const { model, example } = useOps();
  return (
    <div className="space-y-4">
      <OueStrip oue={model.briefing?.oue} example={example && !!model.briefing?.oue} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <OueTrendChart kind="labor" />
        <OueTrendChart kind="cost" />
      </div>
      <GuardrailGrid maxDays={30} />
    </div>
  );
}

// ---------- items table ----------
export function ItemsView() {
  const { model } = useOps();
  return (
    <div className="space-y-4">
      <PageTitle title="Items" sub={`Everything the enabled agents reported on ${model.selectedDay ?? "the selected day"}. Click a row for source, date, label and history.`} />
      <ItemsTable items={model.items} />
    </div>
  );
}

// ---------- history ----------
export function HistoryView() {
  const { model } = useOps();
  return (
    <div className="space-y-4">
      <PageTitle title="History" sub={`${model.days.length} ${model.days.length === 1 ? "day" : "days"} loaded (up to the latest 30).`} />
      <ActivityHeatmap />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ItemsPerDayChart />
        <LabelsPerDayChart />
      </div>
      <ActivityFeed height="h-[30rem]" limit={200} />
    </div>
  );
}

// ---------- agent drill-down ----------
export function AgentView({ slug }: { slug?: string }) {
  const { model } = useOps();
  const def = agentBySlug(slug);
  const row = model.agents.find((a) => a.def.slug === slug);
  if (!def || !row) {
    return (
      <div className="space-y-4">
        <PageTitle back title="Agent not available" />
        <EmptyState title="That agent isn't enabled in the dashboard">Agents are switched on in lib/briefing/agents.ts.</EmptyState>
      </div>
    );
  }
  const c = row.today;
  const reportedDays = row.series.filter((s) => s.reported).length;
  const mix: Model["labelMix"] = { ...c.labels };
  const log = [...model.days].reverse().map((d) => ({ day: d, ...model.agentDay[def.slug][d] }));
  const tone = !c.reported ? "idle" : c.count === 0 ? "warn" : "ok";
  return (
    <div className="space-y-4">
      <PageTitle
        back
        title={
          <span className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md" style={{ background: `color-mix(in oklch, ${agentColorVar(row.index)} 22%, transparent)` }}>
              <def.icon className="size-4" />
            </span>
            {def.name}
          </span>
        }
        sub={c.reported ? c.status || "No status text reported." : "No section for this agent in the selected briefing."}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="gap-1.5 py-3"><CardHeader className="gap-0 px-4"><Micro>Status</Micro></CardHeader>
          <CardContent className="px-4"><div className="flex items-center gap-2 text-sm font-medium"><StatusDot tone={tone} pulse={tone === "ok"} />{!c.reported ? "No report" : c.count === 0 ? "Reported · 0 items" : "Reported"}</div></CardContent></Card>
        <Card className="gap-1.5 py-3"><CardHeader className="gap-0 px-4"><Micro>Items · {model.selectedDay}</Micro></CardHeader>
          <CardContent className="space-y-1 px-4"><div className="text-2xl leading-none font-semibold tabular-nums">{c.count}</div><Delta now={row.prev ? c.count : undefined} prev={row.prev?.count} /></CardContent></Card>
        <Card className="gap-1.5 py-3"><CardHeader className="gap-0 px-4"><Micro>Days reported</Micro></CardHeader>
          <CardContent className="space-y-1 px-4"><div className="text-2xl leading-none font-semibold tabular-nums">{reportedDays}<span className="text-muted-foreground text-base font-normal">/{model.days.length}</span></div><span style={{ color: agentColorVar(row.index) }}><Spark values={row.series.map((s) => (s.reported ? s.count : undefined))} /></span></CardContent></Card>
        <Card className="gap-1.5 py-3"><CardHeader className="gap-0 px-4"><Micro>Label mix</Micro></CardHeader>
          <CardContent className="space-y-1.5 px-4"><LabelBar labels={c.labels} /><div className="text-muted-foreground text-[11px] tabular-nums">{LABEL_KEYS.filter((k) => c.labels[k]).map((k) => `${c.labels[k]} ${k}`).join(" · ") || "no items"}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items <Badge variant="secondary" className="px-1.5 text-[10px] tabular-nums">{row.items.length}</Badge></TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="log">Status log</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="mt-3"><ItemsTable items={row.items} fixedAgent={def.slug} /></TabsContent>
        <TabsContent value="history" className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <LabelsPerDayChart agentSlug={def.slug} className="lg:col-span-2" />
          <LabelMixDonut mix={mix} title={`${def.name} label mix`} />
        </TabsContent>
        <TabsContent value="log" className="mt-3">
          <Card className="gap-2 py-3">
            <CardHeader className="px-4"><CardTitle className="text-sm">Status as reported, by day</CardTitle><CardDescription className="text-xs">The agent&apos;s own status line from each briefing.</CardDescription></CardHeader>
            <CardContent className="px-4">
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Day</TableHead><TableHead>State</TableHead><TableHead className="text-right">Items</TableHead><TableHead>Status line</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {log.map((r) => (
                      <TableRow key={r.day}>
                        <TableCell className="font-mono text-xs">{r.day}</TableCell>
                        <TableCell className="text-xs">{r.reported ? "Reported" : <span className="text-muted-foreground">No report</span>}</TableCell>
                        <TableCell className="text-right text-xs tabular-nums">{r.reported ? r.count : "—"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{r.status || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- library views (existing components, reused) ----------
export function DiscoveriesView() {
  const { model } = useOps();
  return (
    <div className="space-y-4">
      <PageTitle title="Discoveries" />
      <DiscoveriesFeed items={model.discoveries.map(toBriefingItem)} derived={model.discoveriesDerived} />
    </div>
  );
}

function toBriefingItem(i: import("@/lib/briefing/model").Item) {
  return { title: i.title, detail: i.detail, source: i.source, date: i.date, label: i.label === "unlabeled" ? undefined : i.label, tags: i.tags };
}

export function WritingView() {
  const { model } = useOps();
  return (
    <div className="space-y-4">
      <PageTitle title="Writing" />
      <WritingSection drafts={model.briefing?.writing ?? []} />
    </div>
  );
}

export function LibraryView() {
  return (
    <div className="space-y-4">
      <PageTitle title={<span className="flex items-center gap-2"><Library className="size-4" />Fix library</span>} />
      <FixLibrary />
    </div>
  );
}
