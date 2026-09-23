"use client"

import * as React from "react"
import { Bar, BarChart, Cell, XAxis, YAxis, LabelList } from "recharts"
import { IconTrendingUp } from "@tabler/icons-react"
import dayjs from "dayjs"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart"
import { useDashboardNewStudentsTrend } from "@/lib/api/hooks/analytics"
import type { DateRange } from "react-day-picker"

import { presetToDateFilters, type DashboardRangePreset } from "./dashboard-overview-context"
import { DashboardChartFilterTabs } from "./dashboard-date-range-tabs"

const chartConfig = {
  studentCount: { label: "New Students", color: "#8b5cf6" }, // Explicit Violet color
} satisfies ChartConfig

export function DashboardNewStudentsChart() {
  const [preset, setPreset] = React.useState<DashboardRangePreset>("90d")
  const [customRange, setCustomRange] = React.useState<DateRange | undefined>()
  const dateFilters = React.useMemo(() => presetToDateFilters(preset, customRange), [preset, customRange])
  const { newStudentsTrend, isLoadingNewStudentsTrend } = useDashboardNewStudentsTrend(dateFilters)

  const data = React.useMemo(
    () =>
      (newStudentsTrend?.points ?? []).map((p) => ({
        label: p.label, // label string from API (e.g., '2026-09-10' or 'Q1')
        formattedDate: p.label ? dayjs(p.label).format("MMM D") : "", // e.g., 'Sep 10'
        studentCount: p.value,
      })),
    [newStudentsTrend?.points],
  )

  const dateRangeText = React.useMemo(() => {
    if (data.length > 0 && data[0].label && data[data.length - 1].label) {
      const first = dayjs(data[0].label)
      const last = dayjs(data[data.length - 1].label)
      return `${first.format("MMM D, YYYY")} to ${last.format("MMM D, YYYY")}`
    }
    return ""
  }, [data])

  return (
    <Card className="col-span-1 border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconTrendingUp className="w-4 h-4 text-purple-500" />
            New Students {dateRangeText ? `— ${dateRangeText}` : ""}
        </CardTitle>
        <DashboardChartFilterTabs 
          preset={preset} 
          onPresetChange={setPreset} 
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        {isLoadingNewStudentsTrend ? (
          <ChartBarSkeleton className="h-[240px]" />
        ) : data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
            <BarChart data={data} margin={{ left: 0, right: 0, top: 30, bottom: 0 }}>
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length > 0) {
                    const rowData = payload[0]
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-400" />
                          <span className="text-sm font-medium text-foreground">{rowData.value}</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="studentCount" 
                radius={[4, 4, 0, 0]}
                fill="var(--color-studentCount)"
                barSize={50}
              >
                <LabelList 
                  dataKey="studentCount" 
                  position="top" 
                  offset={10} 
                  fill="#000000" 
                  fontSize={13} 
                  fontWeight={700} 
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
