"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  overviewKpis,
  students,
  studentSkillBreakdown,
  type StudentRow,
} from "@/lib/mock-data"

const consistencyDistribution = [
  { label: "Stable", count: students.filter((s) => s.consistency === "Stable").length },
  { label: "Improving", count: students.filter((s) => s.consistency === "Improving").length },
  { label: "Fluctuating", count: students.filter((s) => s.consistency === "Fluctuating").length },
]

const consistencyConfig = {
  count: { label: "Students", color: "var(--primary)" },
} satisfies ChartConfig

const speechConfig = {
  value: { label: "Score", color: "var(--primary)" },
} satisfies ChartConfig

const knowledgeConfig = {
  value: { label: "Score", color: "var(--chart-2)" },
} satisfies ChartConfig

const kpiCards = [
  {
    label: "Total Students",
    value: overviewKpis.totalUsers.toLocaleString(),
    trend: "up" as const,
    footer: "Registered on platform",
  },
  {
    label: "Practice Compliance",
    value: `${overviewKpis.practiceComplianceRate}%`,
    trend: overviewKpis.practiceComplianceRate > 50 ? ("up" as const) : ("down" as const),
    footer: "Recommended exercises completed",
  },
  {
    label: "Avg Improvement Rate",
    value: `+${overviewKpis.avgImprovementRate} pts`,
    trend: "up" as const,
    footer: "(Latest − First) score per student",
  },
  {
    label: "Avg Interviews / Student",
    value: (overviewKpis.totalInterviews / overviewKpis.totalUsers).toFixed(1),
    trend: "up" as const,
    footer: "Across all students",
  },
]

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
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

      {/* Skill breakdown radars + consistency */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Speech Skills (Platform Avg)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={speechConfig} className="mx-auto aspect-square max-h-[260px]">
              <RadarChart data={studentSkillBreakdown.speech}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Radar dataKey="value" fill="var(--color-value)" fillOpacity={0.5} stroke="var(--color-value)" />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Knowledge Skills (Platform Avg)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={knowledgeConfig} className="mx-auto aspect-square max-h-[260px]">
              <RadarChart data={studentSkillBreakdown.knowledge}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Radar dataKey="value" fill="var(--color-value)" fillOpacity={0.5} stroke="var(--color-value)" />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Consistency Distribution</CardTitle>
            <CardDescription>How stable are student scores?</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={consistencyConfig} className="aspect-auto h-[220px] w-full">
              <BarChart data={consistencyDistribution} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Students</CardTitle>
            <CardDescription>60 students across 8 colleges</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">College</th>
                  <th className="pb-2 pr-4 font-medium">Role</th>
                  <th className="pb-2 pr-4 font-medium text-right">Latest</th>
                  <th className="pb-2 pr-4 font-medium text-right">Avg</th>
                  <th className="pb-2 pr-4 font-medium text-right">Best</th>
                  <th className="pb-2 pr-4 font-medium text-right">Improvement</th>
                  <th className="pb-2 pr-4 font-medium">Consistency</th>
                  <th className="pb-2 font-medium">Weak Areas</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: StudentRow) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{s.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.college}</td>
                    <td className="py-2 pr-4">{s.role}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{s.latestScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{s.avgScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{s.bestScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">
                      <span className={s.improvementRate >= 0 ? "text-emerald-600" : "text-red-500"}>
                        {s.improvementRate > 0 ? "+" : ""}{s.improvementRate}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline">{s.consistency}</Badge>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {s.weakAreas.map((w) => (
                          <Badge key={w} variant="secondary" className="text-xs">{w}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
