"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LabelBadge } from "../label-badge";
import { isHttpUrl } from "@/lib/briefing/format";
import type { Item } from "@/lib/briefing/model";
import { go } from "@/lib/briefing/route";
import { Micro } from "./ui";
import { useOps } from "./context";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <Micro>{label}</Micro>
      <div className="text-sm break-words">{children}</div>
    </div>
  );
}

/** Item drill-down: source, date, label, and every day the item was reported. */
export function ItemSheet({ item, onClose }: { item: Item | null; onClose: () => void }) {
  const { model, selectDay } = useOps();
  const hist = item ? [...item.history].reverse() : [];
  return (
    <Sheet open={!!item} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        {item && (
          <>
            <SheetHeader className="space-y-2 pr-10">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] uppercase">{item.kind === "discovery" ? "Discovery" : item.agent}</Badge>
                <LabelBadge label={item.label === "unlabeled" ? undefined : item.label} />
                {item.isNew && <Badge className="h-4 gap-0.5 px-1 text-[9px]"><Sparkles className="size-2.5" />NEW</Badge>}
              </div>
              <SheetTitle className="text-base leading-snug">{item.title}</SheetTitle>
              <SheetDescription className="font-mono text-[11px]">Briefing {item.day}</SheetDescription>
            </SheetHeader>
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 px-4 pb-6">
                {item.detail ? (
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.detail}</p>
                ) : (
                  <p className="text-muted-foreground text-sm">No detail text in this briefing.</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Source">
                    {item.source ? (
                      isHttpUrl(item.source) ? (
                        <a href={item.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-mono text-xs break-all underline underline-offset-2">
                          {item.source}<ExternalLink className="mt-0.5 size-3 shrink-0" />
                        </a>
                      ) : <span className="font-mono text-xs break-all">{item.source}</span>
                    ) : <span className="text-muted-foreground">No source given</span>}
                  </Field>
                  <Field label="Item date">{item.date ? <span className="font-mono text-xs">{item.date}</span> : <span className="text-muted-foreground">Not given</span>}</Field>
                  <Field label="First reported"><span className="font-mono text-xs">{item.firstSeen}</span></Field>
                  <Field label="Reported on"><span className="tabular-nums">{item.history.length} of {model.days.length} loaded {model.days.length === 1 ? "day" : "days"}</span></Field>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">{item.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Micro>History</Micro>
                    {item.labelChanged && <Badge variant="outline" className="text-[10px]">label changed</Badge>}
                  </div>
                  <ol className="relative space-y-3 border-l pl-4">
                    {hist.map((h, i) => {
                      const older = hist[i + 1];
                      const changed = older && older.label !== h.label;
                      const detailChanged = older && (older.detail ?? "") !== (h.detail ?? "");
                      return (
                        <li key={h.day} className="relative">
                          <span className="bg-background absolute top-1 -left-[1.3rem] size-2.5 rounded-full border-2 border-foreground/60" />
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <button type="button" className="font-mono font-medium underline-offset-2 hover:underline" onClick={() => { selectDay(h.day); onClose(); }}>{h.day}</button>
                            <LabelBadge label={h.label === "unlabeled" ? undefined : h.label} className="py-0 text-[9px]" />
                            {changed && <span className="text-muted-foreground">was {older.label}</span>}
                            {detailChanged && <span className="text-muted-foreground">detail edited</span>}
                            {!older && <span className="text-muted-foreground">first seen</span>}
                          </div>
                          {(h.date || h.source) && <div className="text-muted-foreground mt-0.5 font-mono text-[11px] break-all">{[h.date, h.source].filter(Boolean).join(" · ")}</div>}
                        </li>
                      );
                    })}
                  </ol>
                  {model.days.length < 2 && <p className="text-muted-foreground text-[11px]">Only one day is loaded, so there is no history yet.</p>}
                </div>
                {item.kind === "report" && (
                  <Button variant="outline" size="sm" onClick={() => { go({ view: "agent", slug: item.agentSlug }); onClose(); }}>
                    Open {item.agent}
                  </Button>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
