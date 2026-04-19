"use client"

import * as React from "react"
import Link from "next/link"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

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
import { StudentsTableSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useStudentsTable, type StudentTableRow } from "@/lib/api/hooks/analytics"

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const

type StudentsPageSize = 25 | 50 | 100

function isStudentsPageSize(n: number): n is StudentsPageSize {
  return n === 25 || n === 50 || n === 100
}

export function StudentsTableCard() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<StudentsPageSize>(25)
  const {
    studentsTable,
    isLoadingStudentsTable,
    isFetching,
    isError,
    error,
  } = useStudentsTable({
    page,
    limit: pageSize,
  })

  const rows: readonly StudentTableRow[] = studentsTable?.items ?? []
  const [stableTotal, setStableTotal] = React.useState(0)
  React.useEffect(() => {
    if (studentsTable?.total != null) setStableTotal(studentsTable.total)
  }, [studentsTable?.total])
  const total = studentsTable?.total ?? stableTotal
  const effectivePageSize = studentsTable?.limit ?? pageSize
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize))

  const handlePageSizeChange = React.useCallback((next: number) => {
    if (!isStudentsPageSize(next)) return
    setPageSize(next)
    setPage(1)
  }, [])

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const isLoading = isLoadingStudentsTable && rows.length === 0
  const showFetching = isFetching && rows.length > 0

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error instanceof Error ? error.message : "Failed to load students"}
      </p>
    )
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * effectivePageSize + 1
  const rangeEnd = Math.min(page * effectivePageSize, total)

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All students</CardTitle>
          <CardDescription>
            {total.toLocaleString()} total · page {page} of {totalPages} · select a student for detail
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <StudentsTableSkeleton rows={10} />
          ) : (
            <table
              className={`w-full min-w-[720px] text-sm transition-opacity ${showFetching ? "opacity-60" : ""}`}
              aria-busy={showFetching ? true : undefined}
            >
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Student ID</th>
                  <th className="pb-2 pr-3 font-medium">Name</th>
                  <th className="pb-2 pr-3 font-medium">College</th>
                  <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                  <th className="pb-2 pr-3 text-right font-medium">Latest</th>
                  <th className="pb-2 pr-3 text-right font-medium">Improvement</th>
                  <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                  <th className="pb-2 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.student_id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      <Link
                        href={`/dashboard/students/${encodeURIComponent(String(s.student_id))}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {s.student_id}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">
                      <Link
                        href={`/dashboard/students/${encodeURIComponent(String(s.student_id))}`}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{s.college}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.average_score ?? "—"}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.latest_score ?? "—"}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {s.improvement_percent != null ? (
                        <span
                          className={
                            s.improvement_percent >= 0 ? "text-emerald-600" : "text-red-500"
                          }
                        >
                          {s.improvement_percent > 0 ? "+" : ""}
                          {s.improvement_percent}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.interviews_count}</td>
                    <td className="py-2 text-muted-foreground">{s.last_active}</td>
                  </tr>
                ))}
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
