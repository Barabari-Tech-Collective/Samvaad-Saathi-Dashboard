"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePredictiveAlerts } from "@/lib/api/hooks/analytics"
import { Link } from "next-view-transitions"
import * as React from "react"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardPredictiveAlerts() {
  const { dateFilters } = useDashboardOverviewRange()
  const { predictiveAlerts, isLoadingPredictiveAlerts } = usePredictiveAlerts({ ...dateFilters, limit: 5 })

  return (
    <Card className="flex h-full flex-col @container/card">
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Predictive alerts</CardTitle>
          <CardDescription>Model-driven alerts and confidence signals.</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <Link href="/dashboard/alerts">View all alerts</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {isLoadingPredictiveAlerts ? (
          <Skeleton className="h-64 w-full rounded-md" />
        ) : (
          <div className="space-y-3">
            {(predictiveAlerts?.items ?? []).map((alert, i) => (
              <div
                key={i}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant="outline" className="capitalize">
                    {alert.prediction?.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {alert.confidence ? `${(alert.confidence * 100).toFixed(0)}% confidence` : "—"}
                  </span>
                </div>
                <p className="text-muted-foreground mb-1">{alert.message}</p>
                {alert.user_id && (
                  <Link 
                    href={`/dashboard/students/${alert.user_id}`} 
                    className="text-xs text-primary hover:underline"
                  >
                    Student #{alert.user_id}
                  </Link>
                )}
              </div>
            ))}
            {(!predictiveAlerts?.items || predictiveAlerts.items.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                No alerts found.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
