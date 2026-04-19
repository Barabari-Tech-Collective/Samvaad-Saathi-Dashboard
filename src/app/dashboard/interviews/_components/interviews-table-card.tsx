"use client"

import * as React from "react"
import Link from "next/link"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
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
import { DashboardRecentTableSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useInterviewsTable, type InterviewTableRow } from "@/lib/api/hooks/analytics"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import { formatInterviewListDuration } from "@/lib/kpi-format"

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const

type InterviewsPageSize = 25 | 50 | 100

function isInterviewsPageSize(n: number): n is InterviewsPageSize {
  return n === 25 || n === 50 || n === 100
}

export function InterviewsTableCard() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<InterviewsPageSize>(25)
  const {
    interviewsTable,
    isLoadingInterviewsTable,
    isFetching,
    isError,
    error,
  } = useInterviewsTable({
    page,
    limit: pageSize,
  })

  const rows: readonly InterviewTableRow[] = interviewsTable?.items ?? []
  const [stableTotal, setStableTotal] = React.useState(0)
  React.useEffect(() => {
    if (interviewsTable?.total != null) setStableTotal(interviewsTable.total)
  }, [interviewsTable?.total])
  const total = interviewsTable?.total ?? stableTotal
  const effectivePageSize = interviewsTable?.limit ?? pageSize
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize))

  const handlePageSizeChange = React.useCallback((next: number) => {
    if (!isInterviewsPageSize(next)) return
    setPageSize(next)
    setPage(1)
  }, [])

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const isLoading = isLoadingInterviewsTable && rows.length === 0
  const showFetching = isFetching && rows.length > 0

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load interviews"}
      </p>
    )
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * effectivePageSize + 1
  const rangeEnd = Math.min(page * effectivePageSize, total)

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All interviews</CardTitle>
          <CardDescription>
            {total.toLocaleString()} total · page {page} of {totalPages} · select an interview for
            detail
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <DashboardRecentTableSkeleton rows={8} />
          ) : (
            <table
              className={`w-full min-w-[880px] text-sm transition-opacity ${showFetching ? "opacity-60" : ""}`}
              aria-busy={showFetching ? true : undefined}
            >
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Interview ID</th>
                  <th className="pb-2 pr-3 font-medium">Student</th>
                  <th className="pb-2 pr-3 font-medium">College</th>
                  <th className="pb-2 pr-3 font-medium">Role</th>
                  <th className="pb-2 pr-3 font-medium">Difficulty</th>
                  <th className="pb-2 pr-3 text-right font-medium">Score</th>
                  <th className="pb-2 pr-3 text-right font-medium">Duration</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const idStr = String(row.interview_id)
                  const href = `/dashboard/interviews/${encodeURIComponent(idStr)}`
                  return (
                    <tr key={row.interview_id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                        <Link href={href} className="text-primary underline-offset-4 hover:underline">
                          {row.interview_id}
                        </Link>
                      </td>
                      <td className="py-2 pr-3">
                        <Link
                          href={href}
                          className="font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          {row.student_name}
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{row.college}</td>
                      <td className="py-2 pr-3">{row.role}</td>
                      <td className="py-2 pr-3">
                        <Badge variant="outline" className="capitalize">
                          {row.difficulty}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums font-medium">
                        {row.score ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {formatInterviewListDuration(row.duration)}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {row.date ? formatDashboardDateTime(row.date) : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
        {!isLoading || rows.length > 0 ? (
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
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Rows per page
                </span>
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
