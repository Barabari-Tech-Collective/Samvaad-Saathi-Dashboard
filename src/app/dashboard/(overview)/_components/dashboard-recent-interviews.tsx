"use client"

import { Link } from "next-view-transitions"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardRecentTableSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useDashboardRecentInterviews } from "@/lib/api/hooks/analytics"

import { formatDashboardDateTime, formatDurationSeconds } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardRecentInterviews() {
  const { dateFilters } = useDashboardOverviewRange()
  const { recentInterviews, isLoadingRecentInterviews } = useDashboardRecentInterviews({
    limit: 10,
    ...dateFilters,
  })

  const total = recentInterviews?.total
  const meta =
    total != null ? (
      <span className="text-xs font-normal text-muted-foreground">
        {recentInterviews?.items?.length ?? 0} of {total} shown
      </span>
    ) : null

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-base">
            Recent interviews {meta}
          </CardTitle>
          <CardDescription>Latest sessions in the selected range</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <Link href="/dashboard/interviews">View all interviews</Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoadingRecentInterviews ? (
          <DashboardRecentTableSkeleton rows={6} />
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-2 font-medium">ID</th>
                <th className="pb-2 pr-2 font-medium">Student</th>
                <th className="pb-2 pr-2 font-medium">College</th>
                <th className="pb-2 pr-2 font-medium">Role</th>
                <th className="pb-2 pr-2 font-medium">Difficulty</th>
                <th className="pb-2 pr-2 text-right font-medium">Score</th>
                <th className="pb-2 pr-2 font-medium">Duration</th>
                <th className="pb-2 pr-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentInterviews?.items ?? []).map((row) => {
                const interviewHref = `/dashboard/interviews/${encodeURIComponent(String(row.interview_id))}`
                return (
                <tr key={row.interview_id} className="border-b last:border-0">
                  <td className="py-2 pr-2 font-mono text-xs text-muted-foreground">
                    <Link href={interviewHref} className="text-primary underline-offset-4 hover:underline">
                      {row.interview_id}
                    </Link>
                  </td>
                  <td className="py-2 pr-2 font-medium">
                    {row.student_id != null ? (
                      <Link
                        href={`/dashboard/students/${encodeURIComponent(String(row.student_id))}`}
                        className="text-foreground underline-offset-4 hover:underline"
                      >
                        {row.student_name}
                      </Link>
                    ) : (
                      row.student_name
                    )}
                  </td>
                  <td className="py-2 pr-2 text-muted-foreground">
                    {row.college ? (
                      <Link
                        href={`/dashboard/colleges/${encodeURIComponent(row.college)}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {row.college}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 pr-2">{row.role}</td>
                  <td className="py-2 pr-2">
                    <DifficultyBadge difficulty={row.difficulty} className="text-xs" />
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">
                    {row.score ?? "—"}
                  </td>
                  <td className="py-2 pr-2 tabular-nums text-muted-foreground">
                    {formatDurationSeconds(row.duration_seconds)}
                  </td>
                  <td className="py-2 pr-2">
                    {row.status ? (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {row.status}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {formatDashboardDateTime(row.date)}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
