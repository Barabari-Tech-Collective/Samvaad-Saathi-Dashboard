"use client"

import * as React from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    XAxis,
    YAxis,
} from "recharts"

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
import { useDashboardScoreDistribution } from "@/lib/api/hooks/analytics"

import { useDashboardOverviewRange } from "./dashboard-overview-context"

const chartConfig = {
    count: { label: "Interviews", color: "var(--chart-4)" },
} satisfies ChartConfig

export function DashboardScoreDistributionChart() {
    const { dateFilters } = useDashboardOverviewRange()
    const { scoreDistribution, isLoadingScoreDistribution } = useDashboardScoreDistribution(dateFilters)

    const data = React.useMemo(
        () =>
            (scoreDistribution?.buckets ?? []).map((b, i) => ({
                id: `bucket-${i}`,
                label: b.label,
                tickLabel: b.label === "0-0" ? `#${i + 1}` : b.label,
                count: b.count,
            })),
        [scoreDistribution?.buckets],
    )

    const max = React.useMemo(() => data.reduce((m, d) => Math.max(m, d.count), 0), [data])

    return (
        <Card size="sm">
            <CardHeader>
                <CardTitle className="text-base">Score distribution</CardTitle>
                <CardDescription>Histogram of interview scores</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
                {isLoadingScoreDistribution ? (
                    <ChartBarSkeleton className="h-48 w-full rounded-lg" />
                ) : data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No scores in this range.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
                        <BarChart data={data} margin={{ left: 4, right: 4, top: 2, bottom: 2 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="tickLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                            />
                            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(_, payload) => {
                                            const row = payload?.[0]?.payload as (typeof data)[number] | undefined
                                            return row ? `Range: ${row.label}` : ""
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                                {data.map((entry) => (
                                    <Cell
                                        key={entry.id}
                                        fill={
                                            max > 0 && entry.count === max
                                                ? "var(--color-count)"
                                                : "color-mix(in oklab, var(--color-count) 78%, transparent)"
                                        }
                                    />
                                ))}
                                <LabelList
                                    dataKey="count"
                                    position="top"
                                    className="fill-foreground text-[10px]"
                                    formatter={(v) => (typeof v === "number" && v > 0 ? v : "")}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
