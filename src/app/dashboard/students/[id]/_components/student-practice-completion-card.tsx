"use client"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatKpiDisplayValue } from "@/lib/kpi-format"
import { useStudentPracticeCompletion } from "@/lib/api/hooks/analytics"

export function StudentPracticeCompletionCard({ studentId }: Readonly<{ studentId: number | string }>) {
  const { practiceCompletion, isLoadingPracticeCompletion, isError, error } = useStudentPracticeCompletion(studentId)

  const kpis = practiceCompletion?.kpis ?? []

  if (isLoadingPracticeCompletion && !practiceCompletion) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base">Practice completion</CardTitle>
          <CardDescription className="text-destructive">
            {error instanceof Error ? error.message : "Could not load practice metrics."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (kpis.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Practice completion</CardTitle>
          <CardDescription>No practice metrics returned for this student.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Practice completion</CardTitle>
        <CardDescription>Exercises assigned versus completed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {kpis.map((k) => (
            <div
              key={k.key}
              className="rounded-lg border bg-muted/15 px-4 py-3 transition-colors hover:bg-muted/25"
            >
              <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{formatKpiDisplayValue(k)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
