import * as React from "react"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

import { KpiIcon } from "./kpi-icon"

export const KPI_STAT_GRID_CLASSNAME =
  "grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card"

export function KpiStatCard({
  kpiKey,
  label,
  value,
}: Readonly<{
  kpiKey: string
  label: string
  value: React.ReactNode
}>) {
  return (
    <Card className="@container/card">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2.5">
          <KpiIcon kpiKey={kpiKey} />
          <span className="text-sm font-medium leading-none text-muted-foreground">{label}</span>
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
