"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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
import {
  IconDashboard,
  IconUsers,
  IconMicrophone,
  IconChartBar,
  IconDeviceAnalytics,
  IconTargetArrow,
  IconAlertTriangle,
  IconSettings,
  IconHelp,
  IconMessageChatbot,
} from "@tabler/icons-react"
import Link from "next/link"

const data = {
  user: {
    name: "Admin",
    email: "admin@samvaadsaathi.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <IconDashboard />,
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: <IconUsers />,
    },
    {
      title: "Interviews",
      url: "/dashboard/interviews",
      icon: <IconMicrophone />,
    },
    {
      title: "Segments",
      url: "/dashboard/segments",
      icon: <IconChartBar />,
    },
    {
      title: "Product",
      url: "/dashboard/product",
      icon: <IconDeviceAnalytics />,
    },
    {
      title: "Scoring",
      url: "/dashboard/scoring",
      icon: <IconTargetArrow />,
    },
    {
      title: "Alerts",
      url: "/dashboard/alerts",
      icon: <IconAlertTriangle />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <IconHelp />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconMessageChatbot className="size-5!" />
                <span className="text-base font-semibold">Samvaad Saathi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
