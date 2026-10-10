import { ArrowDownRight, ArrowRight, ArrowUpRight, ShieldCheck, TriangleAlert, CircleHelp, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelBadge } from "./label-badge";
import { cn } from "@/lib/utils";
import {
  GUARDRAIL_NAMES, MEASUREMENT_LEVELS,
  type GuardrailStatus, type Oue, type OueMetric,
} from "@/lib/briefing/types";

const FLAT_BAND = 2; // paper rule: moves under about 2% count as flat

function fmtValue(v: OueMetric["value"], unit?: string) {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v.toLocaleString("en-US") : String(v);
  return (unit ?? "").startsWith("$") ? "$" + n : n;
}

function Direction({ pct }: { pct?: number | null }) {
  if (pct === null || pct === undefined) return null;
  const flat = Math.abs(pct) < FLAT_BAND;
  const Icon = flat ? ArrowRight : pct < 0 ? ArrowDownRight : ArrowUpRight;
  // Lower is better for both measures (target is lower-left).
  const tone = flat ? "text-muted-foreground" : pct < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", tone)}>
      <Icon className="size-3.5" />
      {flat ? "Flat" : `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`}
      <span className="text-muted-foreground font-normal">
        {flat ? `(within ±${FLAT_BAND}%)` : "vs previous read"}
      </span>
    </span>
  );
}

function MetricCard({ title, caption, metric, defaultUnit }: { title: string; caption: string; metric?: OueMetric; defaultUnit: string }) {
  const unit = metric?.unit || defaultUnit;
  const value = fmtValue(metric?.value, unit);
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardDescription className="flex items-center justify-between gap-2">
          <span className="font-medium">{title}</span>
          {value && <LabelBadge label={metric?.label} />}
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {value ?? <span className="text-muted-foreground text-xl font-normal">Not reported</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="text-muted-foreground text-xs">{value ? unit : caption}</div>
        {value && <Direction pct={metric?.delta_pct} />}
        {metric?.note && <p className="text-muted-foreground text-xs leading-snug">{metric.note}</p>}
      </CardContent>
    </Card>
  );
}

const G_STYLE: Record<GuardrailStatus, { icon: typeof ShieldCheck; cls: string; text: string }> = {
  held: { icon: ShieldCheck, cls: "text-emerald-700 dark:text-emerald-300 border-emerald-600/30 bg-emerald-600/10", text: "Held" },
  watch: { icon: TriangleAlert, cls: "text-amber-700 dark:text-amber-300 border-amber-600/30 bg-amber-500/10", text: "Watch" },
  breach: { icon: ShieldX, cls: "text-red-700 dark:text-red-300 border-red-600/30 bg-red-500/10", text: "Breach" },
  not_reported: { icon: CircleHelp, cls: "text-muted-foreground border-dashed", text: "Not reported" },
};

function Guardrails({ oue }: { oue?: Oue }) {
  const reported = new Map((oue?.guardrails ?? []).map((g) => [g.name.toLowerCase(), g]));
  // Always list the six named guardrails; add any extra ones that were reported.
  const names = [
    ...GUARDRAIL_NAMES.map((n) => n as string),
    ...(oue?.guardrails ?? []).map((g) => g.name).filter((n) => !GUARDRAIL_NAMES.some((g) => g.toLowerCase() === n.toLowerCase())),
  ];
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardDescription className="font-medium">Guardrails</CardDescription>
        <CardTitle className="text-sm font-normal text-muted-foreground">
          Any claimed improvement is read with these held.
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {names.map((n) => {
          const g = reported.get(n.toLowerCase());
          const s = G_STYLE[g?.status ?? "not_reported"] ?? G_STYLE.not_reported;
          const Icon = s.icon;
          return (
            <Badge key={n} variant="outline" className={cn("w-full justify-start gap-1.5 py-1 font-normal", s.cls)} title={g?.note ?? s.text}>
              <Icon className="size-3.5 shrink-0" />
              <span className="truncate">{n}</span>
              <span className="ml-auto pl-1 text-[10px] font-medium uppercase">{s.text}</span>
            </Badge>
          );
        })}
      </CardContent>
    </Card>
  );
}

function Level({ level }: { level?: 1 | 2 | 3 }) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardDescription className="font-medium">Measurement level</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {level ? `Level ${level}` : <span className="text-muted-foreground text-xl font-normal">Not reported</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-1.5" role="img" aria-label={level ? `Measurement level ${level} of 3` : "Measurement level not reported"}>
          {MEASUREMENT_LEVELS.map((m) => (
            <div key={m.level} className="flex-1 space-y-1">
              <div className={cn("h-1.5 rounded-full", level && m.level <= level ? "bg-primary" : "bg-muted")} />
              <div className={cn("text-[11px]", level === m.level ? "text-foreground font-medium" : "text-muted-foreground")}>
                {m.level} {m.name}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OueStrip({ oue, example }: { oue?: Oue; example?: boolean }) {
  return (
    <section id="oue" className="scroll-mt-20 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">OUE north star</h2>
          <p className="text-muted-foreground text-sm">
            Operations Usage Effectiveness. Labor and cost intensity are shown side by side and never blended. Target: lower left, guardrails held.
          </p>
        </div>
        {!oue && <Badge variant="outline" className="border-dashed">No OUE read in this briefing</Badge>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Labor intensity (LI)"
          caption="All O&M labor hours per MW per year"
          metric={oue?.labor_intensity}
          defaultUnit="hours / MW-yr"
        />
        <MetricCard
          title="Cost intensity (CI)"
          caption="Labor + operations-technology dollars per MW per year"
          metric={oue?.cost_intensity}
          defaultUnit="$ / MW-yr"
        />
        <Level level={oue?.measurement_level} />
      </div>
      <Guardrails oue={oue} />
      {oue?.note && <p className="text-muted-foreground text-xs">{oue.note}</p>}
      {example && <p className="text-xs text-amber-700 dark:text-amber-300">Numbers above are example placeholders, not measurements.</p>}
    </section>
  );
}
