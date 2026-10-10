"use client"

import * as React from "react"
import { Gauge, GalleryVerticalEnd, History, LayoutDashboard, Lightbulb, Library, PenLine, Table2 } from "lucide-react"

import { NavMain, type NavItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useOps } from "@/components/briefing/ops/context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { hrefFor, type Route } from "@/lib/briefing/route"

export function AppSidebar({
  user,
  onSignOut,
  route,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar?: string | null }
  onSignOut: () => void
  route: Route
}) {
  const { model } = useOps()
  const is = (view: Route["view"]) => route.view === view

  const ops: NavItem[] = [
    { title: "Overview", url: hrefFor({ view: "overview" }), icon: LayoutDashboard, active: is("overview") },
    { title: "OUE north star", url: hrefFor({ view: "oue" }), icon: Gauge, active: is("oue") },
    { title: "Items", url: hrefFor({ view: "items" }), icon: Table2, active: is("items"), badge: model.items.length },
    { title: "History", url: hrefFor({ view: "history" }), icon: History, active: is("history") },
  ]
  const agents: NavItem[] = model.agents.map((a) => ({
    title: a.def.name,
    url: hrefFor({ view: "agent", slug: a.def.slug }),
    icon: a.def.icon,
    active: route.view === "agent" && route.slug === a.def.slug,
    badge: a.today.reported ? a.today.count : "–",
  }))
  const library: NavItem[] = [
    { title: "Discoveries", url: hrefFor({ view: "discoveries" }), icon: Lightbulb, active: is("discoveries") },
    { title: "Writing", url: hrefFor({ view: "writing" }), icon: PenLine, active: is("writing") },
    { title: "Fix library", url: hrefFor({ view: "library" }), icon: Library, active: is("library") },
  ]

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={hrefFor({ view: "overview" })}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BonusThoughts</span>
                  <span className="truncate text-xs">Operations center</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Operations" items={ops} />
        <NavMain label="Agents" items={agents} />
        <NavMain label="Library" items={library} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
