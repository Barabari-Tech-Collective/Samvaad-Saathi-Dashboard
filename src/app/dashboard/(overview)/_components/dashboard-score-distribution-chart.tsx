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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDashboardScoreDistribution, useAnalyticsRolesFilters } from "@/lib/api/hooks/analytics"

import { useDashboardOverviewRange } from "./dashboard-overview-context"
import { DashboardRolePerformanceDialog } from "./dashboard-role-performance-dialog"

const chartConfig = {
    count: { label: "Interviews", color: "var(--chart-4)" },
} satisfies ChartConfig

export function DashboardScoreDistributionChart() {
    const { dateFilters } = useDashboardOverviewRange()
    const [selectedRole, setSelectedRole] = React.useState<string>("all")
    const [selectedMetric, setSelectedMetric] = React.useState<string>("overall")

    // TODO: Scalability - Upgrading this to a searchable Combobox with backend pagination 
    // will be needed in the future to support tenants with >100 roles.
    const { roles } = useAnalyticsRolesFilters()

    const filters = React.useMemo(() => {
        return {
            ...dateFilters,
            ...(selectedRole !== "all" ? { role: selectedRole } : {}),
            ...(selectedMetric !== "overall" ? { metric: selectedMetric } : {}),
        }
    }, [dateFilters, selectedRole, selectedMetric])

    const { scoreDistribution, isLoadingScoreDistribution } = useDashboardScoreDistribution(filters)

    const data = React.useMemo(
        () =>
            (scoreDistribution?.buckets ?? []).map((b, i) => ({
                id: `bucket-${i}`,
                label: b.label,
                count: b.count,
            })),
        [scoreDistribution?.buckets],
    )

    const max = React.useMemo(() => data.reduce((m, d) => Math.max(m, d.count), 0), [data])

    return (
        <Card size="sm">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <div>
                    <CardTitle className="text-base">Score distribution</CardTitle>
                    <CardDescription>Histogram of interview scores</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles?.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                        <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs">
                            <SelectValue placeholder="Metric" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="overall">Overall Score</SelectItem>
                            <SelectItem value="knowledge">Knowledge Competence</SelectItem>
                            <SelectItem value="speech">Speech Structure</SelectItem>
                        </SelectContent>
                    </Select>
                    <DashboardRolePerformanceDialog />
                </div>
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
                                dataKey="label"
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
