"use client"

import * as React from "react"
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

import { colleges, collegesSummary, interviews, students } from "@/lib/mock-data"

const totalColleges = colleges.length
const totalStudents = students.length
const totalInterviews = interviews.length

const avgAcrossColleges = +(
  collegesSummary.reduce((acc, c) => acc + c.avgScore, 0) / collegesSummary.length
).toFixed(1)

const sortedByScore = [...collegesSummary].sort((a, b) => b.avgScore - a.avgScore)
const highestCollege = sortedByScore[0]?.college ?? "—"
const lowestCollege = sortedByScore[sortedByScore.length - 1]?.college ?? "—"

const kpiCards = [
  {
    label: "Total colleges",
    value: totalColleges.toLocaleString(),
    trend: "up" as const,
    footer: "Institutions in mock data",
  },
  {
    label: "Total students",
    value: totalStudents.toLocaleString(),
    trend: "up" as const,
    footer: "Across all colleges",
  },
  {
    label: "Total interviews",
    value: totalInterviews.toLocaleString(),
    trend: "up" as const,
    footer: "All sessions (mock)",
  },
  {
    label: "Average score",
    value: avgAcrossColleges.toFixed(1),
    trend: "up" as const,
    footer: "Mean of college averages",
  },
  {
    label: "Highest performing",
    value: highestCollege,
    trend: "up" as const,
    footer: "By average score",
  },
  {
    label: "Lowest performing",
    value: lowestCollege,
    trend: "down" as const,
    footer: "By average score",
  },
]

export default function CollegesPage() {
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
            <CardTitle className="text-base">Colleges</CardTitle>
            <CardDescription>Performance snapshot by institution</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">College</th>
                  <th className="pb-2 pr-3 text-right font-medium">Students</th>
                  <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                  <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                  <th className="pb-2 pr-3 text-right font-medium">Avg Δ (pts)</th>
                  <th className="pb-2 text-right font-medium">Active (30d)</th>
                </tr>
              </thead>
              <tbody>
                {collegesSummary.map((row) => (
                  <tr key={row.college} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">{row.college}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.studentsCount}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.interviewsCount}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.avgScore}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {row.improvementPct > 0 ? "+" : ""}
                      {row.improvementPct}
                    </td>
                    <td className="py-2 text-right tabular-nums">{row.activeUsersLast30d}</td>
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
