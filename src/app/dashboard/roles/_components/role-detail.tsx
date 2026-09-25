"use client"

import * as React from "react"

import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { DashboardKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import {
  KPI_STAT_GRID_CLASSNAME,
  KpiStatCard,
} from "@/components/dashboard/kpi-stat-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useRoleDetail,
  useRolesPerformance,
  type RoleDetailRow,
} from "@/lib/api/hooks/analytics"
import { formatDurationSeconds } from "@/lib/kpi-format"

const EMPTY = "__none__"

function formatScore(val: unknown): string {
  if (val == null || val === "") return "—"
  if (typeof val === "string") return val
  if (typeof val === "number") {
    if (Number.isInteger(val)) return String(val)
    return val.toFixed(1)
  }
  return String(val)
}
function formatRate(val: unknown): string {
  if (val == null || val === "") return "—"
  if (typeof val === "string") return val.endsWith("%") ? val : `${val}%`
  if (typeof val === "number") {
    return `${Number.isInteger(val) ? val : val.toFixed(1)}%`
  }
  return `${String(val)}%`
}

function formatTimeSpent(val: unknown): string {
  if (val == null || val === "") return "—"
  const num = typeof val === "number" ? val : Number(val)
  if (Number.isNaN(num)) return String(val)
  return formatDurationSeconds(num)
}

export function RoleDetail() {
  const { dateFilters } = useDashboardOverviewRange()
  const { rolesPerformance, isLoadingRolesPerformance } =
    useRolesPerformance(dateFilters)

  const roleRows = React.useMemo(
    () => rolesPerformance?.items ?? [],
    [rolesPerformance?.items]
  )

  const [selectedRole, setSelectedRole] = React.useState<string>(EMPTY)
   const { roleDetail, isLoadingRoleDetail, isError, error } = useRoleDetail(
    selectedRole === EMPTY ? undefined : selectedRole
  )

  const detailItem: RoleDetailRow | null = roleDetail?.items[0] ?? null

  const matchedPerformanceRow = React.useMemo(() => {
    if (selectedRole === EMPTY) return null
    return roleRows.find((r) => r.role === selectedRole) ?? null
  }, [roleRows, selectedRole])

  const role = detailItem?.role || matchedPerformanceRow?.role || selectedRole
  const interviews = detailItem?.interviews ?? matchedPerformanceRow?.interviews
  const totalStudents =
    detailItem?.total_students ?? matchedPerformanceRow?.total_students
  const avgScore = detailItem?.avg_score ?? matchedPerformanceRow?.avg_score
  const avgKnowledgeScore =
    detailItem?.avg_knowledge_score ??
    matchedPerformanceRow?.avg_knowledge_score
  const dropOffRate =
    detailItem?.drop_off_rate ?? matchedPerformanceRow?.drop_off_rate
  const avgTimeSpentSeconds =
    detailItem?.avg_time_spent_seconds ??
    matchedPerformanceRow?.avg_time_spent_seconds

  const hasData = detailItem != null || matchedPerformanceRow != null

    const kpiCards = [
    {
      kpiKey: "role",
      label: "Role",
         value: (
        <span
          className="text-base leading-snug font-semibold break-words"
          title={role}
        >
          {role}
        </span>
      ),
    },
    {
      kpiKey: "interviews",
      label: "Total Interviews",
      value: interviews != null ? interviews.toLocaleString() : "—",
    },
    {
      kpiKey: "total_students",
      label: "Total Students",
      value: totalStudents != null ? totalStudents.toLocaleString() : "—",
    },
    {
      kpiKey: "avg_score",
      label: "Average Score",
      value: formatScore(avgScore),
    },
    {
      kpiKey: "avg_knowledge_score",
      label: "Avg Knowledge Score",
      value: formatScore(avgKnowledgeScore),
    },
    {
      kpiKey: "drop_off_rate",
      label: "Drop-off Rate",
      value: formatRate(dropOffRate),
    },
    {
      kpiKey: "avg_time_spent_seconds",
      label: "Avg Time Spent",
      value: formatTimeSpent(avgTimeSpentSeconds),
    },
  ]

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role detail</CardTitle>
          <CardDescription>
            Drill into one role with role detail endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="role-select">Select role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY}>None</SelectItem>
                {isLoadingRolesPerformance && roleRows.length === 0 ? (
                  <SelectItem disabled value="__loading__">
                    Loading roles...
                  </SelectItem>
                ) : null}
                {roleRows.map((row) => (
                  <SelectItem key={row.role} value={row.role}>
                    {row.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole === EMPTY ? (
            <p className="text-sm text-muted-foreground">
              Choose a role to load detail data.
            </p>
          ) : isLoadingRoleDetail ? (
           
            <div className={KPI_STAT_GRID_CLASSNAME}>
              <DashboardKpiCardsSkeleton count={7} />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load role details."}
            </p>
          ) : !hasData ? (
              <p className="text-sm text-muted-foreground">
              No detail data available for this role.
            </p>
          ) : (
            <div className={KPI_STAT_GRID_CLASSNAME}>
              {kpiCards.map((kpi) => (
                <KpiStatCard
                  key={kpi.kpiKey}
                  kpiKey={kpi.kpiKey}
                  label={kpi.label}
                  value={kpi.value}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
