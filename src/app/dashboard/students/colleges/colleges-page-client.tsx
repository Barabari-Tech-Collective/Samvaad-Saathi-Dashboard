"use client"

import * as React from "react"

import { StudentsSectionNav } from "@/app/dashboard/students/_components/students-section-nav"
import {
    StudentsKpiCardsSkeleton,
    StudentsTableSkeleton,
} from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useCollegesSummary, useCollegesTable } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

export function CollegesPageClient() {
    const { collegesSummary, isLoadingCollegesSummary } = useCollegesSummary()
    const { collegesTable, isLoadingCollegesTable, isError, error } = useCollegesTable({
        page: 1,
        limit: 100,
    })

    const kpiCards = React.useMemo(() => {
        const kpis = collegesSummary?.kpis ?? []
        return kpis.map((k) => ({
            key: k.key,
            label: k.label,
            value: formatKpiDisplayValue(k),
        }))
    }, [collegesSummary?.kpis])

    const rows = collegesTable?.items ?? []
    const loading = (isLoadingCollegesSummary && kpiCards.length === 0) || isLoadingCollegesTable

    if (isError) {
        return (
            <>
                <StudentsSectionNav />
                <p className="px-4 text-sm text-destructive lg:px-6">
                    {error instanceof Error ? error.message : "Failed to load colleges"}
                </p>
            </>
        )
    }

    return (
        <>
            <StudentsSectionNav />
            <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
                {isLoadingCollegesSummary && kpiCards.length === 0 ? (
                    <StudentsKpiCardsSkeleton count={6} />
                ) : (
                    kpiCards.map((kpi) => (
                        <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
                    ))
                )}
            </div>

            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Colleges</CardTitle>
                        <CardDescription>
                            Performance snapshot by institution
                            {collegesTable?.total != null ? (
                                <span className="text-muted-foreground">
                                    {" "}
                                    · {rows.length} of {collegesTable.total} loaded
                                </span>
                            ) : null}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        {loading && rows.length === 0 ? (
                            <StudentsTableSkeleton rows={8} />
                        ) : (
                            <table className="w-full min-w-[640px] text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 pr-3 font-medium">College</th>
                                        <th className="pb-2 pr-3 text-right font-medium">Students</th>
                                        <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                                        <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                                        <th className="pb-2 pr-3 text-right font-medium">Improvement %</th>
                                        <th className="pb-2 text-right font-medium">Active users</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.college_name} className="border-b last:border-0">
                                            <td className="py-2 pr-3 font-medium">{row.college_name}</td>
                                            <td className="py-2 pr-3 text-right tabular-nums">{row.students_count}</td>
                                            <td className="py-2 pr-3 text-right tabular-nums">{row.interviews_count}</td>
                                            <td className="py-2 pr-3 text-right tabular-nums">
                                                {row.avg_score != null ? row.avg_score.toFixed(2) : "—"}
                                            </td>
                                            <td className="py-2 pr-3 text-right tabular-nums">
                                                {row.improvement_percent != null ? (
                                                    <>
                                                        {row.improvement_percent > 0 ? "+" : ""}
                                                        {row.improvement_percent}%
                                                    </>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                            <td className="py-2 text-right tabular-nums">{row.active_users}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
