"use client"

import * as React from "react"

import { DashboardDateRangeTabs } from "@/app/dashboard/(overview)/_components/dashboard-date-range-tabs"
import {
    DashboardOverviewProvider,
    useDashboardOverviewRange,
} from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsAlerts } from "@/lib/api/hooks/analytics"

import { AlertsFilters } from "./_components/alerts-filters"
import { AttentionRequiredStudents } from "./_components/attention-required-students"
import { SystemAlerts } from "./_components/system-alerts"


function AlertsPageContent() {
  const { dateFilters } = useDashboardOverviewRange()
   
  const [role, setRole] = React.useState<string>()
  const [difficulty, setDifficulty] = React.useState<string>()

  const mergedFilters = React.useMemo(
    () => ({
      ...dateFilters,
      ...(role ? { role } : {}),
      ...(difficulty ? { difficulty } : {}),
    }),
    [dateFilters, role, difficulty],
  )

  const { analyticsAlerts, isLoadingAnalyticsAlerts } = useAnalyticsAlerts(mergedFilters)
  const systemAlerts = analyticsAlerts?.systemAlerts ?? []
  const criticalAttention = systemAlerts.filter((alert) => 
    alert.type === "critical_attention" || alert.type.includes("critical")
  ).length

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Alerts & Attention</h1>
          <p className="text-sm text-muted-foreground">
            Monitor computed risk signals and students that require follow-up.
          </p>
        </div>
        <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
      </div>

      <AlertsFilters
        role={role}
        setRole={setRole}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <div className={`${KPI_STAT_GRID_CLASSNAME}`}>
        {isLoadingAnalyticsAlerts ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
        ) : (
          <>
            <KpiStatCard kpiKey="system_alerts" label="System alerts" value={systemAlerts.length} />
            <KpiStatCard kpiKey="attention" label="Critical attention" value={criticalAttention} />
          </>
        )}
      </div>

      <SystemAlerts filters={mergedFilters} />
      <AttentionRequiredStudents filters={mergedFilters} />
    </div>
  )
}

export default function AlertsPage() {
  return (
    <DashboardOverviewProvider>
      <AlertsPageContent />
    </DashboardOverviewProvider>
  )
}
