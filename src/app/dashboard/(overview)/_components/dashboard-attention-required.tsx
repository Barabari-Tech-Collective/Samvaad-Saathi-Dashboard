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

import { Link } from "next-view-transitions"
import { useDashboardOverviewRange } from "./dashboard-overview-context"
import { Button } from "@/components/ui/button"

export function DashboardAttentionRequired() {
    const { dateFilters } = useDashboardOverviewRange()
    const { attentionRequired, isLoadingAttentionRequired } = useDashboardAttentionRequired({
        limit: 5,
        ...dateFilters,
    })

    const items = attentionRequired?.items ?? []

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                <CardTitle className="text-base">
                    Attention required
                </CardTitle>
                <CardDescription>Students who may need follow-up</CardDescription>
                </div>
                 <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <Link href="/dashboard/alerts">View all alerts</Link>
                </Button>
            </CardHeader>
            <CardContent className="grid gap-3">
                {isLoadingAttentionRequired ? (
                    <DashboardAttentionSkeleton rows={4} />
                ) : (
                    items.map((attention, index) => (
                        <div
                            key={`${attention.entity_type}-${attention.user_id}-${attention.type}-${index}`}
                            className="rounded-md border px-3 py-2 text-sm"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant={attention.severity === "critical" ? "destructive" : "secondary"}
                                    className="text-xs capitalize"
                                >
                                    {attention.severity}
                                </Badge>
                                <span className="font-medium">{attention.type.replace(/_/g, " ")}</span>
                            </div>
                            <p className="mt-1 text-muted-foreground">{attention.message}</p>
                            <Link href={`/dashboard/students/${attention.user_id}`} className="mt-1 text-xs ">User #{attention.user_id}</Link>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
