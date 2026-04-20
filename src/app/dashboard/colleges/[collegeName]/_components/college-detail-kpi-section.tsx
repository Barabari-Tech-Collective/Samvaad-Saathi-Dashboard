"use client"

import * as React from "react"

import { StudentsKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useCollegeDetailSummary } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

export function CollegeDetailKpiSection({
  collegeName,
}: Readonly<{ collegeName: string }>) {
  const {
    collegeDetailSummary,
    isLoadingCollegeDetailSummary,
    isError,
    error,
  } = useCollegeDetailSummary(collegeName)

  const kpiCards = React.useMemo(() => {
    const kpis = collegeDetailSummary?.kpis ?? []
    return kpis.map((k) => ({
      key: k.key,
      label: k.label,
      value: formatKpiDisplayValue(k),
    }))
  }, [collegeDetailSummary?.kpis])

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Failed to load college summary"}
      </p>
    )
  }

  return (
    <div className={KPI_STAT_GRID_CLASSNAME}>
      {isLoadingCollegeDetailSummary && kpiCards.length === 0 ? (
        <StudentsKpiCardsSkeleton count={6} />
      ) : (
        kpiCards.map((kpi) => (
          <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
        ))
      )}
    </div>
  )
}
