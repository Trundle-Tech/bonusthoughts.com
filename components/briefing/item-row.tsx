"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabelBadge } from "./label-badge";
import { isHttpUrl } from "@/lib/briefing/format";
import type { BriefingItem } from "@/lib/briefing/types";

const LONG = 220;

export function ItemRow({ item }: { item: BriefingItem }) {
  const [open, setOpen] = React.useState(false);
  const detail = item.detail ?? "";
  const long = detail.length > LONG;
  return (
    <li className="space-y-1.5 py-3 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm leading-snug font-medium">{item.title || "Untitled"}</h4>
        <LabelBadge label={item.label} />
      </div>
      {detail && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {long && !open ? detail.slice(0, LONG).trimEnd() + "…" : detail}
          {long && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-foreground ml-1 text-xs font-medium underline underline-offset-2"
            >
              {open ? "less" : "more"}
            </button>
          )}
        </p>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px]">
              {t}
            </Badge>
          ))}
        </div>
      )}
      {(item.source || item.date) && (
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] break-all">
          {item.source &&
            (isHttpUrl(item.source) ? (
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-1 underline underline-offset-2"
              >
                {item.source}
                <ExternalLink className="size-3 shrink-0" />
              </a>
            ) : (
              <span>{item.source}</span>
            ))}
          {item.source && item.date && <span aria-hidden>·</span>}
          {item.date && <span>{item.date}</span>}
        </div>
      )}
    </li>
  );
}
