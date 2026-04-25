"use client"

import * as React from "react"
import { Area, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from "recharts"

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
import { useForecasting } from "@/lib/api/hooks/analytics"
import { formatChartDayMonth } from "./dashboard-format-utils"

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
                tickFormatter={(v) => formatChartDayMonth(v as string)}
              />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="text-sm font-medium">{formatChartDayMonth(label as string)}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-muted-foreground">Confidence Band</span>
                            <span className="text-xs font-medium">
                              {data.bounds[0]?.toFixed(2)}, {data.bounds[1]?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-muted-foreground">Predicted</span>
                            <span className="text-xs font-medium">
                              {data.predictedValue?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
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
