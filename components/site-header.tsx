"use client"

import { SidebarIcon } from "lucide-react"

import { DayPicker } from "@/components/briefing/day-picker"
import { ThemeToggle } from "@/components/briefing/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader({
  generated,
  day,
  days,
  selected,
  onSelect,
}: {
  generated: string
  day: string | null
  days: string[]
  selected: string
  onSelect: (id: string) => void
}) {
  const { toggleSidebar } = useSidebar()

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
              <BreadcrumbPage className="truncate">
                Daily briefing{generated ? ` · generated ${generated}` : ""}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <DayPicker days={days} shownDay={day} selected={selected} onSelect={onSelect} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
