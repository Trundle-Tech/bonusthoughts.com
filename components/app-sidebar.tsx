"use client"

import * as React from "react"
import { Gauge, GalleryVerticalEnd, Lightbulb, Library, PenLine, Users } from "lucide-react"

import { agentId } from "@/components/briefing/agent-card"
import { NavMain, type NavItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AGENTS } from "@/lib/briefing/types"

const NAV: NavItem[] = [
  { title: "OUE north star", url: "#oue", icon: Gauge },
  {
    title: "Agents",
    url: "#agents",
    icon: Users,
    isActive: true,
    items: AGENTS.map((a) => ({ title: a, url: "#" + agentId(a) })),
  },
  { title: "Discoveries", url: "#discoveries", icon: Lightbulb },
  { title: "Writing", url: "#writing", icon: PenLine },
  { title: "Fix library", url: "#library", icon: Library },
]

export function AppSidebar({
  user,
  onSignOut,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar?: string | null }
  onSignOut: () => void
}) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#oue">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BonusThoughts</span>
                  <span className="truncate text-xs">Private briefing</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Briefing" items={NAV} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
