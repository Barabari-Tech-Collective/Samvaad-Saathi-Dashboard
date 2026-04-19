"use client"

import * as React from "react"

import { DashboardKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useInterviewsSummary } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

export function InterviewsKpiSection() {
  const { interviewsSummary, isLoadingInterviewsSummary, isError, error } = useInterviewsSummary()

  const kpiCards = React.useMemo(() => {
    const kpis = interviewsSummary?.kpis ?? []
    return kpis.map((k) => ({
      key: k.key,
      label: k.label,
      value: formatKpiDisplayValue(k),
    }))
  }, [interviewsSummary?.kpis])

  const loadingKpis = isLoadingInterviewsSummary && kpiCards.length === 0

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load interviews summary"}
      </p>
    )
  }

  return (
    <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
      {loadingKpis ? (
        <DashboardKpiCardsSkeleton count={6} />
      ) : (
        kpiCards.map((kpi) => (
          <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
        ))
      )}
    </div>
  )
}
