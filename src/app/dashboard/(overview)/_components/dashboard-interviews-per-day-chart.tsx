"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartAreaSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useDashboardInterviewsPerDay } from "@/lib/api/hooks/analytics"

import { formatDashboardDateTime } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const chartConfig = {
  interviewCount: { label: "Interviews", color: "var(--primary)" },
} satisfies ChartConfig

export function DashboardInterviewsPerDayChart() {
  const { dateFilters } = useDashboardOverviewRange()
  const { interviewsPerDay, isLoadingInterviewsPerDay } = useDashboardInterviewsPerDay(dateFilters)

  const data = React.useMemo(
    () =>
      (interviewsPerDay?.points ?? []).map((p) => ({
        date: p.date,
        interviewCount: p.value,
      })),
    [interviewsPerDay?.points],
  )

  const max = React.useMemo(
    () => data.reduce((m, d) => Math.max(m, d.interviewCount), 0),
    [data],
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Interviews per day</CardTitle>
        <CardDescription>Session volume over the selected period</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:px-6">
        {isLoadingInterviewsPerDay ? (
          <ChartAreaSkeleton />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
            <BarChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(v) => formatDashboardDateTime(v as string)}
              />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => formatDashboardDateTime(v as string)}
                  />
                }
              />
              <Bar dataKey="interviewCount" radius={[3, 3, 0, 0]} maxBarSize={28}>
                {data.map((entry) => (
                  <Cell
                    key={entry.date}
                    fill={
                      max > 0 && entry.interviewCount === max
                        ? "var(--color-interviewCount)"
                        : "color-mix(in oklab, var(--color-interviewCount) 75%, transparent)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
