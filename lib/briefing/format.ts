import { TIME_ZONE } from "./types";

export function fmtDateTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

/** YYYY-MM-DD of an instant in America/Chicago (matches push_briefing.mjs). */
export function dateIdChicago(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function idToDate(id: string): Date {
  const [y, m, d] = id.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dateToId(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function isHttpUrl(s?: string): boolean {
  return !!s && /^https?:\/\//i.test(s);
}
