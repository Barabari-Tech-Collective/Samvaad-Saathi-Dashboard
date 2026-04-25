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
import {
  useBenchmarking,
  useDropoffFunnel,
  useForecasting,
  usePredictiveAlerts,
  useQuestionsAnalytics,
} from "@/lib/api/hooks/analytics"

function InsightsPageContent() {
  const { dateFilters } = useDashboardOverviewRange()

  const { predictiveAlerts, isLoadingPredictiveAlerts } = usePredictiveAlerts(dateFilters)
  const { benchmarking, isLoadingBenchmarking } = useBenchmarking(dateFilters)
  const { dropoffFunnel, isLoadingDropoffFunnel } = useDropoffFunnel(dateFilters)
  const { forecasting, isLoadingForecasting } = useForecasting({ days_ahead: 30 })
  
  const [qPage, setQPage] = React.useState(1)
  const { questionsAnalytics, isLoadingQuestionsAnalytics } = useQuestionsAnalytics({ 
    page: qPage, 
    limit: 10,
    ...dateFilters,
  })

  const qTotalPages = questionsAnalytics?.total ? Math.ceil(questionsAnalytics.total / 10) : 1

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Insights</h1>
          <p className="text-sm text-muted-foreground">
            Predictive signals, funnel dropoffs, benchmarking, forecasting, and question analytics.
          </p>
        </div>
        <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Predictive alerts</CardTitle>
            <CardDescription>Model-driven alerts and confidence signals.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPredictiveAlerts ? (
              <Skeleton className="h-32 w-full rounded-md" />
            ) : (
              <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
                {JSON.stringify((predictiveAlerts?.items ?? []).slice(0, 8), null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Benchmarking</CardTitle>
            <CardDescription>Comparison against baseline cohorts.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBenchmarking ? (
              <Skeleton className="h-32 w-full rounded-md" />
            ) : (
              <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
                {JSON.stringify((benchmarking?.items ?? []).slice(0, 8), null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dropoff funnel</CardTitle>
            <CardDescription>Stage-wise conversion and losses.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDropoffFunnel ? (
              <div className="space-y-2">
                 {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Stage</th>
                    <th className="pb-2 pr-3 text-right font-medium">Count</th>
                    <th className="pb-2 text-right font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {(dropoffFunnel?.stages ?? []).map((stage) => (
                    <tr key={stage.stage} className="border-b last:border-0">
                      <td className="py-2 pr-3">{stage.stage}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{stage.count}</td>
                      <td className="py-2 text-right tabular-nums">{stage.rate ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forecasting</CardTitle>
            <CardDescription>Projected trend and confidence band points.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingForecasting ? (
              <Skeleton className="h-32 w-full rounded-md" />
            ) : (
              <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
                {JSON.stringify((forecasting?.points ?? []).slice(0, 10), null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Question analytics</CardTitle>
            <CardDescription>Question-level performance and metadata.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            {isLoadingQuestionsAnalytics ? (
              <Skeleton className="h-40 w-full rounded-md" />
            ) : (
              <>
                <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
                  {JSON.stringify((questionsAnalytics?.items ?? []).slice(0, 10), null, 2)}
                </pre>
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQPage(Math.max(1, qPage - 1))}
                    disabled={qPage <= 1}
                  >
                    Prev
                  </Button>
                  <span className="text-xs text-muted-foreground px-2">
                    Page {qPage} of {Math.max(1, qTotalPages)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQPage(Math.min(qTotalPages, qPage + 1))}
                    disabled={qPage >= qTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function InsightsPage() {
  return (
    <DashboardOverviewProvider>
      <InsightsPageContent />
    </DashboardOverviewProvider>
  )
}
