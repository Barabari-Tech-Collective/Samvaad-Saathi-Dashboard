"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { useDashboardActiveUsersTrend } from "@/lib/api/hooks/analytics"

import { formatChartDayMonth } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const chartConfig = {
  activeUsers: { label: "Active users", color: "var(--chart-2)" },
} satisfies ChartConfig

export function DashboardActiveUsersChart() {
  const gradientId = React.useId().replace(/:/g, "")
  const { dateFilters } = useDashboardOverviewRange()
  const { activeUsersTrend, isLoadingActiveUsersTrend } = useDashboardActiveUsersTrend(dateFilters)

  const data = React.useMemo(
    () =>
      (activeUsersTrend?.points ?? []).map((p) => ({
        date: p.date,
        activeUsers: p.value,
      })),
    [activeUsersTrend?.points],
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Active users trend</CardTitle>
        <CardDescription>Daily unique active learners</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:px-6">
        {isLoadingActiveUsersTrend ? (
          <ChartAreaSkeleton />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
            <AreaChart data={data} margin={{ left: 8, right: 8 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-activeUsers)" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="var(--color-activeUsers)" stopOpacity={0.08} />
                </linearGradient>
              </defs>
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
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => formatChartDayMonth(v as string)}
                  />
                }
              />
              <Area
                dataKey="activeUsers"
                type="natural"
                fill={`url(#${gradientId})`}
                stroke="var(--color-activeUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
