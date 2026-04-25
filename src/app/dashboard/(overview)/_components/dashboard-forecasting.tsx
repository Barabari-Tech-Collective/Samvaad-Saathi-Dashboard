"use client"

import * as React from "react"
import { Area, ComposedChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { useForecasting } from "@/lib/api/hooks/analytics"
import { formatDashboardDateTime } from "./dashboard-format-utils"

const chartConfig = {
  predictedValue: { label: "Predicted", color: "var(--chart-3)" },
  bounds: { label: "Confidence Band", color: "var(--chart-3)" },
} satisfies ChartConfig

export function DashboardForecasting() {
  const gradientId = React.useId().replace(/:/g, "")
  const { forecasting, isLoadingForecasting } = useForecasting({ days_ahead: 30 })

  const data = React.useMemo(() => {
    if (!forecasting?.points) return []
    return forecasting.points.map((p) => ({
      date: p.date,
      predictedValue: p.predictedValue,
      bounds: [p.lowerBound, p.upperBound],
    }))
  }, [forecasting?.points])

  return (
    <Card className="flex h-full flex-col @container/card">
      <CardHeader>
        <CardTitle>Forecasting</CardTitle>
        <CardDescription>30-day projected trend and confidence interval.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-2 pt-0 sm:px-6">
        {isLoadingForecasting ? (
          <ChartAreaSkeleton />
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full flex-1">
            <ComposedChart data={data} margin={{ top: 12, left: 8, right: 8 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bounds)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-bounds)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(v) => formatDashboardDateTime(v as string)}
              />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => formatDashboardDateTime(v as string)}
                  />
                }
              />
              <Area
                dataKey="bounds"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke="none"
              />
              <Line
                dataKey="predictedValue"
                type="monotone"
                stroke="var(--color-predictedValue)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
