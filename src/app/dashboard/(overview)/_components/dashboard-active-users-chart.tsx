"use client"

import * as React from "react"
import { Bar, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis } from "recharts"

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
    type ChartConfig,
} from "@/components/ui/chart"
import { useDashboardActiveUsersTrend } from "@/lib/api/hooks/analytics"

import { formatChartDayMonth } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const chartConfig = {
  activeUsers: { label: "Active users", color: "var(--chart-2)" },
} satisfies ChartConfig

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)"
]

export function DashboardActiveUsersChart() {
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
            <ComposedChart data={data} margin={{ left: 8, right: 8, top: 40, bottom: 20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={28}
                tickFormatter={(v) => formatChartDayMonth(v as string)}
              />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length > 0) {
                    const rowData = payload[0]
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">{formatChartDayMonth(label as string)}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: "var(--primary)" }} />
                          <span className="text-sm font-medium">Active users: <span className="font-bold">{rowData.value}</span></span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="activeUsers" 
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
