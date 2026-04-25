import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type RankingSectionProps = Readonly<{
  title: string
  description: string
  rows: readonly {
    student_id: number
    name: string
    college: string
    average_score: number | null
    improvement_percent: number | null
    interviews_count: number
  }[]
  loading: boolean
  page: number
  setPage: (p: number) => void
  totalItems?: number
}>

export function RankingSection({ title, description, rows, loading, page, setPage, totalItems }: RankingSectionProps) {
  const totalPages = totalItems ? Math.ceil(totalItems / 10) : 1

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto flex-1 flex flex-col justify-between space-y-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Student</th>
                <th className="pb-2 pr-3 font-medium">College</th>
                <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                <th className="pb-2 pr-3 text-right font-medium">Improvement</th>
                <th className="pb-2 text-right font-medium">Interviews</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.student_id} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium">
                    <Link href={`/dashboard/students/${row.student_id}`} className="hover:underline hover:text-primary">
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    {row.college ? (
                      <Link href={`/dashboard/colleges/${encodeURIComponent(row.college)}`} className="hover:underline hover:text-primary">
                        {row.college}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.average_score ?? "—"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.improvement_percent ?? "—"}</td>
                  <td className="py-2 text-right tabular-nums">{row.interviews_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && rows.length > 0 && (
          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
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
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
