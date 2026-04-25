"use client"

import * as React from "react"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { Skeleton } from "@/components/ui/skeleton"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useRankingsSummary } from "@/lib/api/hooks/analytics"

export function RankingsSummary() {
  const { dateFilters } = useDashboardOverviewRange()
  const { rankingsSummary, isLoadingRankingsSummary } = useRankingsSummary(dateFilters)

  return (
    <div className={KPI_STAT_GRID_CLASSNAME}>
      {isLoadingRankingsSummary
        ? Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 w-full rounded-xl" />
          ))
        : (rankingsSummary?.kpis ?? []).map((kpi) => (
            <KpiStatCard
              key={kpi.key}
              kpiKey={kpi.key}
              label={kpi.label}
              value={kpi.value ?? "—"}
            />
          ))}
    </div>
  )
}
