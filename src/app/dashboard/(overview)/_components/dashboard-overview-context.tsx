"use client"

import * as React from "react"
import dayjs from "dayjs"

import { useIsMobile } from "@/hooks/use-mobile"
import type { DashboardDateRoleFilter } from "@/lib/api/hooks/analytics"

export type DashboardRangePreset = "7d" | "30d" | "90d" | "all"

type DashboardOverviewContextValue = Readonly<{
  preset: DashboardRangePreset
  setPreset: (p: DashboardRangePreset) => void
  dateFilters: DashboardDateRoleFilter
}>

const DashboardOverviewContext = React.createContext<DashboardOverviewContextValue | null>(
  null,
)

export function presetToDateFilters(preset: DashboardRangePreset): DashboardDateRoleFilter {
  if (preset === "all") return {}
  const end = dayjs().endOf("day")
  const start =
    preset === "7d"
      ? end.subtract(7, "day").startOf("day")
      : preset === "30d"
        ? end.subtract(30, "day").startOf("day")
        : end.subtract(90, "day").startOf("day")
  return {
    start_date: start.format("YYYY-MM-DD"),
    end_date: end.format("YYYY-MM-DD"),
  }
}

export function DashboardOverviewProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [preset, setPreset] = React.useState<DashboardRangePreset>("90d")

  React.useEffect(() => {
    if (isMobile) setPreset("7d")
  }, [isMobile])

  const dateFilters = React.useMemo(() => presetToDateFilters(preset), [preset])

  const value = React.useMemo(
    () =>
      ({
        preset,
        setPreset,
        dateFilters,
      }) satisfies DashboardOverviewContextValue,
    [preset, dateFilters],
  )

  return (
    <DashboardOverviewContext.Provider value={value}>{children}</DashboardOverviewContext.Provider>
  )
}

export function useDashboardOverviewRange() {
  const ctx = React.useContext(DashboardOverviewContext)
  if (!ctx) {
    throw new Error("useDashboardOverviewRange must be used within DashboardOverviewProvider")
  }
  return ctx
}
