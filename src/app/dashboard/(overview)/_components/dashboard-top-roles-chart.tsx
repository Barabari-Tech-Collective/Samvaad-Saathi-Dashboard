"use client"

import * as React from "react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useDashboardTopRoles } from "@/lib/api/hooks/analytics"

import { formatDurationSeconds } from "./dashboard-format-utils"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const PIE_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
] as const

const chartConfig = {
    interviews: { label: "Interviews", color: "var(--chart-1)" },
} satisfies ChartConfig

function truncateRole(s: string, n: number) {
    return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

export function DashboardTopRolesChart() {
    const { dateFilters } = useDashboardOverviewRange()
    const { topRoles, isLoadingTopRoles } = useDashboardTopRoles({ ...dateFilters, limit: 5 })

    const pieData = React.useMemo(() => {
        const items = [...(topRoles?.items ?? [])].sort((a, b) => b.interviews - a.interviews).slice(0, 5)
        return items.map((r, i) => ({
            name: truncateRole(r.role, 18),
            fullRole: r.role,
            value: r.interviews,
            avgScore: r.avg_score,
            dropOff: r.drop_off_rate,
            avgTime: r.avg_time_spent_seconds ?? null,
            color: PIE_COLORS[i % PIE_COLORS.length],
        }))
    }, [topRoles?.items])

    return (
        <Card size="sm">
            <CardHeader>
                <CardTitle className="text-base">Top roles</CardTitle>
                <CardDescription>Share of interview volume (top 5)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
                {isLoadingTopRoles ? (
                    <ChartBarSkeleton className="h-[180px] w-full rounded-lg" />
                ) : pieData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No role data for this range.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="mx-auto aspect-auto h-[180px] w-full">
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
                                    <Cell key={entry.fullRole} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    const p = payload[0].payload as (typeof pieData)[number]
                                    return (
                                        <div className="grid min-w-[12rem] gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-2 text-xs shadow-xl">
                                            <div className="font-medium leading-snug">{p.fullRole}</div>
                                            <div className="text-muted-foreground">
                                                Interviews: <span className="tabular-nums text-foreground">{p.value}</span>
                                            </div>
                                            {p.avgScore != null ? (
                                                <div className="text-muted-foreground">
                                                    Avg score:{" "}
                                                    <span className="tabular-nums font-medium text-sky-600 dark:text-sky-400">
                                                        {p.avgScore.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : null}
                                            {p.dropOff != null ? (
                                                <div className="text-muted-foreground">
                                                    Drop-off:{" "}
                                                    <span className="tabular-nums text-foreground">{p.dropOff}%</span>
                                                </div>
                                            ) : null}
                                            {p.avgTime != null ? (
                                                <div className="text-muted-foreground">
                                                    Avg time:{" "}
                                                    <span className="tabular-nums text-foreground">
                                                        {formatDurationSeconds(p.avgTime)}
                                                    </span>
                                                </div>
                                            ) : null}
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
