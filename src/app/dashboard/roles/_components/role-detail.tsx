"use client"

import * as React from "react"

import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
/* Change: Imported DashboardKpiCardsSkeleton, KPI_STAT_GRID_CLASSNAME, and KpiStatCard.
   Why: Replaces the raw JSON <pre> display with responsive KPI stat cards and matching skeleton loading states. */
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
import { useRoleDetail, useRolesPerformance } from "@/lib/api/hooks/analytics"
/* Change: Imported RoleDetailRow type and formatDurationSeconds utility.
   Why: Provides strict typing for role detail metrics and standard duration formatting (e.g. 38 -> "38s"). */
import type { RoleDetailRow } from "@/lib/api/hooks/analytics"
import { formatDurationSeconds } from "@/lib/kpi-format"

const EMPTY = "__none__"

/* Change: Added formatScore helper function.
   Why: Formats score values cleanly (e.g. 55.5 or 56) without trailing decimals on integers or ugly "NaN". */
function formatScore(val: unknown): string {
  if (val == null || val === "") return "—"
  if (typeof val === "string") return val
  if (typeof val === "number") {
    if (Number.isInteger(val)) return String(val)
    return val.toFixed(1)
  }
  return String(val)
}

/* Change: Added formatRate helper function.
   Why: Formats drop-off rate numbers by appending a '%' sign (e.g. 50 -> "50%"). */
function formatRate(val: unknown): string {
  if (val == null || val === "") return "—"
  if (typeof val === "string") return val.endsWith("%") ? val : `${val}%`
  if (typeof val === "number") {
    return `${Number.isInteger(val) ? val : val.toFixed(1)}%`
  }
  return `${String(val)}%`
}

/* Change: Added formatTimeSpent helper function using formatDurationSeconds.
   Why: Converts raw seconds into human-readable duration strings (e.g. 38 -> "38s"). */
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

  /* Change: Wrapped roleRows in React.useMemo.
     Why: Prevents unnecessary array recreation on each render and satisfies react-hooks/exhaustive-deps. */
  const roleRows = React.useMemo(
    () => rolesPerformance?.items ?? [],
    [rolesPerformance?.items]
  )

  const [selectedRole, setSelectedRole] = React.useState<string>(EMPTY)
  /* Change: Destructured isError and error from useRoleDetail hook.
     Why: Enables displaying helpful error messages to the user if the role detail API request fails. */
  const { roleDetail, isLoadingRoleDetail, isError, error } = useRoleDetail(
    selectedRole === EMPTY ? undefined : selectedRole
  )

  /* Change: Added detailItem memo to safely extract role detail item.
     Why: Handles different API response shapes (array with items or direct object) defensively without runtime errors. */
  const detailItem = React.useMemo<RoleDetailRow | null>(() => {
    if (!roleDetail) return null
    if (Array.isArray(roleDetail.items) && roleDetail.items.length > 0) {
      return roleDetail.items[0]
    }
    if (Array.isArray(roleDetail) && roleDetail.length > 0) {
      return roleDetail[0] as RoleDetailRow
    }
    if (typeof roleDetail === "object" && "role" in roleDetail) {
      return roleDetail as unknown as RoleDetailRow
    }
    return null
  }, [roleDetail])

  /* Change: Added matchedPerformanceRow memo as a fallback source.
     Why: If the role detail endpoint returns partial metrics, values fall back gracefully to the roles performance summary. */
  const matchedPerformanceRow = React.useMemo(() => {
    if (selectedRole === EMPTY) return null
    return roleRows.find((r) => r.role === selectedRole) ?? null
  }, [roleRows, selectedRole])

  const role = detailItem?.role ?? matchedPerformanceRow?.role ?? selectedRole
  const interviews = detailItem?.interviews ?? matchedPerformanceRow?.interviews
  const totalStudents =
    detailItem?.total_students ?? matchedPerformanceRow?.total_students
  const avgScore = detailItem?.avg_score ?? matchedPerformanceRow?.avg_score
  const avgKnowledgeScore =
    detailItem?.avg_knowledge_score ??
    matchedPerformanceRow?.avg_knowledge_score
  const dropOffRate =
    detailItem?.drop_off_rate ?? matchedPerformanceRow?.drop_off_rate
  const avgTimeSpentSeconds = detailItem?.avg_time_spent_seconds

  const hasData = detailItem != null || matchedPerformanceRow != null

  /* Change: Defined kpiCards array configuring the 7 cards.
     Why: Maps each required metric to its key, label, and formatted value for clean declarative rendering. */
  const kpiCards = [
    {
      kpiKey: "role",
      label: "Role",
      /* Change: Wrapped role name in a styled span.
         Why: Prevents long role titles from overflowing or breaking card layout. */
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
                {/* Change: Added loading state item while roles performance data loads.
                    Why: Informs user that roles list is still loading rather than showing an empty dropdown. */}
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
            /* Change: Replaced generic skeleton with DashboardKpiCardsSkeleton count={7}.*/
            <div className={KPI_STAT_GRID_CLASSNAME}>
              <DashboardKpiCardsSkeleton count={7} />
            </div>
          ) : isError ? (
            /* Change: Added explicit error alert rendering.
               Why: Prevents silent failure if the API call encounters a network or server error. */
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load role details."}
            </p>
          ) : !hasData ? (
            /* Change: Added empty state message when no data exists for selected role.
               Why: Clarifies to user that no details were found instead of rendering blank cards. */
            <p className="text-sm text-muted-foreground">
              No detail data available for this role.
            </p>
          ) : (
            /* Change: Replaced raw <pre>{JSON.stringify(...)}</pre> with KpiStatCard grid. */
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
