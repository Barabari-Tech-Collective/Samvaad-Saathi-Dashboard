"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, Tooltip, XAxis, YAxis } from "recharts"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useDashboardTopColleges } from "@/lib/api/hooks/analytics"

import { useDashboardOverviewRange } from "./dashboard-overview-context"
import { useMemo } from "react"

const chartConfig = {
    usage: { label: "Usage frequency", color: "var(--chart-3)" },
} satisfies ChartConfig

export function DashboardTopCollegesChart() {
    const { dateFilters } = useDashboardOverviewRange()
    const { topColleges, isLoadingTopColleges } = useDashboardTopColleges({ ...dateFilters, limit: 5 })

    const data = useMemo(
        () =>
            (topColleges?.items ?? []).map((c) => ({
                college: c.college,
                collegeShort: c.college.length > 14 ? `${c.college.slice(0, 13)}…` : c.college,
                usage: c.usage_frequency,
                interviews: c.interviews,
                completion: c.completion_rate,
                improvement: c.improvement_rate,
                avgScore: c.avg_score,
            })),
        [topColleges?.items],
    )

    return (
        <Card size="sm">
            <CardHeader>
                <CardTitle className="text-base">Top colleges</CardTitle>
                <CardDescription>Usage frequency (snapshot)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
                {isLoadingTopColleges ? (
                    <ChartBarSkeleton className="h-48 w-full rounded-lg" />
                ) : data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No college data for this range.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
                        <BarChart data={data} layout="vertical" margin={{ left: 2, right: 4, top: 2, bottom: 2 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" tickLine={false} axisLine={false} />
                            <YAxis
                                type="category"
                                dataKey="collegeShort"
                                tickLine={false}
                                axisLine={false}
                                width={96}
                            />
                            <Tooltip
                                cursor={<Rectangle fill="var(--muted)" radius={4} opacity={0.25} />}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    const row = payload[0].payload as (typeof data)[number]
                                    return (
                                        <div className="grid min-w-[14rem] gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-2 text-xs shadow-xl">
                                            <div className="font-medium leading-snug">{row.college}</div>
                                            <div className="text-muted-foreground">
                                                Usage frequency:{" "}
                                                <span className="tabular-nums text-foreground">{row.usage}</span>
                                            </div>
                                            <div className="text-muted-foreground">
                                                Interviews:{" "}
                                                <span className="tabular-nums text-foreground">{row.interviews}</span>
                                            </div>
                                            {row.completion != null ? (
                                                <div className="text-muted-foreground">
                                                    Completion:{" "}
                                                    <span className="tabular-nums font-medium text-violet-600 dark:text-violet-400">
                                                        {row.completion}%
                                                    </span>
                                                </div>
                                            ) : null}
                                            {row.improvement != null ? (
                                                <div className="text-muted-foreground">
                                                    Improvement:{" "}
                                                    <span
                                                        className={
                                                            row.improvement > 0
                                                                ? "tabular-nums font-medium text-emerald-600 dark:text-emerald-400"
                                                                : row.improvement < 0
                                                                    ? "tabular-nums font-medium text-red-600 dark:text-red-400"
                                                                    : "tabular-nums font-medium text-foreground"
                                                        }
                                                    >
                                                        {row.improvement > 0 ? "+" : ""}
                                                        {row.improvement}%
                                                    </span>
                                                </div>
                                            ) : null}
                                            {row.avgScore != null ? (
                                                <div className="text-muted-foreground">
                                                    Avg score:{" "}
                                                    <span className="tabular-nums font-medium text-sky-600 dark:text-sky-400">
                                                        {row.avgScore.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : null}
                                           
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey="usage" fill="var(--color-usage)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
