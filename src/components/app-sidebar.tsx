"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { SidebarTransitionLink } from "@/components/sidebar-transition-link"
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
    IconMessageChatbot,
    IconMicrophone,
    IconSettingsSearch,
    IconSchool,
    IconTargetArrow,
    IconUsers,
    IconList,
    IconAlertTriangle,
    IconMedal,
} from "@tabler/icons-react"

const FEATURE_FLAGS = {
    showAlerts: false,
    showRankings: false,
}

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: <IconDashboard />,
        },
        {
            title: "Students",
            url: "/dashboard/students",
            icon: <IconUsers />,
        },
        {
            title: "Colleges",
            url: "/dashboard/colleges",
            icon: <IconSchool />,
        },
        {
            title: "Interviews",
            url: "/dashboard/interviews",
            icon: <IconMicrophone />,
        },
        ...(FEATURE_FLAGS.showAlerts ? [{
            title: "Alerts",
            url: "/dashboard/alerts",
            icon: <IconAlertTriangle />,
        }] : []),
        {
            title: "Roles",
            url: "/dashboard/roles",
            icon: <IconList />,
        },
        {
            title: "Roles Analytics",
            url: "/dashboard/roles-analytics",
            icon: <IconTargetArrow />,
        },
        ...(FEATURE_FLAGS.showRankings ? [{
            title: "Rankings",
            url: "/dashboard/rankings",
            icon: <IconMedal />,
        }] : []),
    ],
    navSecondary: [
        // {
        //   title: "Settings",
        //   url: "#",
        //   icon: <IconSettings />,
        // },

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
                            <SidebarTransitionLink href="/dashboard">
                                <IconMessageChatbot className="size-5!" />
                                <span className="text-base font-semibold">Samvaad Saathi</span>
                            </SidebarTransitionLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
