"use client"

import * as React from "react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useInterviewQuestionTypeBreakdown } from "@/lib/api/hooks/analytics"

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const chartConfig = {
  count: { label: "Questions", color: "var(--chart-1)" },
} satisfies ChartConfig

export function InterviewQuestionTypeChart({
  interviewId,
}: Readonly<{ interviewId: number | string }>) {
  const {
    interviewQuestionTypeBreakdown,
    isLoadingInterviewQuestionTypeBreakdown,
    isError,
    error,
  } = useInterviewQuestionTypeBreakdown(interviewId)

  const pieData = React.useMemo(() => {
    const buckets = interviewQuestionTypeBreakdown?.buckets ?? []
    return buckets.map((b, i) => ({
      name: b.label,
      value: b.count,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }))
  }, [interviewQuestionTypeBreakdown?.buckets])

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question types</CardTitle>
          <CardDescription>Distribution by question category</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load question type breakdown"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Question types</CardTitle>
        <CardDescription>Distribution by question category</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingInterviewQuestionTypeBreakdown ? (
          <ChartBarSkeleton className="h-48 w-full rounded-lg" />
        ) : pieData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No question type data for this interview.</p>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-auto h-48 w-full">
            <PieChart margin={{ top: 4, bottom: 4, left: 4, right: 4 }}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={76}
                paddingAngle={2}
                strokeWidth={1}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const p = payload[0].payload as (typeof pieData)[number]
                  return (
                    <div className="grid min-w-[10rem] gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-2 text-xs shadow-xl">
                      <div className="font-medium leading-snug">{p.name}</div>
                      <div className="text-muted-foreground">
                        Count:{" "}
                        <span className="tabular-nums text-foreground">{p.value}</span>
                      </div>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
