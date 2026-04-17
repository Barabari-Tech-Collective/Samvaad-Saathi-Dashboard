import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All students",
  description:
    "Student roster with scores, improvement, interview counts, and last active dates.",
}
import Link from "next/link"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  overviewKpis,
  students,
  countActiveStudentsLast30d,
  type StudentRow,
} from "@/lib/mock-data"

const totalInterviewsFromStudents = students.reduce((acc, s) => acc + s.interviewCount, 0)
const platformAvgStudentScore = +(
  students.reduce((acc, s) => acc + s.avgScore, 0) / students.length
).toFixed(1)

const kpiCards = [
  {
    label: "Total students",
    value: students.length.toLocaleString(),
    trend: "up" as const,
    footer: "All students in mock dataset",
  },
  {
    label: "Active students (30d)",
    value: countActiveStudentsLast30d().toLocaleString(),
    trend: "up" as const,
    footer: "Last active within 30 days",
  },
  {
    label: "Average score",
    value: platformAvgStudentScore.toFixed(1),
    trend: "up" as const,
    footer: "Mean of student average scores",
  },
  {
    label: "Total interviews",
    value: totalInterviewsFromStudents.toLocaleString(),
    trend: "up" as const,
    footer: "Sum of interview counts per student",
  },
  {
    label: "Overall improvement",
    value: `${overviewKpis.improvementPct}%`,
    trend: "up" as const,
    footer: "Platform trend (overview KPI)",
  },
  {
    label: "Completion rate",
    value: `${overviewKpis.avgCompletionRate}%`,
    trend: "up" as const,
    footer: "Sessions completed vs. started",
  },
]

export default function StudentsPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="@container/card">
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {kpi.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {kpi.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">{kpi.footer}</CardFooter>
          </Card>
        ))}
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All students</CardTitle>
            <CardDescription>
              {students.length} rows · select a student for detail
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Student ID</th>
                  <th className="pb-2 pr-3 font-medium">Name</th>
                  <th className="pb-2 pr-3 font-medium">College</th>
                  <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                  <th className="pb-2 pr-3 text-right font-medium">Latest</th>
                  <th className="pb-2 pr-3 text-right font-medium">Improvement (pts)</th>
                  <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                  <th className="pb-2 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: StudentRow) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      <Link
                        href={`/dashboard/students/${encodeURIComponent(s.id)}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {s.id}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">
                      <Link
                        href={`/dashboard/students/${encodeURIComponent(s.id)}`}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{s.college}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.avgScore}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.latestScore}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      <span className={s.improvementRate >= 0 ? "text-emerald-600" : "text-red-500"}>
                        {s.improvementRate > 0 ? "+" : ""}
                        {s.improvementRate}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.interviewCount}</td>
                    <td className="py-2 text-muted-foreground">{s.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
