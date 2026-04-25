"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

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
import { useDropoffFunnel } from "@/lib/api/hooks/analytics"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const chartConfig = {
  count: { label: "Users", color: "var(--chart-1)" },
} satisfies ChartConfig

export function DashboardDropoffFunnel() {
  const { dateFilters } = useDashboardOverviewRange()
  const { dropoffFunnel, isLoadingDropoffFunnel } = useDropoffFunnel(dateFilters)

  const data = React.useMemo(() => {
    if (!dropoffFunnel?.stages) return []
    return dropoffFunnel.stages.map((stage) => ({
      stage: stage.stage.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      count: stage.count,
      rate: stage.rate,
    }))
  }, [dropoffFunnel?.stages])

  return (
    <Card className="flex h-full flex-col @container/card">
      <CardHeader>
        <CardTitle>Dropoff funnel</CardTitle>
        <CardDescription>Stage-wise conversion and losses.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-2 pt-0 sm:px-6">
        {isLoadingDropoffFunnel ? (
          <ChartAreaSkeleton />
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full flex-1">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 24, bottom: 0 }}
            >
              <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                dataKey="stage"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={120}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`var(--chart-${(index % 5) + 1})`} 
                    opacity={1 - index * 0.15} 
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
