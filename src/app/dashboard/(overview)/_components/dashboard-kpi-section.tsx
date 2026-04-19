"use client"

import * as React from "react"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useDashboardOverview } from "@/lib/api/hooks/analytics"

import { formatKpiDisplayValue } from "./dashboard-format-utils"
import { DashboardKpiIcon } from "./dashboard-kpi-icons"
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

  if (isLoadingOverview && cards.length === 0) {
    return <DashboardKpiCardsSkeleton count={6} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {cards.map((kpi) => (
        <Card key={kpi.key} className="@container/card">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2.5">
              <DashboardKpiIcon kpiKey={kpi.key} />
              <span className="text-sm font-medium leading-none text-muted-foreground">{kpi.label}</span>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {kpi.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
