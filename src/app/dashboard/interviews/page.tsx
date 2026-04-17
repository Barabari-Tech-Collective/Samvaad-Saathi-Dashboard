"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
  interviews,
  interviewsByDifficulty,
  mockAvgInterviewDuration,
  mockPopularInterviewDifficulty,
  mockPopularInterviewRole,
  type InterviewRow,
} from "@/lib/mock-data"

const difficultyConfig = {
  avgScore: { label: "Avg score", color: "var(--primary)" },
  completionRate: { label: "Completion %", color: "var(--chart-2)" },
} satisfies ChartConfig

const LIST_LIMIT = 50

const kpiCards = [
  {
    label: "Total interviews",
    value: overviewKpis.totalInterviews.toLocaleString(),
    trend: "up" as const,
    footer: "Platform total (overview)",
  },
  {
    label: "Average score",
    value: overviewKpis.avgScore.toFixed(1),
    trend: "up" as const,
    footer: "Across all sessions",
  },
  {
    label: "Completion rate",
    value: `${overviewKpis.avgCompletionRate}%`,
    trend: "up" as const,
    footer: "Finished vs. started",
  },
  {
    label: "Average duration",
    value: `${mockAvgInterviewDuration} min`,
    trend: "up" as const,
    footer: "Mean session length (mock sample)",
  },
  {
    label: "Most popular role",
    value: mockPopularInterviewRole,
    trend: "up" as const,
    footer: "By session count in mock data",
  },
  {
    label: "Most popular difficulty",
    value: mockPopularInterviewDifficulty,
    trend: "up" as const,
    footer: "By session count in mock data",
  },
]

export default function InterviewsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
            <CardTitle className="text-base">Average score by difficulty</CardTitle>
            <CardDescription>Score and completion rate by difficulty band</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={difficultyConfig} className="aspect-auto h-[240px] w-full">
              <BarChart data={interviewsByDifficulty}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="difficulty" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All interviews</CardTitle>
            <CardDescription>
              Showing {Math.min(LIST_LIMIT, interviews.length)} of {interviews.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Interview ID</th>
                  <th className="pb-2 pr-3 font-medium">Student</th>
                  <th className="pb-2 pr-3 font-medium">College</th>
                  <th className="pb-2 pr-3 font-medium">Role</th>
                  <th className="pb-2 pr-3 font-medium">Difficulty</th>
                  <th className="pb-2 pr-3 text-right font-medium">Score</th>
                  <th className="pb-2 pr-3 text-right font-medium">Duration</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {interviews.slice(0, LIST_LIMIT).map((row: InterviewRow) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{row.id}</td>
                    <td className="py-2 pr-3 font-medium">{row.studentName}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{row.college}</td>
                    <td className="py-2 pr-3">{row.role}</td>
                    <td className="py-2 pr-3">
                      <Badge variant="outline">{row.difficulty}</Badge>
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums font-medium">{row.totalScore}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.duration} min</td>
                    <td className="py-2 text-muted-foreground">{row.date}</td>
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
