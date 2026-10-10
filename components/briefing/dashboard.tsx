"use client";

import * as React from "react";
import { FlaskConical, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DeniedGate, LoadingGate, SignInGate } from "./gate";
import { CommandPalette } from "./ops/command-palette";
import { OpsProvider } from "./ops/context";
import { ItemSheet } from "./ops/item-sheet";
import { Overview } from "./ops/overview";
import {
  AgentView, DiscoveriesView, HistoryView, ItemsView, LibraryView, OueView, WritingView,
} from "./ops/views";
import { fmtDateTime } from "@/lib/briefing/format";
import { buildModel, type Item } from "@/lib/briefing/model";
import { agentBySlug } from "@/lib/briefing/agents";
import { useRoute, type Route } from "@/lib/briefing/route";
import { useBriefingData, useSession } from "@/lib/briefing/use-briefing";

export function BriefingApp() {
  const { session, signIn, logOut, retry } = useSession();
  if (session.state === "loading") return <LoadingGate />;
  if (session.state === "signedOut") return <SignInGate onSignIn={signIn} error={session.error} />;
  if (session.state === "denied") return <DeniedGate email={session.email} onRetry={retry} />;
  return <Dashboard email={session.email} name={session.name} photo={session.photo} onSignOut={logOut} />;
}

function routeTitle(r: Route): string {
  switch (r.view) {
    case "overview": return "Operations center";
    case "oue": return "OUE north star";
    case "items": return "Items";
    case "history": return "History";
    case "agent": return agentBySlug(r.slug)?.name ?? "Agent";
    case "discoveries": return "Discoveries";
    case "writing": return "Writing";
    case "library": return "Fix library";
  }
}

function Dashboard({
  email, name, photo, onSignOut,
}: { email: string; name?: string | null; photo?: string | null; onSignOut: () => void }) {
  const d = useBriefingData(true);
  const route = useRoute();
  const [item, setItem] = React.useState<Item | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const model = React.useMemo(() => buildModel(d.byDay, d.shownDay), [d.byDay, d.shownDay]);
  const newest = model.days[model.days.length - 1];
  const { select } = d;
  const selectDay = React.useCallback((day: string) => select(day === newest ? "latest" : day), [select, newest]);

  const ctx = React.useMemo(
    () => ({
      model,
      example: d.example,
      live: d.live,
      syncedAt: d.syncedAt,
      openItem: setItem,
      openSearch: () => setSearchOpen(true),
      selectDay,
    }),
    [model, d.example, d.live, d.syncedAt, selectDay]
  );

  const view = (() => {
    switch (route.view) {
      case "overview": return <Overview />;
      case "oue": return <OueView />;
      case "items": return <ItemsView />;
      case "history": return <HistoryView />;
      case "agent": return <AgentView slug={route.slug} />;
      case "discoveries": return <DiscoveriesView />;
      case "writing": return <WritingView />;
      case "library": return <LibraryView />;
    }
  })();

  return (
    <TooltipProvider>
      <OpsProvider value={ctx}>
        <div className="[--header-height:calc(--spacing(14))]">
          <SidebarProvider className="flex flex-col">
            <SiteHeader
              title={`${routeTitle(route)}${d.data ? ` · generated ${fmtDateTime(d.data.generated)}` : ""}`}
              day={d.shownDay}
              days={d.days}
              selected={d.selected}
              onSelect={d.select}
            />
            <div className="flex flex-1">
              <AppSidebar user={{ name: name || "Signed in", email, avatar: photo }} onSignOut={onSignOut} route={route} />
              <SidebarInset>
                <main className="mx-auto w-full max-w-[110rem] flex-1 space-y-4 p-3 md:p-5">
                  {route.view === "overview" && (
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold tracking-tight">Operations center</h1>
                        <p className="text-muted-foreground text-xs">
                          {d.data ? `Briefing ${d.shownDay} · generated ${fmtDateTime(d.data.generated)}` : d.loading ? "Loading…" : "No briefing loaded"}
                        </p>
                      </div>
                    </div>
                  )}

                  {process.env.NEXT_PUBLIC_BRIEFING_DEMO === "1" && (
                    <Alert className="border-amber-500/40 bg-amber-500/10 py-2">
                      <FlaskConical className="size-4" />
                      <AlertTitle>[Example] data</AlertTitle>
                      <AlertDescription>
                        Local preview build. Every number, title and source is a placeholder, not real briefing data, and nothing here is live.
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

                  {d.loading && !d.data ? <DashboardSkeleton /> : d.data ? view : null}

                  {d.data && (
                    <footer className="text-muted-foreground pb-2 text-[11px]">
                      Briefing {d.shownDay ?? d.selected}
                      {d.data.pushedAt ? ` · uploaded ${fmtDateTime(d.data.pushedAt)}` : ""}
                      {" · times in America/Chicago"}
                    </footer>
                  )}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
        <ItemSheet item={item} onClose={() => setItem(null)} />
        <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      </OpsProvider>
    </TooltipProvider>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 2xl:grid-cols-8">
        {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl xl:col-span-2" />
      </div>
    </div>
  );
}
