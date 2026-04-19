"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StudentDetailSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useStudentProfile, useStudentSummary } from "@/lib/api/hooks/analytics"

function parseStudentId(raw: string): number | string {
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : raw
}

export function StudentDetailClient({ studentIdParam }: Readonly<{ studentIdParam: string }>) {
  const studentId = React.useMemo(() => parseStudentId(studentIdParam), [studentIdParam])
  const { studentProfile, isLoadingStudentProfile, isError, error } = useStudentProfile(studentId)
  const { studentSummary, isLoadingStudentSummary } = useStudentSummary(studentId)

  const loading = isLoadingStudentProfile || isLoadingStudentSummary

  if (isError) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load student"}
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/students">Back to all students</Link>
        </Button>
      </div>
    )
  }

  if (loading && !studentProfile) {
    return <StudentDetailSkeleton />
  }

  if (!studentProfile) {
    return null
  }

  const kpis = studentSummary?.kpis ?? []

  function kpiValue(key: string): string {
    const row = kpis.find((k) => k.key === key)
    if (!row) return "—"
    if (row.value === null || row.value === undefined) return "—"
    return String(row.value)
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/students">Back to all students</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{studentProfile.name}</CardTitle>
          <CardDescription>
            {studentProfile.studentId} · {studentProfile.college} · {studentProfile.targetPosition ?? "—"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Email: {studentProfile.email}</Badge>
            {studentProfile.degree ? (
              <Badge variant="outline">{studentProfile.degree}</Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total interviews</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{kpiValue("total_interviews")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{kpiValue("average_score")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Improvement</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{kpiValue("improvement_percent")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last active</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {kpiValue("last_active_date")}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">More analytics</CardTitle>
          <CardDescription>
            Score history, interviews list, and practice metrics use the same student hooks (
            <code className="text-xs">useStudentScoreHistory</code>, etc.).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
