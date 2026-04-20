"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { StudentDetailEmpty } from "@/app/dashboard/students/[id]/_components/student-detail-empty"
import { ChartAreaSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { LineAreaChartResponse } from "@/lib/api/hooks/analytics/types"
import { formatChartDayMonth } from "@/lib/dashboard-datetime"
import { useId, useMemo } from "react"

type CollegeTrendChartProps = Readonly<{
    title: string
    description: string
    seriesLabel: string
    data: LineAreaChartResponse | undefined
    isLoading: boolean
    isError: boolean
    error: unknown
}>

export function CollegeTrendChart({
    title,
    description,
    seriesLabel,
    data,
    isLoading,
    isError,
    error,
}: CollegeTrendChartProps) {
    const gradientId = useId().replace(/:/g, "")
    const chartData = useMemo(
        () =>
            (data?.points ?? []).map((p) => ({
                date: p.date,
                value: p.value,
            })),
        [data?.points],
    )

    const config = useMemo(
        () =>
            ({
                value: { label: seriesLabel, color: "var(--chart-1)" },
            }) satisfies ChartConfig,
        [seriesLabel],
    )

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-0 sm:px-6">
                {isLoading && !data ? (
                    <ChartAreaSkeleton className="h-[240px] w-full rounded-lg" />
                ) : isError ? (
                    <p className="text-sm text-destructive">
                        {error instanceof Error ? error.message : "Could not load chart."}
                    </p>
                ) : chartData.length === 0 ? (
                    <StudentDetailEmpty title="No data for this period" className="min-h-[200px]" />
                ) : (
                    <ChartContainer config={config} className="aspect-auto h-[240px] w-full">
                        <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.85} />
                                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.08} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={28}
                                tickFormatter={(v) => formatChartDayMonth(v as string)}
                            />
                            <YAxis tickLine={false} axisLine={false} width={40} />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(v) => formatChartDayMonth(v as string)}
                                    />
                                }
                            />
                            <Area
                                dataKey="value"
                                type="natural"
                                fill={`url(#${gradientId})`}
                                stroke="var(--color-value)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
