"use client"

import * as React from "react"

import { StudentDetailEmpty } from "@/app/dashboard/students/[id]/_components/student-detail-empty"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCollegeWeakSkills } from "@/lib/api/hooks/analytics"

type HeatmapPayload = Readonly<{
    chartType: "heatmap"
    items: readonly { x: string; y: string; value: number }[]
}>

function isHeatmapPayload(data: unknown): data is HeatmapPayload {
    if (data === null || typeof data !== "object") return false
    const d = data as { chartType?: unknown; items?: unknown }
    return d.chartType === "heatmap" && Array.isArray(d.items)
}

type BlockProps = Readonly<{
    title: string
    description: string
    data: unknown
    isLoading: boolean
    isError: boolean
    error: unknown
}>

export function CollegeWeakSkillsCard({
    title,
    description,
    data,
    isLoading,
    isError,
    error,
}: BlockProps) {
    const heatmap = isHeatmapPayload(data) ? data : null
    const rows = heatmap?.items ?? []

    const groupedData = React.useMemo(() => {
        if (!rows.length) return {}

        const merged = new Map<string, { role: string; skill: string; count: number }>()

        for (const item of rows) {
            const key = `${item.x}__${item.y}`

            if (!merged.has(key)) {
                merged.set(key, {
                    role: item.x,
                    skill: item.y,
                    count: 0,
                })
            }

            merged.get(key)!.count += item.value
        }

        const byRole: Record<string, { skill: string; count: number }[]> = {}

        for (const value of merged.values()) {
            if (!byRole[value.role]) byRole[value.role] = []

            byRole[value.role].push({
                skill: value.skill,
                count: value.count,
            })
        }

        for (const role of Object.keys(byRole)) {
            byRole[role] = byRole[role].sort((a, b) => b.count - a.count).slice(0, 5)
        }

        return byRole
    }, [rows])

    const roles = Object.keys(groupedData)

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                {isLoading && !data ? (
                    <div className="space-y-2">
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                    </div>
                ) : isError ? (
                    <p className="text-sm text-destructive">
                        {error instanceof Error ? error.message : "Could not load weak skills."}
                    </p>
                ) : roles.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                        {roles.map((role) => {
                            const items = groupedData[role]
                            const max = items[0]?.count ?? 1

                            return (
                                <AccordionItem key={role} value={role}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex w-full items-center justify-between pr-4">
                                            <span className="text-left font-medium capitalize">{role}</span>

                                            <Badge variant="secondary">
                                                {items.reduce((sum, item) => sum + item.count, 0)} issues
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="space-y-4 pt-1">
                                            {items.map((item, index) => (
                                                <div key={`${role}-${index}`} className="space-y-2">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p className="line-clamp-2 text-sm text-muted-foreground">{item.skill}</p>

                                                        <span className="text-xs tabular-nums text-muted-foreground">
                                                            {item.count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                ) : (
                    <StudentDetailEmpty
                        title="No weak skills breakdown"
                        description="Data may be unavailable for this institution or format."
                    />
                )}
            </CardContent>
        </Card>
    )
}

export function CollegeWeakSkillsCardRoot({
    collegeName,
    title,
    description,
}: Readonly<{
    collegeName: string
    title: string
    description: string
}>) {
    const {
        collegeWeakSkills,
        isLoadingCollegeWeakSkills,
        isError,
        error,
    } = useCollegeWeakSkills(collegeName)

    return (
        <CollegeWeakSkillsCard
            title={title}
            description={description}
            data={collegeWeakSkills}
            isLoading={isLoadingCollegeWeakSkills}
            isError={isError}
            error={error}
        />
    )
}
