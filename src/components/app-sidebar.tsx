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
    IconAlertTriangle,
    IconMedal,
    IconMessageChatbot,
    IconMicrophone,
    IconSettingsSearch,
    IconSchool,
    IconTargetArrow,
    IconUsers,
} from "@tabler/icons-react"

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
        {
            title: "Alerts",
            url: "/dashboard/alerts",
            icon: <IconAlertTriangle />,
        },
        {
            title: "Roles",
            url: "/dashboard/roles",
            icon: <IconTargetArrow />,
        },
        {
            title: "Rankings",
            url: "/dashboard/rankings",
            icon: <IconMedal />,
        },
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
