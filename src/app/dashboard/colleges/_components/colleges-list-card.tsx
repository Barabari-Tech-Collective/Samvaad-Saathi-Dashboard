"use client"

import * as React from "react"
import { Link } from "next-view-transitions"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { StudentsTableSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCollegesTable } from "@/lib/api/hooks/analytics"

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const

type CollegesPageSize = 25 | 50 | 100

function isCollegesPageSize(n: number): n is CollegesPageSize {
  return n === 25 || n === 50 || n === 100
}

export function CollegesListCard() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<CollegesPageSize>(25)

  const {
    collegesTable,
    isLoadingCollegesTable,
    isFetching,
    isError,
    error,
  } = useCollegesTable({
    page,
    limit: pageSize,
  })

  const rows = collegesTable?.items ?? []
  const [stableTotal, setStableTotal] = React.useState(0)
  React.useEffect(() => {
    if (collegesTable?.total != null) setStableTotal(collegesTable.total)
  }, [collegesTable?.total])
  const total = collegesTable?.total ?? stableTotal
  const effectivePageSize = collegesTable?.limit ?? pageSize
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize))

  const handlePageSizeChange = React.useCallback((next: number) => {
    if (!isCollegesPageSize(next)) return
    setPageSize(next)
    setPage(1)
  }, [])

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const loading = isLoadingCollegesTable && rows.length === 0
  const showFetching = isFetching && rows.length > 0

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load colleges"}
      </p>
    )
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * effectivePageSize + 1
  const rangeEnd = Math.min(page * effectivePageSize, total)

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colleges</CardTitle>
          <CardDescription>
            Performance snapshot by institution · {total.toLocaleString()} total · page {page} of{" "}
            {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <StudentsTableSkeleton rows={8} />
          ) : (
            <table
              className={`w-full min-w-[640px] text-sm transition-opacity ${showFetching ? "opacity-60" : ""}`}
              aria-busy={showFetching ? true : undefined}
            >
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">College</th>
                  <th className="pb-2 pr-3 text-right font-medium">Students</th>
                  <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                  <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                  <th className="pb-2 pr-3 text-right font-medium">Improvement %</th>
                  <th className="pb-2 text-right font-medium">Active users</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.college_name} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">
                      <Link
                        href={`/dashboard/colleges/${encodeURIComponent(row.college_name)}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {row.college_name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.students_count}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.interviews_count}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {row.avg_score != null ? row.avg_score.toFixed(2) : "—"}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {row.improvement_percent != null ? (
                        <>
                          {row.improvement_percent > 0 ? "+" : ""}
                          {row.improvement_percent}%
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 text-right tabular-nums">{row.active_users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
        {!loading || rows.length > 0 ? (
          <CardFooter className="flex flex-col gap-3 border-t sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="tabular-nums text-foreground">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of <span className="tabular-nums text-foreground">{total.toLocaleString()}</span>
                {showFetching ? <span className="ml-2">· Updating…</span> : null}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
                <Select
                  value={String(effectivePageSize)}
                  onValueChange={(v) => handlePageSizeChange(Number(v))}
                  disabled={showFetching}
                >
                  <SelectTrigger size="sm" className="w-22">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || showFetching}
                onClick={() => setPage(page - 1)}
              >
                <IconChevronLeft />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages || showFetching}
                onClick={() => setPage(page + 1)}
              >
                Next
                <IconChevronRight />
              </Button>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
