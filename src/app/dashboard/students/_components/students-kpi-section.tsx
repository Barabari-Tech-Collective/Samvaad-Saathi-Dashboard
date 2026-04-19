"use client"

import * as React from "react"

import { DashboardKpiCardsSkeleton } from "@/components/dashboard/analytics-skeletons"
import { KPI_STAT_GRID_CLASSNAME, KpiStatCard } from "@/components/dashboard/kpi-stat-card"
import { useStudentsSummary } from "@/lib/api/hooks/analytics"
import { formatKpiDisplayValue } from "@/lib/kpi-format"

export function StudentsKpiSection() {
    const { studentsSummary, isLoadingStudentsSummary, isError, error } = useStudentsSummary()

    const kpiCards =
        studentsSummary?.kpis?.map((k) => ({
            key: k.key,
            label: k.label,
            value: formatKpiDisplayValue(k),
        })) || []

    const showSkeleton = isLoadingStudentsSummary && kpiCards.length === 0

    if (isError) {
        return (
            <p className="px-4 text-sm text-destructive lg:px-6">
                {error instanceof Error ? error.message : "Failed to load student summary"}
            </p>
        )
    }

    return (
        <div className={`${KPI_STAT_GRID_CLASSNAME} px-4 lg:px-6`}>
            {showSkeleton ? (
                <DashboardKpiCardsSkeleton count={6} />
            ) : (
                kpiCards.map((kpi) => (
                    <KpiStatCard key={kpi.key} kpiKey={kpi.key} label={kpi.label} value={kpi.value} />
                ))
            )}
        </div>
    )
}
