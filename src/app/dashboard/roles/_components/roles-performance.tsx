"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { useRolesPerformance } from "@/lib/api/hooks/analytics"

export function RolesPerformance() {
  const { dateFilters } = useDashboardOverviewRange()
  const { rolesPerformance, isLoadingRolesPerformance } = useRolesPerformance(dateFilters)

  const roleRows = rolesPerformance?.items ?? []

  return (
    <div className="lg:px-6">
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
    </div>
  )
}
