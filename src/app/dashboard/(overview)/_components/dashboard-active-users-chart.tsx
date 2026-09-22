"use client"

import * as React from "react"
import { Bar, BarChart, Cell, XAxis, YAxis, LabelList } from "recharts"
import { Users } from "lucide-react"
import { format, parseISO } from "date-fns"

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
import { useDashboardActiveUsersTrend } from "@/lib/api/hooks/analytics"
import type { DateRange } from "react-day-picker"

import { presetToDateFilters, type DashboardRangePreset } from "./dashboard-overview-context"
import { DashboardChartFilterTabs } from "./dashboard-date-range-tabs"

const chartConfig = {
  activeUsers: { label: "Active Students", color: "#fb7185" }, 
} satisfies ChartConfig

export function DashboardActiveUsersChart() {
  const [preset, setPreset] = React.useState<DashboardRangePreset>("90d")
  const [customRange, setCustomRange] = React.useState<DateRange | undefined>()
  const dateFilters = React.useMemo(() => presetToDateFilters(preset, customRange), [preset, customRange])
  const { activeUsersTrend, isLoadingActiveUsersTrend } = useDashboardActiveUsersTrend(dateFilters)

  const data = React.useMemo(
    () =>
      (activeUsersTrend?.points ?? []).map((p) => ({
        label: p.label, // label string from API (e.g., '2026-09-10' or 'Q1')
        formattedDate: p.label ? format(parseISO(String(p.label)), "MMM d") : "", // e.g., 'Sep 10'
        activeUsers: p.value,
      })),
    [activeUsersTrend?.points],
  )

  const dateRangeText = React.useMemo(() => {
    if (data.length > 0 && data[0].label && data[data.length - 1].label) {
      try {
        const first = parseISO(String(data[0].label))
        const last = parseISO(String(data[data.length - 1].label))
        return `${format(first, "MMM d, yyyy")} to ${format(last, "MMM d, yyyy")}`
      } catch (e) {
        return ""
      }
    }
    return ""
  }, [data])

  return (
    <Card className="col-span-1 border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-500" />
            Active Students {dateRangeText ? `— ${dateRangeText}` : ""}
        </CardTitle>
        <DashboardChartFilterTabs 
          preset={preset} 
          onPresetChange={setPreset} 
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        {isLoadingActiveUsersTrend ? (
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
                          <div className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="text-sm font-medium text-foreground">{rowData.value}</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="activeUsers" 
                radius={[4, 4, 0, 0]}
                fill="#fb7185" // Solid pink
                barSize={50}
              >
                <LabelList dataKey="activeUsers" position="top" offset={10} style={{ fill: '#fb7185', fontSize: 13, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
