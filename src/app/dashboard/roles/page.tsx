"use client"

import * as React from "react"
import { Link } from "next-view-transitions"
import { IconPlus } from "@tabler/icons-react"

import { DashboardDateRangeTabs } from "@/app/dashboard/(overview)/_components/dashboard-date-range-tabs"
import {
  DashboardOverviewProvider,
} from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { Button } from "@/components/ui/button"

import { RolesSummary } from "./_components/roles-summary"
import { RolesPerformance } from "./_components/roles-performance"
import { RolesWeakSkillsHeatmap } from "./_components/roles-weak-skills-heatmap"
import { RoleDetail } from "./_components/role-detail"

function RolesPageContent() {
  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Role performance, weak skills, and role-level drill-down.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/dashboard/roles/new">
              <IconPlus className="size-4" />
              Add Role
            </Link>
          </Button>
          <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
        </div>
      </div>

      <RolesSummary />
      <RolesPerformance />
      <RolesWeakSkillsHeatmap />
      <RoleDetail />
    </div>
  )
}

export default function RolesPage() {
  return (
    <DashboardOverviewProvider>
      <RolesPageContent />
    </DashboardOverviewProvider>
  )
}
