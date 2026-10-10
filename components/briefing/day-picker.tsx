"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateToId, idToDate } from "@/lib/briefing/format";

export function DayPicker({
  days,
  shownDay,
  selected,
  onSelect,
}: {
  days: string[]; // newest first
  shownDay: string | null;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const available = React.useMemo(() => new Set(days), [days]);
  const idx = shownDay ? days.indexOf(shownDay) : -1;
  const older = idx >= 0 ? days[idx + 1] : undefined;
  const newer = idx > 0 ? days[idx - 1] : undefined;
  const label = shownDay
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(idToDate(shownDay))
    : "Pick a day";
  return (
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="icon-sm" aria-label="Older briefing" disabled={!older} onClick={() => older && onSelect(older)}>
        <ChevronLeft />
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="min-w-36 justify-start font-normal">
            <CalendarDays /> {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={shownDay ? idToDate(shownDay) : undefined}
            defaultMonth={shownDay ? idToDate(shownDay) : undefined}
            onSelect={(d) => {
              if (!d) return;
              const id = dateToId(d);
              if (available.has(id)) {
                onSelect(id);
                setOpen(false);
              }
            }}
            disabled={(d) => !available.has(dateToId(d))}
          />
          <div className="border-t p-2">
            <Button
              variant={selected === "latest" ? "secondary" : "ghost"}
              size="sm"
              className="w-full"
              onClick={() => {
                onSelect("latest");
                setOpen(false);
              }}
            >
              Latest briefing
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon-sm" aria-label="Newer briefing" disabled={!newer} onClick={() => newer && onSelect(newer)}>
        <ChevronRight />
      </Button>
    </div>
  );
}
