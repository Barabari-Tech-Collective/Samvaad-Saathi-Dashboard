"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useDifficultyMetrics } from "@/lib/api/hooks/analytics"

const difficultyConfig = {
  avgScore: { label: "Avg score", color: "var(--primary)" },
  completionRate: { label: "Completion %", color: "var(--chart-2)" },
} satisfies ChartConfig

export function InterviewsDifficultyChartCard() {
  const { difficultyMetrics, isLoadingDifficultyMetrics, isError, error } = useDifficultyMetrics()

  const chartData = React.useMemo(
    () =>
      (difficultyMetrics?.items ?? []).map((d) => ({
        difficulty: d.difficulty,
        avgScore: d.avg_score ?? 0,
        completionRate: d.completion_rate ?? 0,
      })),
    [difficultyMetrics?.items],
  )

  if (isError) {
    return (
      <div className="px-4 lg:px-6">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load difficulty metrics"}
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Average score by difficulty</CardTitle>
          <CardDescription>Score and completion rate by difficulty band</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDifficultyMetrics ? (
            <ChartBarSkeleton className="h-[240px] w-full" />
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No difficulty metrics for this period.</p>
          ) : (
            <ChartContainer config={difficultyConfig} className="aspect-auto h-[240px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="difficulty" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="completionRate"
                  fill="var(--color-completionRate)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
