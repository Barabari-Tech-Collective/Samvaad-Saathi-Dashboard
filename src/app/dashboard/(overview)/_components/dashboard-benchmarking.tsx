"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useBenchmarking } from "@/lib/api/hooks/analytics"
import * as React from "react"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardBenchmarking() {
  const { dateFilters } = useDashboardOverviewRange()
  const [page, setPage] = React.useState(1)
  const { benchmarking, isLoadingBenchmarking } = useBenchmarking({ ...dateFilters, page, limit: 5 })

  const totalPages = benchmarking?.total ? Math.ceil(benchmarking.total / 5) : 1

  return (
    <Card className="flex h-full flex-col @container/card">
      <CardHeader>
        <CardTitle>Benchmarking</CardTitle>
        <CardDescription>Comparison against baseline cohorts.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {isLoadingBenchmarking ? (
          <Skeleton className="h-64 w-full rounded-md" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Avg Score</TableHead>
                    <TableHead className="text-right">Platform Avg</TableHead>
                    <TableHead className="text-right">Delta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(benchmarking?.items ?? []).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="capitalize">{item.name}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.avg_score.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {item.platform_avg.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={item.delta > 0 ? "default" : item.delta < 0 ? "destructive" : "secondary"}
                        >
                          {item.delta > 0 ? "+" : ""}
                          {item.delta.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!benchmarking?.items || benchmarking.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No benchmarks found.
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
