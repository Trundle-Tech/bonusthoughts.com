import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  sourced:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
  estimate:
    "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  inferred:
    "border-violet-600/30 bg-violet-500/10 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300",
};

export function LabelBadge({ label, className }: { label?: string; className?: string }) {
  const l = (label ?? "").trim().toLowerCase();
  const known = l in STYLES;
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 uppercase tracking-wide text-[10px]",
        known ? STYLES[l] : "text-muted-foreground border-dashed",
        className
      )}
      title={
        known
          ? { sourced: "Taken from a cited source", estimate: "An estimate; formula/benchmark shown", inferred: "Inferred, not directly sourced" }[l]
          : "No label on this item"
      }
    >
      {known ? l : "unlabeled"}
    </Badge>
  );
}
