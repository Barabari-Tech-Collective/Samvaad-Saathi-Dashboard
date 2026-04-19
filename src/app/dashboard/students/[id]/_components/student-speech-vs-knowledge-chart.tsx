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
import { useStudentSpeechVsKnowledgeHistory } from "@/lib/api/hooks/analytics"

import { formatChartAxisDate } from "./student-detail-format"
import { StudentDetailEmpty } from "./student-detail-empty"

const chartConfig = {
  speech: { label: "Speech", color: "var(--chart-2)" },
  knowledge: { label: "Knowledge", color: "var(--chart-3)" },
} satisfies ChartConfig

export function StudentSpeechVsKnowledgeChart({ studentId }: Readonly<{ studentId: number | string }>) {
  const { speechVsKnowledgeHistory, isLoadingSpeechVsKnowledgeHistory, isError, error } =
    useStudentSpeechVsKnowledgeHistory(studentId)

  const data = React.useMemo(() => {
    const points = speechVsKnowledgeHistory?.points ?? []
    return points.map((p, i) => ({
      id: String(p.interview_id ?? i),
      label: formatChartAxisDate(p.created_at),
      fullDate: p.created_at,
      speech: p.speech_score,
      knowledge: p.knowledge_score,
    }))
  }, [speechVsKnowledgeHistory?.points])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-base">Speech vs knowledge</CardTitle>
        <CardDescription>How communication and domain depth move together over time</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:px-6">
        {isLoadingSpeechVsKnowledgeHistory && !speechVsKnowledgeHistory ? (
          <ChartAreaSkeleton className="h-[260px] w-full rounded-lg" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load speech vs knowledge history."}
          </p>
        ) : data.length === 0 ? (
          <StudentDetailEmpty
            title="No data for this chart"
            description="Complete interviews to see speech and knowledge trends."
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
