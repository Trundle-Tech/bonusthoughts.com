"use client";

import * as React from "react";
import { FlaskConical, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentCard } from "./agent-card";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DiscoveriesFeed } from "./discoveries-feed";
import { DeniedGate, LoadingGate, SignInGate } from "./gate";
import { FixLibrary } from "./fix-library";
import { OueStrip } from "./oue-strip";
import { WritingSection } from "./writing-section";
import { fmtDateTime } from "@/lib/briefing/format";
import { useBriefingData, useSession } from "@/lib/briefing/use-briefing";
import { AGENTS, type Briefing, type BriefingSection } from "@/lib/briefing/types";

export function BriefingApp() {
  const { session, signIn, logOut, retry } = useSession();
  if (session.state === "loading") return <LoadingGate />;
  if (session.state === "signedOut") return <SignInGate onSignIn={signIn} error={session.error} />;
  if (session.state === "denied") return <DeniedGate email={session.email} onRetry={retry} />;
  return <Dashboard email={session.email} name={session.name} photo={session.photo} onSignOut={logOut} />;
}

function matchSections(data: Briefing | null) {
  const sections = data?.sections ?? [];
  const used = new Set<BriefingSection>();
  const ordered = AGENTS.map((name) => {
    const s = sections.find((x) => (x.agent ?? "").trim().toLowerCase() === name.toLowerCase());
    if (s) used.add(s);
    return { name: name as string, section: s };
  });
  // Any agent not in the fixed list still gets a card.
  const extra = sections.filter((s) => !used.has(s)).map((s) => ({ name: s.agent || "Agent", section: s }));
  return [...ordered, ...extra];
}

function Dashboard({
  email, name, photo, onSignOut,
}: { email: string; name?: string | null; photo?: string | null; onSignOut: () => void }) {
  const d = useBriefingData(true);
  const [filter, setFilter] = React.useState("all");
  const cards = React.useMemo(() => matchSections(d.data), [d.data]);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: 0, sourced: 0, estimate: 0, inferred: 0 };
    for (const s of d.data?.sections ?? [])
      for (const i of s.items ?? []) {
        c.all++;
        const l = (i.label ?? "").toLowerCase();
        if (l in c) c[l]++;
      }
    return c;
  }, [d.data]);

  const derivedDiscoveries = !d.data?.discoveries;
  const discoveries =
    d.data?.discoveries ??
    d.data?.sections.find((s) => (s.agent ?? "").toLowerCase() === "research")?.items ??
    [];

  return (
    <TooltipProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader
            generated={d.data ? fmtDateTime(d.data.generated) : ""}
            day={d.shownDay}
            days={d.days}
            selected={d.selected}
            onSelect={d.select}
          />
          <div className="flex flex-1">
            <AppSidebar user={{ name: name || "Signed in", email, avatar: photo }} onSignOut={onSignOut} />
            <SidebarInset>
          <main className="mx-auto w-full max-w-[110rem] flex-1 space-y-8 p-4 md:p-6">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-semibold tracking-tight">Daily briefing</h1>
              <p className="text-muted-foreground text-sm">
                {d.data ? `Generated ${fmtDateTime(d.data.generated)}` : d.loading ? "Loading…" : "No briefing loaded"}
              </p>
            </div>

            {d.example && (
              <Alert className="border-amber-500/40 bg-amber-500/10">
                <FlaskConical className="size-4" />
                <AlertTitle>Example data</AlertTitle>
                <AlertDescription>
                  This build is a local preview. Every number, title and source below is a placeholder, not real briefing data.
                </AlertDescription>
              </Alert>
            )}

            {d.error && (
              <Alert variant="destructive">
                <TriangleAlert className="size-4" />
                <AlertTitle>Couldn&apos;t load</AlertTitle>
                <AlertDescription>{d.error}</AlertDescription>
              </Alert>
            )}

            {d.empty && !d.error && (
              <Alert>
                <AlertTitle>No briefing yet</AlertTitle>
                <AlertDescription>No briefing has been uploaded for this day.</AlertDescription>
              </Alert>
            )}

            {d.loading && !d.data ? (
              <DashboardSkeleton />
            ) : d.data ? (
              <div className={d.loading ? "space-y-8 opacity-60 transition-opacity" : "space-y-8"}>
                <OueStrip oue={d.data.oue} example={d.example && !!d.data.oue} />

                <section id="agents" className="scroll-mt-20 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">Agents</h2>
                      <p className="text-muted-foreground text-sm">
                        What each agent reported. Labels show how each item is backed.
                      </p>
                    </div>
                    <Tabs value={filter} onValueChange={setFilter}>
                      <TabsList>
                        {(["all", "sourced", "estimate", "inferred"] as const).map((k) => (
                          <TabsTrigger key={k} value={k} className="gap-1.5 capitalize">
                            {k}
                            <Badge variant="secondary" className="px-1.5 text-[10px] tabular-nums">
                              {counts[k]}
                            </Badge>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {cards.map((c) => (
                      <AgentCard key={c.name} name={c.name} section={c.section} labelFilter={filter} />
                    ))}
                  </div>
                </section>

                <div className="grid items-start gap-4 xl:grid-cols-2">
                  <DiscoveriesFeed items={discoveries} derived={derivedDiscoveries} />
                  <WritingSection drafts={d.data.writing ?? []} />
                </div>

                <FixLibrary />

                <footer className="text-muted-foreground pb-2 text-xs">
                  Briefing {d.shownDay ?? d.selected}
                  {d.data.pushedAt ? ` · uploaded ${fmtDateTime(d.data.pushedAt)}` : ""}
                  {" · times in America/Chicago"}
                </footer>
              </div>
            ) : null}
          </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
