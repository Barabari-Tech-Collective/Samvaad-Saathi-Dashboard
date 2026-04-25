"use client"

import * as React from "react"

import { DashboardDateRangeTabs } from "@/app/dashboard/(overview)/_components/dashboard-date-range-tabs"
import {
  DashboardOverviewProvider,
  useDashboardOverviewRange,
} from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import {
  useMostImprovedStudents,
  useRankingsSummary,
  useStrugglingStudents,
  useTopPerformers,
} from "@/lib/api/hooks/analytics"

type RankingSectionProps = Readonly<{
  title: string
  description: string
  rows: readonly {
    student_id: number
    name: string
    college: string
    average_score: number | null
    improvement_percent: number | null
    interviews_count: number
  }[]
  loading: boolean
  page: number
  setPage: (p: number) => void
  totalItems?: number
}>

function RankingSection({ title, description, rows, loading, page, setPage, totalItems }: RankingSectionProps) {
  const totalPages = totalItems ? Math.ceil(totalItems / 10) : 1

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto flex-1 flex flex-col justify-between space-y-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Student</th>
                <th className="pb-2 pr-3 font-medium">College</th>
                <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                <th className="pb-2 pr-3 text-right font-medium">Improvement</th>
                <th className="pb-2 text-right font-medium">Interviews</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.student_id} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium">{row.name}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.college || "—"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.average_score ?? "—"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.improvement_percent ?? "—"}</td>
                  <td className="py-2 text-right tabular-nums">{row.interviews_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && rows.length > 0 && (
          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RankingsPageContent() {
  const { dateFilters } = useDashboardOverviewRange()

  const { rankingsSummary, isLoadingRankingsSummary } = useRankingsSummary(dateFilters)
  
  const [topPage, setTopPage] = React.useState(1)
  const { topPerformers, isLoadingTopPerformers } = useTopPerformers({ page: topPage, limit: 10, ...dateFilters })
  
  const [strugglingPage, setStrugglingPage] = React.useState(1)
  const { strugglingStudents, isLoadingStrugglingStudents } = useStrugglingStudents({ page: strugglingPage, limit: 10, ...dateFilters })
  
  const [mostImprovedPage, setMostImprovedPage] = React.useState(1)
  const { mostImprovedStudents, isLoadingMostImprovedStudents } = useMostImprovedStudents({
    page: mostImprovedPage,
    limit: 10,
    ...dateFilters,
  })

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Rankings</h1>
          <p className="text-sm text-muted-foreground">
            Top performers, struggling students, and improvement rankings.
          </p>
        </div>
        <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
      </div>

      <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
        {isLoadingRankingsSummary
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-28 w-full rounded-xl" />
            ))
          : (rankingsSummary?.kpis ?? []).map((kpi) => (
              <KpiStatCard
                key={kpi.key}
                kpiKey={kpi.key}
                label={kpi.label}
                value={kpi.value ?? "—"}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-3 lg:px-6">
        <RankingSection
          title="Top performers"
          description="Highest-performing students by average score."
          rows={topPerformers?.items ?? []}
          loading={isLoadingTopPerformers}
          page={topPage}
          setPage={setTopPage}
          totalItems={topPerformers?.total}
        />
        <RankingSection
          title="Struggling students"
          description="Students currently below expected threshold."
          rows={strugglingStudents?.items ?? []}
          loading={isLoadingStrugglingStudents}
          page={strugglingPage}
          setPage={setStrugglingPage}
          totalItems={strugglingStudents?.total}
        />
        <RankingSection
          title="Most improved"
          description="Largest positive change in performance."
          rows={mostImprovedStudents?.items ?? []}
          loading={isLoadingMostImprovedStudents}
          page={mostImprovedPage}
          setPage={setMostImprovedPage}
          totalItems={mostImprovedStudents?.total}
        />
      </div>
    </div>
  )
}

export default function RankingsPage() {
  return (
    <DashboardOverviewProvider>
      <RankingsPageContent />
    </DashboardOverviewProvider>
  )
}
