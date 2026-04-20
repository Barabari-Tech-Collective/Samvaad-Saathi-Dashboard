"use client"

import * as React from "react"

import { StudentsKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useCollegesSummary } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

export function CollegesKpiSection() {
  const { collegesSummary, isLoadingCollegesSummary, isError, error } = useCollegesSummary()

  const kpiCards = React.useMemo(() => {
    const kpis = collegesSummary?.kpis ?? []
    return kpis.map((k) => ({
      key: k.key,
      label: k.label,
      value: formatKpiDisplayValue(k),
    }))
  }, [collegesSummary?.kpis])

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load colleges summary"}
      </p>
    )
  }

  return (
    <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
      {isLoadingCollegesSummary && kpiCards.length === 0 ? (
        <StudentsKpiCardsSkeleton count={6} />
      ) : (
        kpiCards.map((kpi) => (
          <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
        ))
      )}
    </div>
  )
}
