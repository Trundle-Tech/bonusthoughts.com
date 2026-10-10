import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemRow } from "./item-row";
import type { BriefingItem } from "@/lib/briefing/types";

export function DiscoveriesFeed({ items, derived }: { items: BriefingItem[]; derived: boolean }) {
  const sorted = [...items].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return (
    <Card id="discoveries" className="scroll-mt-20 gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="size-4" /> Discoveries
        </CardTitle>
        <CardDescription>
          {derived
            ? "This briefing has no discoveries list, so these are the Research items. Newest first."
            : "Chokepoints and pairings from the discovery log, newest first."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm">No discoveries in this briefing. Quiet days get no entry.</p>
        ) : (
          <div className="max-h-[34rem] overflow-y-auto pr-3">
            <ul className="divide-y">
              {sorted.map((it, i) => (
                <ItemRow key={i} item={it} />
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
