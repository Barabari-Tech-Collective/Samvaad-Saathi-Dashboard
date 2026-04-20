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

import { StudentDetailEmpty } from "@/app/dashboard/students/[id]/_components/student-detail-empty"
import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
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
import { useCollegePracticeMetrics } from "@/lib/api/hooks/analytics"

const histogramConfig = {
  count: { label: "Count", color: "var(--chart-3)" },
} satisfies ChartConfig

export function CollegePracticeMetricsCard({
  collegeName,
  title,
  description,
}: Readonly<{
  collegeName: string
  title: string
  description: string
}>) {
  const {
    collegePracticeMetrics,
    isLoadingCollegePracticeMetrics,
    isError,
    error,
  } = useCollegePracticeMetrics(collegeName)

  const histogram =
    collegePracticeMetrics?.chartType === "histogram" ? collegePracticeMetrics : null

  const chartData = React.useMemo(() => {
    if (!histogram) return []
    return histogram.buckets.map((b, i) => ({
      id: `b-${i}`,
      label: b.label,
      tickLabel: b.label.length > 12 ? `${b.label.slice(0, 10)}…` : b.label,
      count: b.count,
    }))
  }, [histogram])

  const max = React.useMemo(() => chartData.reduce((m, d) => Math.max(m, d.count), 0), [chartData])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isLoadingCollegePracticeMetrics && !collegePracticeMetrics ? (
          <ChartBarSkeleton className="h-48 w-full rounded-lg" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load practice metrics."}
          </p>
        ) : histogram && chartData.length > 0 ? (
          <ChartContainer config={histogramConfig} className="aspect-auto h-48 w-full">
            <BarChart data={chartData} margin={{ left: 4, right: 4, top: 2, bottom: 2 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tickLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={56}
              />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as (typeof chartData)[number] | undefined
                      return row ? row.label : ""
                    }}
                  />
                }
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={
                      max > 0 && entry.count === max
                        ? "var(--color-count)"
                        : "color-mix(in oklab, var(--color-count) 75%, transparent)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <StudentDetailEmpty
            title="No practice metrics to display"
            description="Metrics may be unavailable for this institution or format."
          />
        )}
      </CardContent>
    </Card>
  )
}
