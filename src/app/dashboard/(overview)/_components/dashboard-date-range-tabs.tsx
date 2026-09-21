"use client"



import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "../../../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import type { DashboardRangePreset } from "./dashboard-overview-context"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

const GLOBAL_PRESET_OPTIONS: ReadonlyArray<{ value: DashboardRangePreset; label: string }> = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "1 month" },
  { value: "90d", label: "3 months" },
  { value: "all", label: "All time" },
]

export function DashboardDateRangeTabs({ className }: { className?: string }) {
  const { preset, setPreset } = useDashboardOverviewRange()

  const label = GLOBAL_PRESET_OPTIONS.find((o) => o.value === preset)?.label ?? "Range"

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
            {GLOBAL_PRESET_OPTIONS.map((o) => (
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
            {GLOBAL_PRESET_OPTIONS.map((o) => (
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

const CHART_PRESET_OPTIONS: ReadonlyArray<{ value: DashboardRangePreset; label: string }> = [
  { value: "7d", label: "7D" },
  { value: "15d", label: "15D" },
  { value: "30d", label: "1M" },
  { value: "90d", label: "3M" },
  { value: "custom", label: "Custom" },
]

export function DashboardChartFilterTabs({ 
  className,
  preset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
}: { 
  className?: string
  preset: DashboardRangePreset
  onPresetChange: (preset: DashboardRangePreset) => void
  customRange?: DateRange
  onCustomRangeChange?: (range: DateRange | undefined) => void
}) {
  const label = CHART_PRESET_OPTIONS.find((o) => o.value === preset)?.label ?? "Range"

  return (
    <div className={className}>
      <div className="hidden @[640px]/main:block">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-full border shadow-sm">
          {CHART_PRESET_OPTIONS.map((o) => {
            const isActive = preset === o.value
            
            if (o.value === "custom") {
              return (
                <Popover key={o.value}>
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => onPresetChange(o.value)}
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1",
                        isActive
                          ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <CalendarIcon className="w-3 h-3" />
                      {o.label}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={customRange?.from}
                      selected={customRange}
                      onSelect={(range: DateRange | undefined) => {
                        onPresetChange("custom")
                        if (onCustomRangeChange) onCustomRangeChange(range)
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )
            }
            return (
              <button
                key={o.value}
                onClick={() => onPresetChange(o.value)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200",
                  isActive
                    ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                )}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="@[640px]/main:hidden">
        <Select value={preset} onValueChange={(v) => onPresetChange(v as DashboardRangePreset)}>
          <SelectTrigger size="sm" className="w-full min-w-[9rem] rounded-full" aria-label="Date range">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CHART_PRESET_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="rounded-lg text-sm">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
