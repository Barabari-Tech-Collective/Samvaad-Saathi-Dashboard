"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { useRolesWeakSkills } from "@/lib/api/hooks/analytics"

export function RolesWeakSkillsHeatmap() {
  const { dateFilters } = useDashboardOverviewRange()
  const { rolesWeakSkills, isLoadingRolesWeakSkills } = useRolesWeakSkills(dateFilters)

  return (
    <div className="lg:px-6">
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
  )
}
