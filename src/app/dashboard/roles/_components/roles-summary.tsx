"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useRolesSummary } from "@/lib/api/hooks/analytics"

export function RolesSummary() {
  const { rolesSummary, isLoadingRolesSummary } = useRolesSummary()

  const kpis = rolesSummary?.kpis ?? []

  return (
    <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
      {isLoadingRolesSummary
        ? Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 w-full rounded-xl" />
          ))
        : kpis.map((kpi) => (
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
