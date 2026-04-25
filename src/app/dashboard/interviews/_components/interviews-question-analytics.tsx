"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuestionsAnalytics } from "@/lib/api/hooks/analytics"

export function InterviewsQuestionAnalytics() {
  const [page, setPage] = React.useState(1)
  const { questionsAnalytics, isLoadingQuestionsAnalytics } = useQuestionsAnalytics({ 
    page, 
    limit: 10 
  })

  const totalPages = questionsAnalytics?.total ? Math.ceil(questionsAnalytics.total / 10) : 1

  return (
    <Card id="question-analytics" className="flex flex-col @container/card">
      <CardHeader>
        <CardTitle>Question analytics</CardTitle>
        <CardDescription>Question-level performance and metadata.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {isLoadingQuestionsAnalytics ? (
          <Skeleton className="h-64 w-full rounded-md" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12.5">ID</TableHead>
                    <TableHead className="min-w-75">Question Text</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Attempts</TableHead>
                    <TableHead className="text-right">Avg Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(questionsAnalytics?.items ?? []).map((q) => (
                    <TableRow key={q.question_id}>
                      <TableCell className="text-muted-foreground">{q.question_id}</TableCell>
                      <TableCell className="font-medium">{q.question_text}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize whitespace-nowrap">
                          {q.question_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{q.attempts}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {q.average_score !== null ? q.average_score.toFixed(1) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!questionsAnalytics?.items || questionsAnalytics.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No question analytics found.
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
              <span className="text-sm text-muted-foreground px-2">
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
