"use client"

import { DashboardAttentionSkeleton } from "@/components/dashboard/analytics-skeletons"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDashboardAttentionRequired } from "@/lib/api/hooks/analytics"

import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardAttentionRequired() {
    const { dateFilters } = useDashboardOverviewRange()
    const { attentionRequired, isLoadingAttentionRequired } = useDashboardAttentionRequired({
        limit: 10,
        ...dateFilters,
    })

    const items = attentionRequired?.items ?? []
    const total = attentionRequired?.total

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base">
                    Attention required
                    {total != null ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            {items.length} of {total} shown
                        </span>
                    ) : null}
                </CardTitle>
                <CardDescription>Students who may need follow-up</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                {isLoadingAttentionRequired ? (
                    <DashboardAttentionSkeleton rows={4} />
                ) : (
                    items.map((a, index) => (
                        <div
                            key={`${a.entity_type}-${a.user_id}-${a.type}-${index}`}
                            className="rounded-md border px-3 py-2 text-sm"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant={a.severity === "critical" ? "destructive" : "secondary"}
                                    className="text-xs capitalize"
                                >
                                    {a.severity}
                                </Badge>
                                <span className="font-medium">{a.type.replace(/_/g, " ")}</span>
                            </div>
                            <p className="mt-1 text-muted-foreground">{a.message}</p>
                            <p className="mt-1 text-xs text-muted-foreground">User #{a.user_id}</p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
