"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useStudentSkillAverages } from "@/lib/api/hooks/analytics"

import { skillMetricLabel } from "./student-detail-format"
import { StudentDetailEmpty } from "./student-detail-empty"

const chartConfig = {
  value: { label: "Score", color: "var(--chart-4)" },
} satisfies ChartConfig

export function StudentSkillAveragesChart({ studentId }: Readonly<{ studentId: number | string }>) {
  const { skillAverages, isLoadingSkillAverages, isError, error } = useStudentSkillAverages(studentId)

  const { radarRows, barRows, hasSparseData } = React.useMemo(() => {
    const items = skillAverages?.items ?? []
    const withValues = items
      .map((it) => ({
        metricKey: it.metric,
        name: skillMetricLabel(it.metric),
        value: it.value,
      }))
      .filter((it): it is typeof it & { value: number } => it.value !== null && it.value !== undefined)

    const radarRows = withValues.map((it) => ({
      name: it.name.length > 18 ? `${it.name.slice(0, 16)}…` : it.name,
      fullName: it.name,
      value: it.value,
    }))

    const barRows = [...withValues].sort((a, b) => b.value - a.value).map((it) => ({
      name: it.name,
      value: it.value,
    }))

    const hasSparseData = items.length > 0 && withValues.length < items.length
    return { radarRows, barRows, hasSparseData }
  }, [skillAverages?.items])

  const showRadar = radarRows.length >= 3

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-base">Skill averages</CardTitle>
        <CardDescription>
          Aggregated performance across speech and answer-quality dimensions
          {hasSparseData ? " (partial data from the backend)" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:px-6">
        {isLoadingSkillAverages && !skillAverages ? (
          <ChartBarSkeleton className="h-[280px] w-full rounded-lg" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load skill averages."}
          </p>
        ) : radarRows.length === 0 ? (
          <StudentDetailEmpty
            title="No skill scores yet"
            description="Metrics appear when the backend has enough graded interview data for this learner."
          />
        ) : showRadar ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[320px] w-full max-w-[min(100%,420px)]">
            <RadarChart data={radarRows} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.35}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as (typeof radarRows)[number] | undefined
                      return row?.fullName ?? row?.name ?? ""
                    }}
                  />
                }
              />
            </RadarChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[min(320px,50vh)] w-full">
            <BarChart data={barRows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
