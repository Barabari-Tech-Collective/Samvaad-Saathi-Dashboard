"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInterviewSpeechMetricsTimeline } from "@/lib/api/hooks/analytics"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"

const chartConfig = {
  value: { label: "Metric", color: "var(--primary)" },
} satisfies ChartConfig

export function InterviewSpeechTimelineChart({
  interviewId,
}: Readonly<{ interviewId: number | string }>) {
  const {
    interviewSpeechMetricsTimeline,
    isLoadingInterviewSpeechMetricsTimeline,
    isError,
    error,
  } = useInterviewSpeechMetricsTimeline(interviewId)

  const data = React.useMemo(
    () =>
      (interviewSpeechMetricsTimeline?.points ?? []).map((pt) => ({
        t: pt.date,
        label: formatDashboardDateTime(pt.date),
        value: pt.value,
      })),
    [interviewSpeechMetricsTimeline?.points],
  )

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Speech metrics</CardTitle>
          <CardDescription>Timeline during the interview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load speech metrics timeline"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Speech metrics</CardTitle>
        <CardDescription>Timeline during the interview</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingInterviewSpeechMetricsTimeline ? (
          <ChartBarSkeleton className="h-[220px] w-full rounded-lg" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No speech timeline data for this interview.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="t"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = typeof v === "string" ? v : String(v)
                  return d.length > 12 ? `${d.slice(0, 10)}…` : d
                }}
              />
              <YAxis tickLine={false} axisLine={false} domain={["auto", "auto"]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as { label?: string } | undefined
                      return row?.label ?? ""
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
