"use client"

import * as React from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  scoreDistribution,
  segmentByCollege,
  interviewsCountByRole,
  recentInterviews,
  recentlyAddedStudents,
  studentAttentionAlerts,
} from "@/lib/mock-data"

const trendConfig = {
  interviewCount: { label: "Interviews", color: "var(--primary)" },
  activeUsers: { label: "Active users", color: "var(--chart-2)" },
} satisfies ChartConfig

const rolesChartConfig = {
  count: { label: "Interviews", color: "var(--primary)" },
} satisfies ChartConfig

const collegesChartConfig = {
  studentCount: { label: "Students", color: "var(--chart-3)" },
} satisfies ChartConfig

const scoreDistConfig = {
  count: { label: "Students", color: "var(--chart-4)" },
} satisfies ChartConfig

const topRolesByVolume = [...interviewsCountByRole]
  .sort((a, b) => b.count - a.count)
  .slice(0, 6)

const topCollegesSnapshot = [...segmentByCollege]
  .sort((a, b) => b.studentCount - a.studentCount)
  .slice(0, 6)

const kpiCards = [
  {
    label: "Total students",
    value: overviewKpis.totalUsers.toLocaleString(),
    badge: "registered",
    trend: "up" as const,
    footer: "All-time sign-ups on the platform",
  },
  {
    label: "Active users",
    value: overviewKpis.activeUsers.toLocaleString(),
    badge: "30d window",
    trend: "up" as const,
    footer: "Students active in the selected reporting period",
  },
  {
    label: "Total interviews",
    value: overviewKpis.totalInterviews.toLocaleString(),
    badge: "sessions",
    trend: "up" as const,
    footer: "Completed and in-progress sessions counted",
  },
  {
    label: "Average score",
    value: overviewKpis.avgScore.toFixed(1),
    badge: "platform",
    trend: "up" as const,
    footer: "Mean score across all interviews",
  },
  {
    label: "Improvement",
    value: `${overviewKpis.improvementPct}%`,
    badge: "trending up",
    trend: "up" as const,
    footer: "Share of students with upward score trajectory",
  },
  {
    label: "Completion rate",
    value: `${overviewKpis.avgCompletionRate}%`,
    badge: "sessions",
    trend: "up" as const,
    footer: "Interviews finished vs. started",
  },
]

export default function DashboardPage() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredTrend = React.useMemo(() => {
    const refDate = new Date("2024-06-30")
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90
    const start = new Date(refDate)
    start.setDate(start.getDate() - days)
    return overviewTimeSeries.filter((d) => new Date(d.date) >= start)
  }, [timeRange])

  const rangeToggle = (
    <>
      <ToggleGroup
        type="single"
        value={timeRange}
        onValueChange={(v) => v && setTimeRange(v)}
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
          aria-label="Time range"
        >
          <SelectValue placeholder="Last 3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="90d" className="rounded-lg">
            Last 3 months
          </SelectItem>
          <SelectItem value="30d" className="rounded-lg">
            Last 30 days
          </SelectItem>
          <SelectItem value="7d" className="rounded-lg">
            Last 7 days
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  )

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

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Interviews per day</CardTitle>
            <CardDescription>Session volume over the selected period</CardDescription>
            <CardAction>{rangeToggle}</CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-0 sm:px-6">
            <ChartContainer config={trendConfig} className="aspect-auto h-[220px] w-full">
              <LineChart data={filteredTrend} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) =>
                        new Date(v as string).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="interviewCount"
                  stroke="var(--color-interviewCount)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Active users trend</CardTitle>
            <CardDescription>Daily active learners (mock series)</CardDescription>
            <CardAction>{rangeToggle}</CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-0 sm:px-6">
            <ChartContainer config={trendConfig} className="aspect-auto h-[220px] w-full">
              <AreaChart data={filteredTrend} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="fillActiveUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-activeUsers)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-activeUsers)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) =>
                        new Date(v as string).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                  }
                />
                <Area
                  dataKey="activeUsers"
                  type="natural"
                  fill="url(#fillActiveUsers)"
                  stroke="var(--color-activeUsers)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top roles</CardTitle>
            <CardDescription>Interview volume by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={rolesChartConfig} className="aspect-auto h-[200px] w-full">
              <BarChart data={topRolesByVolume} layout="vertical" margin={{ left: 4, right: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="role"
                  tickLine={false}
                  axisLine={false}
                  width={88}
                  tickFormatter={(v) => (String(v).length > 12 ? `${String(v).slice(0, 11)}…` : v)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top colleges</CardTitle>
            <CardDescription>By enrolled students (snapshot)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={collegesChartConfig} className="aspect-auto h-[200px] w-full">
              <BarChart data={topCollegesSnapshot} layout="vertical" margin={{ left: 4, right: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="college"
                  tickLine={false}
                  axisLine={false}
                  width={88}
                  tickFormatter={(v) => (String(v).length > 12 ? `${String(v).slice(0, 11)}…` : v)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="studentCount" fill="var(--color-studentCount)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score distribution</CardTitle>
            <CardDescription>Latest scores bucketed (mock)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={scoreDistConfig} className="aspect-auto h-[200px] w-full">
              <BarChart data={scoreDistribution} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent interviews</CardTitle>
            <CardDescription>Latest sessions</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-2 font-medium">ID</th>
                  <th className="pb-2 pr-2 font-medium">Student</th>
                  <th className="pb-2 pr-2 font-medium">Role</th>
                  <th className="pb-2 pr-2 text-right font-medium">Score</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-2 pr-2 font-mono text-xs text-muted-foreground">{row.id}</td>
                    <td className="py-2 pr-2 font-medium">{row.studentName}</td>
                    <td className="py-2 pr-2">{row.role}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{row.totalScore}</td>
                    <td className="py-2 text-muted-foreground">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently added students</CardTitle>
            <CardDescription>By registration date (mock)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {recentlyAddedStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-2 text-muted-foreground">{s.college}</span>
                </div>
                <span className="text-xs text-muted-foreground">{s.registeredAt}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attention required</CardTitle>
            <CardDescription>Flagged students and follow-ups</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {studentAttentionAlerts.map((a) => (
              <div key={a.id} className="rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={a.severity === "critical" ? "destructive" : "secondary"}
                    className="text-xs capitalize"
                  >
                    {a.severity}
                  </Badge>
                  <span className="font-medium">{a.title}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{a.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.timestamp}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/students">View all students</Link>
        </Button>
      </div>
    </div>
  )
}
