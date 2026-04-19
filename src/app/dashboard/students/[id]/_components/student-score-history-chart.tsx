"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartAreaSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatDashboardDateTime } from "@/lib/dashboard-datetime"
import { useStudentScoreHistory } from "@/lib/api/hooks/analytics"

import { formatChartAxisDate } from "./student-detail-format"
import { StudentDetailEmpty } from "./student-detail-empty"

const chartConfig = {
  overall: { label: "Overall", color: "var(--chart-1)" },
  speech: { label: "Speech", color: "var(--chart-2)" },
  knowledge: { label: "Knowledge", color: "var(--chart-3)" },
} satisfies ChartConfig

export function StudentScoreHistoryChart({ studentId }: Readonly<{ studentId: number | string }>) {
  const { scoreHistory, isLoadingScoreHistory, isError, error } = useStudentScoreHistory(studentId)

  const data = React.useMemo(() => {
    const points = scoreHistory?.points ?? []
    return points.map((p, i) => ({
      id: String(p.interview_id ?? i),
      label: formatChartAxisDate(p.created_at),
      fullDate: p.created_at,
      overall: p.overall_score,
      speech: p.speech_score,
      knowledge: p.knowledge_score,
    }))
  }, [scoreHistory?.points])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-base">Score history</CardTitle>
        <CardDescription>Overall, speech, and knowledge scores across interviews</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:px-6">
        {isLoadingScoreHistory && !scoreHistory ? (
          <ChartAreaSkeleton className="h-[260px] w-full rounded-lg" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load score history."}
          </p>
        ) : data.length === 0 ? (
          <StudentDetailEmpty
            title="No interview scores yet"
            description="Scores will appear here after completed interviews with scoring enabled."
          />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
              />
              <YAxis tickLine={false} axisLine={false} width={36} domain={[0, 100]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as (typeof data)[number] | undefined
                      return row ? formatDashboardDateTime(row.fullDate) : ""
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="var(--color-overall)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="speech"
                stroke="var(--color-speech)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="knowledge"
                stroke="var(--color-knowledge)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
