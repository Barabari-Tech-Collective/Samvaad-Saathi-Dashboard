"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function StudentsSectionNav() {
    const pathname = usePathname()
    const onAllStudents = pathname === "/dashboard/students"
    const onColleges = pathname.startsWith("/dashboard/students/colleges")

    return (
        <nav
            className="flex flex-wrap gap-2 border-b px-4 pb-3 lg:px-6"
            aria-label="Students sections"
        >
            <Link
                href="/dashboard/students"
                className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    onAllStudents
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                All students
            </Link>
            <Link
                href="/dashboard/students/colleges"
                className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    onColleges
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                Colleges
            </Link>
        </nav>
    )
}
