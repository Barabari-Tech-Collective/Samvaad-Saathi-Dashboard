"use client"

import { Users } from "lucide-react"
import { useMemo } from "react"

import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDashboardStudentsPerCollege } from "@/lib/api/hooks/analytics"

import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardStudentsPerCollegeList() {
    const { dateFilters } = useDashboardOverviewRange()
    const { studentsPerCollege, isLoadingStudentsPerCollege } = useDashboardStudentsPerCollege({ ...dateFilters, limit: 10 })

    const data = useMemo(
        () =>
            (studentsPerCollege?.items ?? []).map((c) => ({
                college: c.college,
                count: c.students_count,
            })),
        [studentsPerCollege?.items],
    )

    const maxCount = useMemo(() => {
        return data.reduce((max, item) => Math.max(max, item.count), 0)
    }, [data])

    return (
        <Card className="col-span-1 shadow-sm border">
            <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Students per College
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6">
                {isLoadingStudentsPerCollege ? (
                    <ChartBarSkeleton className="h-48 w-full rounded-lg" />
                ) : data.length === 0 ? (
                    <p className="text-sm text-muted-foreground flex h-48 items-center justify-center">
                        No college data for this range.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4 mt-2">
                        {data.map((row, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">{row.college}</span>
                                    <span className="font-bold tabular-nums text-foreground">{row.count}</span>
                                </div>
                                <div className="h-2 w-full bg-indigo-100 dark:bg-indigo-950/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full" 
                                        style={{ width: `${maxCount > 0 ? (row.count / maxCount) * 100 : 0}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
