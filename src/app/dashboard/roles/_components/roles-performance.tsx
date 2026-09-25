"use client"

import * as React from "react"

import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useRolesPerformance } from "@/lib/api/hooks/analytics"

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
] as const

type DifficultyOption = (typeof DIFFICULTY_OPTIONS)[number]["value"]

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "it", label: "IT" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "Hr" },
  { value: "operations", label: "Operations" },
  { value: "data", label: "Data" },
] as const

type DomainOption = (typeof CATEGORY_OPTIONS)[number]["value"]

export function RolesPerformance() {
  const { dateFilters } = useDashboardOverviewRange()

   const [difficulty, setDifficulty] = React.useState<DifficultyOption>("all")

   const [category, setCategory] = React.useState<DomainOption>("all")

  
  const performanceFilters = React.useMemo(() => {
    return {
      ...dateFilters,
      ...(difficulty !== "all" ? { difficulty } : {}),
      ...(category !== "all" ? { category } : {}),
    }
  }, [dateFilters, difficulty, category])

   const { rolesPerformance, isLoadingRolesPerformance, isFetching } =
    useRolesPerformance(performanceFilters)

  const roleRows = rolesPerformance?.items ?? []

  return (
    <div className="px-4 lg:px-6">
      <Card>
        
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Role performance</CardTitle>
            <CardDescription>Interviews, score, drop-off, and weaknesses by role.</CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as DomainOption)}
            >
              <SelectTrigger className="w-[140px] sm:w-[150px]">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={difficulty}
              onValueChange={(val) => setDifficulty(val as DifficultyOption)}
            >
              <SelectTrigger className="w-[150px] sm:w-[160px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoadingRolesPerformance ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div
              className={`transition-opacity duration-200 ${
                isFetching ? "opacity-50" : "opacity-100"
              }`}
            >
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Role</th>
                    <th className="pb-2 pr-3 text-right font-medium">Students</th>
                    <th className="pb-2 pr-3 text-right font-medium">Interviews</th>
                    <th className="pb-2 pr-3 text-right font-medium">Avg Knowledge score</th>
                    <th className="pb-2 pr-3 text-right font-medium">Avg score</th>
                  </tr>
                </thead>
                <tbody>
                        {roleRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No role performance data available for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    roleRows.map((row) => (
                      <tr key={row.role} className="border-b last:border-0">
                        <td className="py-2 pr-3 font-medium">{row.role}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{row.total_students ?? "—"}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{row.interviews ?? "—"}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{row.avg_knowledge_score ?? "—"}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {row.avg_score ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
