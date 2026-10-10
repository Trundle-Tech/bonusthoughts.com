import {
  Bot, Compass, FlaskConical, Hammer, Inbox, Glasses, MessageSquareText, Scale, Ban,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { ItemRow } from "./item-row";
import type { BriefingSection } from "@/lib/briefing/types";

const ICONS: Record<string, LucideIcon> = {
  "Chief of Staff": Compass,
  Research: FlaskConical,
  Builder: Hammer,
  Critic: Scale,
  "Inbox Watch": Inbox,
  "X Desk": MessageSquareText,
  Avoidance: Ban,
  "MR Meta Bot": Glasses,
};

export function agentId(name: string) {
  return "agent-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function AgentCard({
  name,
  section,
  labelFilter,
}: {
  name: string;
  section?: BriefingSection;
  labelFilter: string;
}) {
  const Icon = ICONS[name] ?? Bot;
  const all = section?.items ?? [];
  const items = labelFilter === "all" ? all : all.filter((i) => (i.label ?? "").toLowerCase() === labelFilter);
  return (
    <Card id={agentId(name)} className="scroll-mt-20 gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="bg-muted flex size-7 items-center justify-center rounded-md">
            <Icon className="size-4" />
          </span>
          {name}
        </CardTitle>
        <CardDescription className="leading-snug">
          {section ? section.status || "No status reported." : "No report for this agent in this briefing."}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="tabular-nums">
            {all.length} {all.length === 1 ? "item" : "items"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {all.length === 0 ? "Nothing to report." : `No ${labelFilter} items.`}
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((it, i) => (
              <ItemRow key={i} item={it} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
