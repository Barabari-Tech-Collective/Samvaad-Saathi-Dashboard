"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import type { KpiItem } from "@/lib/api/hooks/analytics"
import { useStudentProfile, useStudentSummary } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

function kpiDisplayValue(
  key: string,
  row: KpiItem | undefined,
  profileLastActive: string | null | undefined,
): string {
  if (!row) return "—"
  if (row.value === null || row.value === undefined) {
    if (key === "last_active_date" && profileLastActive) {
      return formatDashboardDateTime(profileLastActive)
    }
    return "—"
  }
  return formatKpiDisplayValue(row)
}

export function StudentSummaryKpis({ studentId }: Readonly<{ studentId: number | string }>) {
  const { studentProfile } = useStudentProfile(studentId)
  const { studentSummary, isLoadingStudentSummary, isError, error } = useStudentSummary(studentId)

  const kpis = studentSummary?.kpis ?? []

  if (isLoadingStudentSummary && !studentSummary) {
    return (
      <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load summary KPIs."}
          </p>
        </CardHeader>
      </Card>
    )
  }

  if (kpis.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
          <p className="text-sm text-muted-foreground">No summary metrics returned for this student yet.</p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {kpis.map((k) => (
        <Card key={k.key} className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium leading-snug text-muted-foreground">{k.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums tracking-tight">
              {kpiDisplayValue(k.key, k, studentProfile?.lastActive)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
