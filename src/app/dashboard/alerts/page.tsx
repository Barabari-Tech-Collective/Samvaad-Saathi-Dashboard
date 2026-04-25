"use client"

import * as React from "react"
import Link from "next/link"

import { DashboardDateRangeTabs } from "@/app/dashboard/(overview)/_components/dashboard-date-range-tabs"
import {
  DashboardOverviewProvider,
  useDashboardOverviewRange,
} from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { SeverityBadge } from "@/components/severity-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsAlerts, useDashboardAttentionRequired } from "@/lib/api/hooks/analytics"

const EMPTY = "__all__"

function AlertsPageContent() {
  const { dateFilters } = useDashboardOverviewRange()
  
  const [role, setRole] = React.useState<string>()
  const [difficulty, setDifficulty] = React.useState<string>()
  const [attentionPage, setAttentionPage] = React.useState(1)

  const mergedFilters = React.useMemo(
    () => ({
      ...dateFilters,
      ...(role ? { role } : {}),
      ...(difficulty ? { difficulty } : {}),
    }),
    [dateFilters, role, difficulty],
  )

  const { analyticsAlerts, isLoadingAnalyticsAlerts, isError: alertsError, error: alertsErrObj } =
    useAnalyticsAlerts(mergedFilters)

  const {
    attentionRequired,
    isLoadingAttentionRequired,
    isError: attentionError,
    error: attentionErrObj,
  } = useDashboardAttentionRequired({
    page: attentionPage,
    limit: 10,
    ...mergedFilters,
  })

  const systemAlerts = analyticsAlerts?.systemAlerts ?? []
  const attentionItems = attentionRequired?.items ?? []
  const attentionTotalPages = attentionRequired?.total ? Math.ceil(attentionRequired.total / 10) : 1

  const criticalAttention = attentionItems.filter((item) => item.severity === "critical").length

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Alerts & Attention</h1>
          <p className="text-sm text-muted-foreground">
            Monitor computed risk signals and students that require follow-up.
          </p>
        </div>
        <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 lg:px-6">
        <div className="space-y-1 max-w-sm">
          <Label>Role</Label>
          <Input
            placeholder="e.g. react developer"
            value={role ?? ""}
            onChange={(e) => setRole(e.target.value || undefined)}
          />
        </div>
        <div className="space-y-1 max-w-sm">
          <Label>Difficulty</Label>
          <Select
            value={difficulty ?? EMPTY}
            onValueChange={(value) => setDifficulty(value === EMPTY ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EMPTY}>All difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
        {isLoadingAnalyticsAlerts ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
        ) : (
          <>
            <KpiStatCard kpiKey="system_alerts" label="System alerts" value={systemAlerts.length} />
            <KpiStatCard kpiKey="attention" label="Critical attention" value={criticalAttention} />
          </>
        )}
      </div>

 <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System alerts</CardTitle>
            <CardDescription>Role/system-level risk signals and failure patterns.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {isLoadingAnalyticsAlerts ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : alertsError ? (
              <p className="text-sm text-destructive">
                {alertsErrObj instanceof Error ? alertsErrObj.message : "Failed to load alerts."}
              </p>
            ) : systemAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No system alerts found for selected filters.</p>
            ) : (
              systemAlerts.slice(0, 10).map((alert, index) => (
                <div key={`${alert.type}-${index}`} className="rounded-md border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {alert.type.replaceAll("_", " ")}
                    </Badge>
                    {typeof alert.role === "string" ? (
                      <span className="text-xs text-muted-foreground capitalize">{alert.role}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
           </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attention required students</CardTitle>
            <CardDescription>Prioritized list from dashboard attention endpoint.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto space-y-4">
            {isLoadingAttentionRequired ? (
              <div className="space-y-2">
                 {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : attentionError ? (
              <p className="text-sm text-destructive">
                {attentionErrObj instanceof Error
                  ? attentionErrObj.message
                  : "Failed to load attention-required list."}
              </p>
            ) : attentionItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No students currently flagged for attention with selected filters.
              </p>
            ) : (
              <>
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Severity</th>
                      <th className="pb-2 pr-3 font-medium">Type</th>
                      <th className="pb-2 pr-3 font-medium">Student ID</th>
                      <th className="pb-2 font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attentionItems.map((item, index) => (
                      <tr key={`${item.type}-${item.user_id}-${index}`} className="border-b last:border-0">
                        <td className="py-2 pr-3">
                          <SeverityBadge severity={item.severity} />
                        </td>
                        <td className="py-2 pr-3">{item.type.replaceAll("_", " ")}</td>
                        <td className="py-2 pr-3 font-mono text-xs">
                          <Link
                            href={`/dashboard/students/${item.user_id}`}
                            className="hover:underline text-primary"
                          >
                            {item.user_id}
                          </Link>
                        </td>
                        <td className="py-2 text-muted-foreground">{item.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-end space-x-2 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAttentionPage((p) => Math.max(1, p - 1))}
                    disabled={attentionPage <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground flex items-center px-2">
                    Page {attentionPage} of {Math.max(1, attentionTotalPages)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAttentionPage((p) => Math.min(attentionTotalPages, p + 1))}
                    disabled={attentionPage >= attentionTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  return (
    <DashboardOverviewProvider>
      <AlertsPageContent />
    </DashboardOverviewProvider>
  )
}
