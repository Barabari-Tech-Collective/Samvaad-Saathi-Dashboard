"use client"

import * as React from "react"

import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Change: Import shadcn Select components
// Why: Provides an accessible, styled dropdown menu allowing the user to select interview difficulty levels.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useRolesPerformance } from "@/lib/api/hooks/analytics"

// Change: Define available difficulty options including easy, medium, hard, extreme, expert, and an "all" fallback.
// Why: Standardizes difficulty keys matching user requirements and backend query conventions, while allowing users to reset/view all data.
const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
] as const

type DifficultyOption = (typeof DIFFICULTY_OPTIONS)[number]["value"]

// Change: Define available domain options including IT, Design, Sales, Marketing, Hr, Operations, Data, and an "all" fallback.
// Why: Standardizes domain taxonomy to allow filtering role performance analytics by functional department.
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

  // Change: Track current difficulty selection in local state (defaults to "all").
  // Why: Allows reactive filtering without resetting overview date ranges or losing context on filter change.
  const [difficulty, setDifficulty] = React.useState<DifficultyOption>("all")

  // Change: Track current domain selection in local state (defaults to "all").
  // Why: Allows reactive filtering by domain/department without resetting date range or difficulty filters.
  const [category, setCategory] = React.useState<DomainOption>("all")

  // Change: Memoize query filters combining overview date filters, difficulty, and domain.
  // Why: Ensures 'difficulty' and 'domain' are only sent to the API if specific options are chosen (omitted on "all"),
  // and prevents unnecessary query cache invalidations on irrelevant re-renders.
  const performanceFilters = React.useMemo(() => {
    return {
      ...dateFilters,
      ...(difficulty !== "all" ? { difficulty } : {}),
      ...(category !== "all" ? { category } : {}),
    }
  }, [dateFilters, difficulty, category])

  // Change: Pass 'performanceFilters' (containing difficulty and domain) into useRolesPerformance and extract 'isFetching'.
  // Why: When difficulty or domain changes, React Query detects the updated query key and automatically fetches fresh data.
  const { rolesPerformance, isLoadingRolesPerformance, isFetching } =
    useRolesPerformance(performanceFilters)

  const roleRows = rolesPerformance?.items ?? []

  return (
    // Change: Updated to 'px-4 lg:px-6' for responsive horizontal padding.
    // Why: Ensures standard layout consistency across mobile and desktop breakpoints with other dashboard cards.
    <div className="px-4 lg:px-6">
      <Card>
        {/* Change: Arranged header items using responsive flexbox (column on mobile, row on larger screens).
            Why: Places filter dropdowns alongside the card title neatly across all screen sizes. */}
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Role performance</CardTitle>
            <CardDescription>Interviews, score, drop-off, and weaknesses by role.</CardDescription>
          </div>
          {/* Change: Container grouping Domain and Difficulty Select dropdowns together with responsive wrapping.
              Why: Keeps filter controls organized, accessible, and prevents overflow on mobile viewports. */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Change: Render Domain Select dropdown.
                Why: Enables user interaction to filter role analytics by functional domain (IT, Design, Sales, Marketing, Hr, Operations, Data). */}
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

            {/* Change: Render difficulty Select dropdown.
                Why: Enables user interaction to filter role analytics by easy, medium, hard, or extreme/expert difficulty. */}
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
            /* Change: Added opacity-50 transition during background refetches (isFetching).
               Why: Provides visual feedback that fresh data is loading when switching filters without jarring skeleton flashes. */
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
                    {/* <th className="pb-2 font-medium">Weaknesses</th> */}
                  </tr>
                </thead>
                <tbody>
                  {/* Change: Added explicit empty state handling when no role items match the selected difficulty and domain filters.
                      Why: Prevents showing an empty, confusing blank table when no interviews match the filtered combination. */}
                  {roleRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No role performance data available for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    roleRows.map((row) => (
                      <tr key={row.role} className="border-b last:border-0">
                        <td className="py-2 pr-3 font-medium">{row.role}</td>
                        <td className="py-2 pr-3 text-right tabular-nums" >{row.total_students}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{row.interviews}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{row.avg_knowledge_score}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {row.avg_score ?? "—"}
                        </td>
                        {/* <td className="py-2 text-muted-foreground">{row.common_weaknesses.join(", ") || "—"}</td> */}
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
