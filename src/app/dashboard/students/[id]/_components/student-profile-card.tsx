"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import { useStudentProfile } from "@/lib/api/hooks/analytics"

export function StudentProfileCard({ studentId }: Readonly<{ studentId: number | string }>) {
  const { studentProfile, isLoadingStudentProfile, isError, error } = useStudentProfile(studentId)

  if (isLoadingStudentProfile && !studentProfile) {
    return (
      <Card className="@container/card">
        <CardHeader className="gap-2">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription className="text-destructive">
            {error instanceof Error ? error.message : "Could not load profile."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!studentProfile) {
    return null
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">{studentProfile.name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="tabular-nums">ID {studentProfile.studentId}</span>
          <span aria-hidden className="text-muted-foreground/80">
            ·
          </span>
          {studentProfile.college ? (
            <Link
              href={`/dashboard/colleges/${encodeURIComponent(studentProfile.college)}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {studentProfile.college}
            </Link>
          ) : (
            "—"
          )}
          <span aria-hidden className="text-muted-foreground/80">
            ·
          </span>
          <span>{studentProfile.targetPosition ?? "No target role"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-normal">
            {studentProfile.email}
          </Badge>
          {studentProfile.degree ? <Badge variant="outline">{studentProfile.degree}</Badge> : null}
          {studentProfile.yearsExperience != null ? (
            <Badge variant="outline">{studentProfile.yearsExperience} yrs exp.</Badge>
          ) : null}
          {studentProfile.company ? <Badge variant="outline">{studentProfile.company}</Badge> : null}
        </div>
        <dl className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border bg-muted/20 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Joined</dt>
            <dd className="font-medium tabular-nums">{formatDashboardDateTime(studentProfile.createdAt)}</dd>
          </div>
          <div className="rounded-md border bg-muted/20 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Last active</dt>
            <dd className="font-medium tabular-nums">{formatDashboardDateTime(studentProfile.lastActive)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
