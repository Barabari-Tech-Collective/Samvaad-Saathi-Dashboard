"use client"

import * as React from "react"

import { DashboardKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useInterviewDetailSummary } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

export function InterviewDetailKpis({
  interviewId,
}: Readonly<{ interviewId: number | string }>) {
  const {
    interviewDetailSummary,
    isLoadingInterviewDetailSummary,
    isError,
    error,
  } = useInterviewDetailSummary(interviewId)

  const kpiCards = React.useMemo(() => {
    const kpis = interviewDetailSummary?.kpis ?? []
    return kpis.map((k) => ({
      key: k.key,
      label: k.label,
      value: formatKpiDisplayValue(k),
    }))
  }, [interviewDetailSummary?.kpis])

  const showSkeleton = isLoadingInterviewDetailSummary && kpiCards.length === 0

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Failed to load interview summary"}
      </p>
    )
  }

  return (
    <div className={KPI_STAT_GRID_CLASSNAME}>
      {showSkeleton ? (
        <DashboardKpiCardsSkeleton count={6} />
      ) : (
        kpiCards.map((kpi) => (
          <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
        ))
      )}
    </div>
  )
}
