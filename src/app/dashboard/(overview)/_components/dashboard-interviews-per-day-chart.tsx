"use client"

import * as React from "react"
import {
    Bar,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { ChartAreaSkeleton } from "@/components/dashboard/analytics-skeletons"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"
import { useDashboardInterviewsPerDay } from "@/lib/api/hooks/analytics"

import { formatChartDayMonth, formatTooltipDate } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const chartConfig = {
  interviewCount: { label: "Interviews", color: "var(--primary)" },
  interviewLine: { label: "Interviews", color: "var(--chart-3)" },
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
            <ComposedChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(v) => formatChartDayMonth(v as string)}
              />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0]
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-lg">
                        <p className="text-sm font-medium">{formatTooltipDate(label as string)}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">Interviews: {data.value}</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
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
              <Line
                type="monotone"
                dataKey="interviewCount"
                stroke="var(--color-interviewLine)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
