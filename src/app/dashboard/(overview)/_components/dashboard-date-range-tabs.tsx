"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { DashboardRangePreset } from "./dashboard-overview-context"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const PRESET_OPTIONS: ReadonlyArray<{ value: DashboardRangePreset; label: string }> = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "1 month" },
  { value: "90d", label: "3 months" },
  { value: "all", label: "All time" },
]

export function DashboardDateRangeTabs({ className }: { className?: string }) {
  const { preset, setPreset } = useDashboardOverviewRange()

  const label = PRESET_OPTIONS.find((o) => o.value === preset)?.label ?? "Range"

  return (
    <div className={className}>
      <div className="hidden @[640px]/main:block">
        <Tabs
          value={preset}
          onValueChange={(v) => setPreset(v as DashboardRangePreset)}
          orientation="horizontal"
          className="w-full gap-0"
        >
          <TabsList variant="line" className="w-full min-w-0 flex-wrap justify-start">
            {PRESET_OPTIONS.map((o) => (
              <TabsTrigger key={o.value} value={o.value} className="shrink-0 px-3">
                {o.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="@[640px]/main:hidden">
        <Select value={preset} onValueChange={(v) => setPreset(v as DashboardRangePreset)}>
          <SelectTrigger size="sm" className="w-full min-w-[9rem]" aria-label="Date range">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {PRESET_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="rounded-lg">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
