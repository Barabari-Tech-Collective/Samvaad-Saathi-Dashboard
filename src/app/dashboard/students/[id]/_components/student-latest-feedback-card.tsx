"use client"

import * as React from "react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import { useStudentLatestFeedback } from "@/lib/api/hooks/analytics"

import { StudentDetailEmpty } from "./student-detail-empty"

export function StudentLatestFeedbackCard({ studentId }: Readonly<{ studentId: number | string }>) {
  const { latestFeedback, isLoadingLatestFeedback, isError, error } = useStudentLatestFeedback(studentId)

  const feedbackText = latestFeedback?.latestFeedback?.trim() ?? ""
  const hasText = Boolean(feedbackText)

  if (isLoadingLatestFeedback && !latestFeedback) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-md" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base">Latest feedback</CardTitle>
          <CardDescription className="text-destructive">
            {error instanceof Error ? error.message : "Could not load feedback."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!hasText || !latestFeedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latest feedback</CardTitle>
          <CardDescription>Most recent interview feedback snippet</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentDetailEmpty
            className="py-8"
            title="No feedback recorded"
            description="Feedback will show here when the latest interview includes evaluator notes."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Latest feedback</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
          {latestFeedback.interviewId != null ? (
            <Link
              href={`/dashboard/interviews/${encodeURIComponent(String(latestFeedback.interviewId))}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Interview #{latestFeedback.interviewId}
            </Link>
          ) : (
            "Feedback"
          )}
          {latestFeedback.createdAt ? ` · ${formatDashboardDateTime(latestFeedback.createdAt)}` : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <blockquote className="rounded-lg border bg-muted/20 px-4 py-3 text-sm leading-relaxed">
          {feedbackText}
        </blockquote>
      </CardContent>
    </Card>
  )
}
