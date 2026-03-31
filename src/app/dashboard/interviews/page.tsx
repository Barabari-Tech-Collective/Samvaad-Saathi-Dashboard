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
  questionTypePerformance,
  type InterviewRow,
} from "@/lib/mock-data"

const difficultyConfig = {
  avgScore: { label: "Avg Score", color: "var(--primary)" },
  completionRate: { label: "Completion %", color: "var(--chart-2)" },
} satisfies ChartConfig

const questionConfig = {
  avgKnowledge: { label: "Knowledge", color: "var(--primary)" },
  avgSpeech: { label: "Speech", color: "var(--chart-2)" },
  followUpPct: { label: "Follow-up %", color: "var(--chart-4)" },
} satisfies ChartConfig

const kpiCards = [
  {
    label: "Total Interviews",
    value: overviewKpis.totalInterviews.toLocaleString(),
    trend: "up" as const,
    footer: "Sessions conducted",
  },
  {
    label: "Avg Completion Rate",
    value: `${overviewKpis.avgCompletionRate}%`,
    trend: "up" as const,
    footer: "Of started interviews",
  },
  {
    label: "Avg Score",
    value: overviewKpis.avgScore.toFixed(1),
    trend: "up" as const,
    footer: "Speech + Knowledge combined",
  },
  {
    label: "Follow-up Trigger Rate",
    value: "29%",
    trend: "down" as const,
    footer: "Questions leading to follow-ups",
  },
]

export default function InterviewsPage() {
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance by Difficulty</CardTitle>
            <CardDescription>Average score and completion rate per difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={difficultyConfig} className="aspect-auto h-[260px] w-full">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question Type Performance</CardTitle>
            <CardDescription>Knowledge, speech, and follow-up rates by question type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={questionConfig} className="aspect-auto h-[260px] w-full">
              <BarChart data={questionTypePerformance}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgKnowledge" fill="var(--color-avgKnowledge)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgSpeech" fill="var(--color-avgSpeech)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="followUpPct" fill="var(--color-followUpPct)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interview table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Interviews</CardTitle>
            <CardDescription>Showing last 30 sessions</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">ID</th>
                  <th className="pb-2 pr-4 font-medium">Student</th>
                  <th className="pb-2 pr-4 font-medium">Role</th>
                  <th className="pb-2 pr-4 font-medium">Difficulty</th>
                  <th className="pb-2 pr-4 font-medium text-right">Total</th>
                  <th className="pb-2 pr-4 font-medium text-right">Speech</th>
                  <th className="pb-2 pr-4 font-medium text-right">Knowledge</th>
                  <th className="pb-2 pr-4 font-medium text-right">Duration</th>
                  <th className="pb-2 pr-4 font-medium text-right">Completion</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {interviews.slice(0, 30).map((row: InterviewRow) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">{row.id}</td>
                    <td className="py-2 pr-4">{row.studentName}</td>
                    <td className="py-2 pr-4">{row.role}</td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline">{row.difficulty}</Badge>
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums font-medium">{row.totalScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.speechScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.knowledgeScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.duration}m</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.completionRate}%</td>
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
