"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { type AuthUser, useAuth } from "@/lib/api/hooks/useAuth"
import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

function userDisplayName(user: AuthUser): string {
    const n = user.name?.trim()
    if (n) return n
    const email = user.email?.trim()
    if (email) {
        const local = email.split("@")[0]
        return local || email
    }
    if (user.id) return "User"
    return "Account"
}

function userInitials(user: AuthUser): string {
    const n = user.name?.trim()
    if (n) {
        const parts = n.split(/\s+/).filter(Boolean)
        if (parts.length >= 2) {
            return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase()
        }
        return n.slice(0, 2).toUpperCase()
    }
    const email = user.email?.trim()
    if (email) return email.slice(0, 2).toUpperCase()
    if (user.id) return user.id.slice(0, 2).toUpperCase()
    return "?"
}

export function NavUser() {
    const { isMobile } = useSidebar()
    const { user, isLoadingUser, isError } = useAuth()

    if (isLoadingUser) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" className="pointer-events-none" disabled>
                        <Skeleton className="size-8 shrink-0 rounded-lg" aria-hidden />
                        <div className="grid flex-1 gap-1.5 text-left">
                            <Skeleton className="h-4 w-24" aria-hidden />
                            <Skeleton className="h-3 w-32" aria-hidden />
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    if (isError || !user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" className="pointer-events-none" disabled>
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg text-xs">?</AvatarFallback>
                        </Avatar>
                        <span className="truncate text-xs text-muted-foreground">Profile unavailable</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const name = userDisplayName(user)
    const email = user.email?.trim() ?? ""
    const emailLabel = email || "—"
    const avatarSrc = user.avatar?.trim() ? user.avatar : undefined
    const initials = userInitials(user)

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatarSrc} alt={name} />
                                <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{name}</span>
                                <span className="truncate text-xs text-muted-foreground">{emailLabel}</span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={avatarSrc} alt={name} />
                                    <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{emailLabel}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuItem>
                            <IconLogout />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
