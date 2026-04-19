"use client"

import * as React from "react"

import { DashboardKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useDashboardOverview } from "@/lib/api/hooks/analytics"

import { formatKpiDisplayValue } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardKpiSection() {
  const { dateFilters } = useDashboardOverviewRange()
  const { overview, isLoadingOverview } = useDashboardOverview(dateFilters)

  const cards = React.useMemo(() => {
    const kpis = overview?.kpis ?? []
    return kpis.map((k) => ({
      key: k.key,
      label: k.label,
      value: formatKpiDisplayValue(k),
    }))
  }, [overview?.kpis])

  const showSkeleton = isLoadingOverview && cards.length === 0

  return (
    <div className={KPI_STAT_GRID_CLASSNAME}>
      {showSkeleton ? (
        <DashboardKpiCardsSkeleton count={6} />
      ) : (
        cards.map((kpi) => (
          <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
        ))
      )}
    </div>
  )
}
