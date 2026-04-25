"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { usePredictiveAlerts } from "@/lib/api/hooks/analytics"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardPredictiveAlerts() {
  const { dateFilters } = useDashboardOverviewRange()
  const [page, setPage] = React.useState(1)
  const { predictiveAlerts, isLoadingPredictiveAlerts } = usePredictiveAlerts({ ...dateFilters, page, limit: 5 })

  const totalPages = predictiveAlerts?.total ? Math.ceil(predictiveAlerts.total / 5) : 1

  return (
    <Card className="flex h-full flex-col @container/card">
      <CardHeader>
        <CardTitle>Predictive alerts</CardTitle>
        <CardDescription>Model-driven alerts and confidence signals.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {isLoadingPredictiveAlerts ? (
          <Skeleton className="h-64 w-full rounded-md" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Prediction</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(predictiveAlerts?.items ?? []).map((alert, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {alert.entity_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {alert.prediction?.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        {alert.confidence ? `${(alert.confidence * 100).toFixed(0)}%` : "—"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={alert.message}>
                        {alert.message}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!predictiveAlerts?.items || predictiveAlerts.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No alerts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
