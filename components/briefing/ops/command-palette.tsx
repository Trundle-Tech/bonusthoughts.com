"use client";

import * as React from "react";
import { Activity, FileText, Gauge, History, LayoutDashboard, Lightbulb, Library, PenLine, Table2 } from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { go, type Route } from "@/lib/briefing/route";
import { useOps } from "./context";

const VIEWS: { title: string; route: Route; icon: typeof Activity; hint: string }[] = [
  { title: "Overview", route: { view: "overview" }, icon: LayoutDashboard, hint: "ops center home" },
  { title: "OUE north star", route: { view: "oue" }, icon: Gauge, hint: "labor cost intensity guardrails" },
  { title: "Items", route: { view: "items" }, icon: Table2, hint: "table filter sort" },
  { title: "History", route: { view: "history" }, icon: History, hint: "timeline heatmap trends" },
  { title: "Discoveries", route: { view: "discoveries" }, icon: Lightbulb, hint: "chokepoints pairings" },
  { title: "Writing", route: { view: "writing" }, icon: PenLine, hint: "drafts outlines" },
  { title: "Fix library", route: { view: "library" }, icon: Library, hint: "reserved" },
];

/** Cmd/Ctrl-K: jump to a view, an agent, or search every item in the selected briefing. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { model, openItem } = useOps();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };
  const all = [...model.items, ...(model.discoveriesDerived ? [] : model.discoveries)];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search" description="Jump to a view or agent, or search items across the briefing.">
      <CommandInput placeholder="Search items, agents, views…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Views">
          {VIEWS.map((v) => (
            <CommandItem key={v.title} value={`view ${v.title} ${v.hint}`} onSelect={() => run(() => go(v.route))}>
              <v.icon /> {v.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Agents">
          {model.agents.map((a) => (
            <CommandItem key={a.def.slug} value={`agent ${a.def.name}`} onSelect={() => run(() => go({ view: "agent", slug: a.def.slug }))}>
              <a.def.icon /> {a.def.name}
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">{a.today.reported ? `${a.today.count} items` : "no report"}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={`Items · ${model.selectedDay ?? ""}`}>
          {all.length === 0 && <div className="text-muted-foreground px-2 py-3 text-xs">No items in this briefing.</div>}
          {all.map((i) => (
            <CommandItem
              key={i.uid}
              value={`item ${i.title} ${i.agent} ${i.label} ${i.tags.join(" ")} ${i.source ?? ""} ${i.detail}`}
              onSelect={() => run(() => openItem(i))}
            >
              <FileText />
              <span className="truncate">{i.title}</span>
              <span className="ml-auto flex shrink-0 items-center gap-1.5">
                <span className="text-muted-foreground text-xs">{i.agent}</span>
                <Badge variant="outline" className="px-1 py-0 text-[9px] uppercase">{i.label}</Badge>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
