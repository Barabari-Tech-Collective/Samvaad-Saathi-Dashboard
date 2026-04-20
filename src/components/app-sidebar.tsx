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
    IconMessageChatbot,
    IconMicrophone,
    IconSchool,
    IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
