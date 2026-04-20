"use client"

import { usePathname } from "next/navigation"

import { SidebarTransitionLink } from "@/components/sidebar-transition-link"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: React.ReactNode
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className="flex flex-col gap-2">
                    {items.map((item) => {
                        const isActive =
                            item.url === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.url)

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                    <SidebarTransitionLink href={item.url}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </SidebarTransitionLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
