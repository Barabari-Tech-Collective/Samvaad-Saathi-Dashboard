"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titleMap: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Executive overview" },
  "/dashboard/students": { title: "Students", subtitle: "All students" },
  "/dashboard/students/colleges": { title: "Students", subtitle: "Colleges" },
  "/dashboard/interviews": { title: "Interviews", subtitle: "All interviews" },
}

function resolveHeaderMeta(pathname: string): { title: string; subtitle?: string } {
  if (pathname in titleMap) {
    return titleMap[pathname as keyof typeof titleMap]
  }
  if (pathname.startsWith("/dashboard/students/")) {
    return { title: "Students", subtitle: "Student detail" }
  }
  return { title: "Dashboard" }
}

export function SiteHeader() {
  const pathname = usePathname()
  const meta = resolveHeaderMeta(pathname)

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
