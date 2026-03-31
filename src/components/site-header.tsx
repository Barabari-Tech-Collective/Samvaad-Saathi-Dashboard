"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titleMap: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Admin Dashboard" },
  "/dashboard/students": { title: "Students", subtitle: "Student-level analytics" },
  "/dashboard/interviews": { title: "Interviews", subtitle: "Session-level analytics" },
  "/dashboard/segments": { title: "Segments", subtitle: "Role, difficulty & college analytics" },
  "/dashboard/product": { title: "Product", subtitle: "System & funnel analytics" },
  "/dashboard/scoring": { title: "Scoring", subtitle: "Score distribution & correlation" },
  "/dashboard/alerts": { title: "Alerts", subtitle: "Student & system alerts" },
}

export function SiteHeader() {
  const pathname = usePathname()
  const meta = titleMap[pathname] ?? { title: "Dashboard" }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-col">
          <h1 className="text-base font-medium leading-none">{meta.title}</h1>
          {meta.subtitle && (
            <span className="text-xs text-muted-foreground">{meta.subtitle}</span>
          )}
        </div>
      </div>
    </header>
  )
}
