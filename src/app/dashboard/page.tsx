"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { useIsMobile } from "@/hooks/use-mobile"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import {
  overviewKpis,
  overviewTimeSeries,
  topStudents,
  strugglingStudents,
  mostImprovedStudents,
} from "@/lib/mock-data"

const chartConfig = {
  avgScore: { label: "Avg Score", color: "var(--primary)" },
  activeUsers: { label: "Active Users", color: "var(--chart-2)" },
} satisfies ChartConfig

const kpiCards = [
  {
    label: "Total Users",
    value: overviewKpis.totalUsers.toLocaleString(),
    badge: "+12.5%",
    trend: "up" as const,
    footer: "Registered on the platform",
  },
  {
    label: "Active Users",
    value: overviewKpis.activeUsers.toLocaleString(),
    badge: `${((overviewKpis.activeUsers / overviewKpis.totalUsers) * 100).toFixed(0)}% of total`,
    trend: "up" as const,
    footer: "Practiced in the last 30 days",
  },
  {
    label: "Average Score",
    value: overviewKpis.avgScore.toFixed(1),
    badge: `+${overviewKpis.avgImprovementRate}pts`,
    trend: "up" as const,
    footer: "Across all interviews",
  },
  {
    label: "Improvement %",
    value: `${overviewKpis.improvementPct}%`,
    badge: `+${overviewKpis.improvementPct}%`,
    trend: "up" as const,
    footer: "Students showing upward trend",
  },
]

export default function OverviewPage() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const refDate = new Date("2024-06-30")
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90
    const start = new Date(refDate)
    start.setDate(start.getDate() - days)
    return overviewTimeSeries.filter((d) => new Date(d.date) >= start)
  }, [timeRange])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* KPI cards */}
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
                  {kpi.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">{kpi.footer}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Score trend chart */}
      <div className="px-4 lg:px-6">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Average Score Trend</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">Platform average score over the last 3 months</span>
              <span className="@[540px]/card:hidden">Last 3 months</span>
            </CardDescription>
            <CardAction>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
              >
                <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
                  <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                  <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-avgScore)" stopOpacity={1.0} />
                    <stop offset="95%" stopColor="var(--color-avgScore)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) =>
                        new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="avgScore"
                  type="natural"
                  fill="url(#fillScore)"
                  stroke="var(--color-avgScore)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student lists */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-3">
        <StudentList title="Top Students" students={topStudents} accentColor="text-emerald-600" />
        <StudentList title="Struggling Students" students={strugglingStudents} accentColor="text-red-500" />
        <StudentList title="Most Improved" students={mostImprovedStudents} accentColor="text-blue-500" />
      </div>
    </div>
  )
}

function StudentList({
  title,
  students,
  accentColor,
}: {
  title: string
  students: typeof topStudents
  accentColor: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {students.slice(0, 5).map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <div>
              <span className="font-medium">{s.name}</span>
              <span className="ml-2 text-muted-foreground">{s.college}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold tabular-nums ${accentColor}`}>
                {s.latestScore}
              </span>
              <Badge variant="outline" className="text-xs">
                {s.improvementRate > 0 ? "+" : ""}
                {s.improvementRate}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
