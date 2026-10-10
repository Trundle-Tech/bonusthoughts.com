"use client"

import { Search, SidebarIcon } from "lucide-react"

import { DayPicker } from "@/components/briefing/day-picker"
import { useOps } from "@/components/briefing/ops/context"
import { StatusDot } from "@/components/briefing/ops/ui"
import { ThemeToggle } from "@/components/briefing/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/briefing/ops/kbd"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader({
  title,
  day,
  days,
  selected,
  onSelect,
}: {
  title: string
  day: string | null
  days: string[]
  selected: string
  onSelect: (id: string) => void
}) {
  const { toggleSidebar } = useSidebar()
  const { live, example, openSearch, syncedAt } = useOps()
  const liveText = example ? "Example" : live === "live" ? "Live" : live === "offline" ? "Offline" : "Connecting"
  const time = syncedAt
    ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(syncedAt)
    : null

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden min-w-0 md:block">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>BonusThoughts</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="hidden gap-1.5 text-[10px] uppercase sm:inline-flex" title={time ? `Last update ${time} CT` : undefined}>
            <StatusDot tone={example ? "info" : live === "live" ? "ok" : live === "offline" ? "bad" : "idle"} pulse={live === "live" && !example} />
            {liveText}
            {time && !example && <span className="text-muted-foreground font-mono normal-case">{time}</span>}
          </Badge>
          <Button variant="outline" size="sm" className="text-muted-foreground gap-2 font-normal" onClick={openSearch} aria-label="Search (Command K)">
            <Search />
            <span className="hidden sm:inline">Search</span>
            <Kbd className="hidden sm:inline-flex" />
          </Button>
          <DayPicker days={days} shownDay={day} selected={selected} onSelect={onSelect} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
