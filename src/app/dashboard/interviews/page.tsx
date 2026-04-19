"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ChartBarSkeleton,
  DashboardKpiCardsSkeleton,
  DashboardRecentTableSkeleton,
} from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import {
  useDifficultyMetrics,
  useInterviewsSummary,
  useInterviewsTable,
} from "@/lib/api/hooks/analytics"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import { formatInterviewListDuration, formatKpiDisplayValue } from "@/lib/kpi-format"

const difficultyConfig = {
  avgScore: { label: "Avg score", color: "var(--primary)" },
  completionRate: { label: "Completion %", color: "var(--chart-2)" },
} satisfies ChartConfig

const LIST_LIMIT = 50

export default function InterviewsPage() {
  const { interviewsSummary, isLoadingInterviewsSummary } = useInterviewsSummary()
  const { difficultyMetrics, isLoadingDifficultyMetrics } = useDifficultyMetrics()
  const {
    interviewsTable,
    isLoadingInterviewsTable,
    isError,
    error,
  } = useInterviewsTable({ page: 1, limit: LIST_LIMIT })

  const kpiCards = React.useMemo(() => {
    const kpis = interviewsSummary?.kpis ?? []
    return kpis.map((k) => ({
      key: k.key,
      label: k.label,
      value: formatKpiDisplayValue(k),
    }))
  }, [interviewsSummary?.kpis])

  const chartData = React.useMemo(
    () =>
      (difficultyMetrics?.items ?? []).map((d) => ({
        difficulty: d.difficulty,
        avgScore: d.avg_score ?? 0,
        completionRate: d.completion_rate ?? 0,
      })),
    [difficultyMetrics?.items],
  )

  const rows = interviewsTable?.items ?? []
  const total = interviewsTable?.total ?? rows.length
  const loadingKpis = isLoadingInterviewsSummary && kpiCards.length === 0
  const loadingChart = isLoadingDifficultyMetrics
  const loadingTable = isLoadingInterviewsTable

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load interviews"}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
        {loadingKpis ? (
          <DashboardKpiCardsSkeleton count={6} />
        ) : (
          kpiCards.map((kpi) => (
            <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
          ))
        )}
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average score by difficulty</CardTitle>
            <CardDescription>Score and completion rate by difficulty band</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingChart ? (
              <ChartBarSkeleton className="h-[240px] w-full" />
            ) : chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No difficulty metrics for this period.</p>
            ) : (
              <ChartContainer config={difficultyConfig} className="aspect-auto h-[240px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="difficulty" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="completionRate"
                    fill="var(--color-completionRate)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All interviews</CardTitle>
            <CardDescription>
              Showing {rows.length} of {total}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loadingTable ? (
              <DashboardRecentTableSkeleton rows={8} />
            ) : (
              <table className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Interview ID</th>
                    <th className="pb-2 pr-3 font-medium">Student</th>
                    <th className="pb-2 pr-3 font-medium">College</th>
                    <th className="pb-2 pr-3 font-medium">Role</th>
                    <th className="pb-2 pr-3 font-medium">Difficulty</th>
                    <th className="pb-2 pr-3 text-right font-medium">Score</th>
                    <th className="pb-2 pr-3 text-right font-medium">Duration</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.interview_id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                        {row.interview_id}
                      </td>
                      <td className="py-2 pr-3 font-medium">{row.student_name}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{row.college}</td>
                      <td className="py-2 pr-3">{row.role}</td>
                      <td className="py-2 pr-3">
                        <Badge variant="outline" className="capitalize">
                          {row.difficulty}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums font-medium">
                        {row.score ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {formatInterviewListDuration(row.duration)}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {row.date ? formatDashboardDateTime(row.date) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
