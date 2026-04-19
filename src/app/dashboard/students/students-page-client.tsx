"use client"

import * as React from "react"
import Link from "next/link"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  StudentsKpiCardsSkeleton,
  StudentsTableSkeleton,
} from "@/components/dashboard/analytics-skeletons"
import { useStudentsSummary, useStudentsTable } from "@/lib/api/hooks/analytics"

function kpiDisplayValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "number") return value.toLocaleString()
  return value
}

export function StudentsPageClient() {
  const { studentsSummary, isLoadingStudentsSummary } = useStudentsSummary()
  const { studentsTable, isLoadingStudentsTable, isError, error } = useStudentsTable({
    page: 1,
    limit: 100,
  })

  const kpiCards = React.useMemo(() => {
    const kpis = studentsSummary?.kpis ?? []
    return kpis.map((k) => ({
      label: k.label,
      value: kpiDisplayValue(k.value),
      trend: "up" as const,
      footer: k.key,
    }))
  }, [studentsSummary?.kpis])

  const rows = studentsTable?.items ?? []
  const loading = isLoadingStudentsSummary || isLoadingStudentsTable

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load students"}
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {loading && kpiCards.length === 0
          ? <StudentsKpiCardsSkeleton count={6} />
          : kpiCards.map((kpi) => (
              <Card key={kpi.label} className="@container/card">
                <CardHeader>
                  <CardDescription>{kpi.label}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {kpi.value}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      {kpi.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">{kpi.footer}</CardFooter>
              </Card>
            ))}
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All students</CardTitle>
            <CardDescription>
              {studentsTable?.total ?? rows.length} total · select a student for detail
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading && rows.length === 0 ? (
              <StudentsTableSkeleton rows={10} />
            ) : (
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Student ID</th>
                    <th className="pb-2 pr-3 font-medium">Name</th>
                    <th className="pb-2 pr-3 font-medium">College</th>
                    <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                    <th className="pb-2 pr-3 text-right font-medium">Latest</th>
                    <th className="pb-2 pr-3 text-right font-medium">Improvement</th>
                    <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                    <th className="pb-2 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.student_id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                        <Link
                          href={`/dashboard/students/${encodeURIComponent(String(s.student_id))}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {s.student_id}
                        </Link>
                      </td>
                      <td className="py-2 pr-3">
                        <Link
                          href={`/dashboard/students/${encodeURIComponent(String(s.student_id))}`}
                          className="font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{s.college}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {s.average_score ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{s.latest_score ?? "—"}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {s.improvement_percent != null ? (
                          <span
                            className={
                              s.improvement_percent >= 0 ? "text-emerald-600" : "text-red-500"
                            }
                          >
                            {s.improvement_percent > 0 ? "+" : ""}
                            {s.improvement_percent}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{s.interviews_count}</td>
                      <td className="py-2 text-muted-foreground">{s.last_active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
