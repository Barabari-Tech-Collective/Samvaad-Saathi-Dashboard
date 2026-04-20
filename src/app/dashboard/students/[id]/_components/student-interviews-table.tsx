"use client"

import { Link } from "next-view-transitions"
import * as React from "react"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useStudentInterviews } from "@/lib/api/hooks/analytics"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import { isCompletedBatchInterviewStatus } from "@/lib/interview-display"
import { formatDurationSeconds } from "@/lib/kpi-format"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 20

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
    const s = status.toLowerCase()
    if (s === "completed") return "outline"
    if (s === "active") return "default"
    if (s === "failed" || s === "cancelled") return "destructive"
    return "outline"
}

export function StudentInterviewsTable({ studentId }: Readonly<{ studentId: number | string }>) {
    const [page, setPage] = React.useState(1)
    const { studentInterviews, isLoadingStudentInterviews, isError, error, isFetching } = useStudentInterviews(
        studentId,
        { page, limit: PAGE_SIZE },
    )

    React.useEffect(() => {
        setPage(1)
    }, [studentId])

    const total = studentInterviews?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const items = studentInterviews?.items ?? []

    React.useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
                <div>
                    <CardTitle className="text-base">Interviews</CardTitle>
                    <CardDescription>
                        {total > 0 ? (
                            <>
                                Showing {items.length} of {total} interview{total === 1 ? "" : "s"}
                            </>
                        ) : (
                            "All interviews for this learner"
                        )}
                    </CardDescription>
                </div>
                {totalPages > 1 ? (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={page <= 1 || isFetching}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <span className="text-xs tabular-nums text-muted-foreground">
                            Page {page} / {totalPages}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages || isFetching}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                ) : null}
            </CardHeader>
            <CardContent>
                {isLoadingStudentInterviews && !studentInterviews ? (
                    <div className="space-y-2" role="status" aria-label="Loading interviews">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-md" />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-sm text-destructive">
                        {error instanceof Error ? error.message : "Could not load interviews."}
                    </p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No interviews found for this student.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="w-[100px]">Difficulty</TableHead>
                                <TableHead className="w-[110px]">Status</TableHead>
                                <TableHead className="w-[90px] text-right">Score</TableHead>
                                <TableHead className="w-[100px] text-right">Duration</TableHead>
                                <TableHead className="w-[160px] min-w-[140px]">Started</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((row) => (
                                <TableRow
                                    key={row.interview_id}
                                    className={
                                        isCompletedBatchInterviewStatus(row.status)
                                            ? "bg-emerald-500/10 dark:bg-emerald-500/15"
                                            : undefined
                                    }
                                >
                                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                        <Link
                                            href={`/dashboard/interviews/${encodeURIComponent(String(row.interview_id))}`}
                                            className="text-primary underline-offset-4 hover:underline"
                                        >
                                            #{row.interview_id}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-medium">{row.role}</TableCell>
                                    <TableCell>
                                        <DifficultyBadge difficulty={row.difficulty} />
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusVariant(row.status)}
                                            className={cn(
                                                "capitalize",
                                                row.status.toLowerCase() === "completed" &&
                                                "border-transparent bg-green-700 text-green-900 dark:bg-green-700 dark:text-green-50",
                                            )}
                                        >
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {row.score === null || row.score === undefined ? (
                                            <span className="text-muted-foreground">—</span>
                                        ) : (
                                            row.score
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {formatDurationSeconds(row.duration_seconds)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground tabular-nums">
                                        {formatDashboardDateTime(row.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {isFetching && studentInterviews ? (
                    <p className={cn("mt-2 text-xs text-muted-foreground", "motion-safe:animate-pulse")}>Updating…</p>
                ) : null}
            </CardContent>
        </Card>
    )
}
