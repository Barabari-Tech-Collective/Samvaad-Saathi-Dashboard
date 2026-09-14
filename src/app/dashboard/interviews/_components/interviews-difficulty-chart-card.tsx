"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ChartBarSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useDifficultyMetrics, useJobProfilesList } from "@/lib/api/hooks/analytics"

const difficultyConfig = {
  avgScore: { label: "Avg score", color: "var(--primary)" },
  completionRate: { label: "Completion %", color: "var(--chart-2)" },
} satisfies ChartConfig

export function InterviewsDifficultyChartCard() {
  const [selectedRole, setSelectedRole] = React.useState<string>("all")

  const { jobProfiles } = useJobProfilesList()
  const dynamicRoles = React.useMemo(() => {
    const rolesSet = new Set<string>()
    jobProfiles.forEach((p) => {
      if (p.jobName) {
        rolesSet.add(p.jobName)
      }
    })
    return Array.from(rolesSet).sort()
  }, [jobProfiles])

  const {
    difficultyMetrics,
    isLoadingDifficultyMetrics,
    isError,
    error,
    isFetching,
  } = useDifficultyMetrics({
    ...(selectedRole !== "all" && { role: selectedRole }),
  })

  const chartData = React.useMemo(
    () =>
      (difficultyMetrics?.items ?? []).map((d) => ({
        difficulty: d.difficulty,
        avgScore: d.avg_score ?? 0,
        completionRate: d.completion_rate ?? 0,
      })),
    [difficultyMetrics?.items],
  )

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="text-base">Average score by difficulty</CardTitle>
            <CardDescription>Score and completion rate by difficulty band</CardDescription>
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px] shrink-0 truncate">
              <SelectValue placeholder="Select role" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {dynamicRoles.map((role) => (
                <SelectItem key={role} value={role} className="truncate">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isError ? (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to load difficulty metrics"}
            </p>
          ) : isLoadingDifficultyMetrics ? (
            <ChartBarSkeleton className="h-[240px] w-full" />
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available for this role.</p>
          ) : (
            <div className={`transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}>
              <ChartContainer config={difficultyConfig} className="aspect-auto h-[240px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="difficulty" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="completionRate"
                    fill="var(--color-completionRate)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
