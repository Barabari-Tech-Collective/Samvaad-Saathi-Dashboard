"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardRecentStudentsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useDashboardRecentStudents } from "@/lib/api/hooks/analytics"

import { formatDashboardDateTime } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardRecentStudents() {
  const { dateFilters } = useDashboardOverviewRange()
  const { recentStudents, isLoadingRecentStudents } = useDashboardRecentStudents({
    limit: 10,
    ...dateFilters,
  })

  const total = recentStudents?.total
  const meta =
    total != null ? (
      <span className="text-xs font-normal text-muted-foreground">
        {recentStudents?.items?.length ?? 0} of {total} shown
      </span>
    ) : null

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-base">
            Recently added students {meta}
          </CardTitle>
          <CardDescription>New registrations in the selected range</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <Link href="/dashboard/students">View all students</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-2">
        {isLoadingRecentStudents ? (
          <DashboardRecentStudentsSkeleton rows={5} />
        ) : (
          (recentStudents?.items ?? []).map((s) => (
            <div
              key={s.student_id}
              className="grid gap-1 rounded-md border px-3 py-2 text-sm sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.email}</div>
                <div className="mt-1 text-muted-foreground">
                  <span>{s.college ?? "—"}</span>
                  {s.target_position ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · <span className="text-foreground/90">{s.target_position}</span>
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                {formatDashboardDateTime(s.created_at)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
