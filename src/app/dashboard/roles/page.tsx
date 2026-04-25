"use client"

import * as React from "react"

import { DashboardDateRangeTabs } from "@/app/dashboard/(overview)/_components/dashboard-date-range-tabs"
import {
  DashboardOverviewProvider,
  useDashboardOverviewRange,
} from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import {
  useRoleDetail,
  useRolesPerformance,
  useRolesSummary,
  useRolesWeakSkills,
} from "@/lib/api/hooks/analytics"

const EMPTY = "__none__"

function RolesPageContent() {
  const { dateFilters } = useDashboardOverviewRange()

  const { rolesSummary, isLoadingRolesSummary } = useRolesSummary()
  const { rolesPerformance, isLoadingRolesPerformance } = useRolesPerformance(dateFilters)
  const { rolesWeakSkills, isLoadingRolesWeakSkills } = useRolesWeakSkills(dateFilters)

  const [selectedRole, setSelectedRole] = React.useState<string>(EMPTY)
  const { roleDetail, isLoadingRoleDetail } = useRoleDetail(
    selectedRole === EMPTY ? undefined : selectedRole,
  )

  const kpis = rolesSummary?.kpis ?? []
  const roleRows = rolesPerformance?.items ?? []

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Role performance, weak skills, and role-level drill-down.
          </p>
        </div>
        <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
      </div>

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

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role performance</CardTitle>
            <CardDescription>Interviews, score, drop-off, and weaknesses by role.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isLoadingRolesPerformance ? (
               <div className="space-y-2">
                 {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Role</th>
                    <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                    <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                    <th className="pb-2 font-medium">Weaknesses</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRows.map((row) => (
                    <tr key={row.role} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-medium">{row.role}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{row.interviews}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{row.avg_score ?? "—"}</td>
                      <td className="py-2 text-muted-foreground">{row.common_weaknesses.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role weak skills heatmap</CardTitle>
            <CardDescription>Matrix points surfaced by weak skills API.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRolesWeakSkills ? (
               <div className="space-y-2">
                 {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
              </div>
            ) : (
              <div className="grid gap-2">
                {(rolesWeakSkills?.items ?? []).slice(0, 12).map((item, idx) => (
                  <div key={`${item.x}-${item.y}-${idx}`} className="rounded-md border px-3 py-2 text-sm">
                    <span className="font-medium">{item.x}</span>
                    <span className="mx-2 text-muted-foreground">vs</span>
                    <span>{item.y}</span>
                    <span className="ml-2 tabular-nums text-muted-foreground">value: {item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role detail</CardTitle>
            <CardDescription>Drill into one role with role detail endpoint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-w-sm space-y-1">
              <Label>Select role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY}>None</SelectItem>
                  {roleRows.map((row) => (
                    <SelectItem key={row.role} value={row.role}>
                      {row.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRole === EMPTY ? (
              <p className="text-sm text-muted-foreground">Choose a role to load detail data.</p>
            ) : isLoadingRoleDetail ? (
              <Skeleton className="h-40 w-full rounded-md" />
            ) : (
              <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
                {JSON.stringify(roleDetail?.items ?? [], null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RolesPage() {
  return (
    <DashboardOverviewProvider>
      <RolesPageContent />
    </DashboardOverviewProvider>
  )
}
