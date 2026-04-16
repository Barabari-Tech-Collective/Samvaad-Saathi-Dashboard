import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getStudentById } from "@/lib/mock-data"

type PageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function StudentDetailPage({ params }: PageProps) {
  const { id } = await params
  const student = getStudentById(decodeURIComponent(id))

  if (!student) {
    notFound()
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
          <CardTitle>{student.name}</CardTitle>
          <CardDescription>
            {student.id} · {student.college} · {student.role}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Consistency: {student.consistency}</Badge>
            <Badge variant="outline">Practice: {student.practiceCompliance}%</Badge>
          </div>
          <p className="text-muted-foreground">
            Weak areas: {student.weakAreas.join(", ") || "None flagged"}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total interviews</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {student.interviewCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{student.avgScore}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Improvement</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {student.improvementRate > 0 ? "+" : ""}
            {student.improvementRate}%
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{student.latestScore}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last active</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{student.lastActive}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Practice completion</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {student.practiceCompliance}%
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Charts coming next</CardTitle>
          <CardDescription>
            Progress over time, speech vs knowledge, and interview history will connect here when APIs
            are available (see PRD student detail).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
