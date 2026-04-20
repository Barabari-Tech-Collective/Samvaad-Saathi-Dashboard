"use client"

import { Link } from "next-view-transitions"
import * as React from "react"

import { cn } from "@/lib/utils"

type SidebarTransitionLinkProps = React.ComponentProps<typeof Link>

export function SidebarTransitionLink({
    className,
    onClick,
    ...props
}: SidebarTransitionLinkProps) {
    const [bounce, setBounce] = React.useState(false)

    return (
        <Link
            {...props}
            className={cn(
                "sidebar-nav-interactive outline-none",
                bounce && "animate-sidebar-bounce",
                className,
            )}
            onClick={(e) => {
                onClick?.(e)
                if (e.defaultPrevented) return
                setBounce(true)
                window.setTimeout(() => setBounce(false), 500)
            }}
        />
    )
}
