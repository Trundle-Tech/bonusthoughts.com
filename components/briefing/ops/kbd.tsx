"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Keyboard hint. Shows ⌘K on Mac, Ctrl K elsewhere (decided after mount to avoid hydration drift). */
export function Kbd({ className }: { className?: string }) {
  const [mac, setMac] = React.useState(false);
  React.useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <kbd className={cn("bg-muted text-muted-foreground pointer-events-none h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium select-none", className ?? "inline-flex")}>
      {mac ? "⌘K" : "Ctrl K"}
    </kbd>
  );
}
