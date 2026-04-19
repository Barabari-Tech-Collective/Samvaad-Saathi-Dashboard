import type { KpiItem } from "@/lib/api/hooks/analytics"

export function formatKpiDisplayValue(k: KpiItem): string {
  if (k.value === null || k.value === undefined) return "—"
  if (typeof k.value !== "number") return String(k.value)
  if (k.unit === "percent") return `${k.value}%`
  if (k.unit === "score") return k.value.toFixed(2)
  if (k.unit === "ratio") {
    if (k.value >= 0 && k.value <= 1) return `${(k.value * 100).toFixed(0)}%`
    return k.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return k.value.toLocaleString()
}

export function kpiBadgeLabel(unit: string | null, key: string): string {
  if (unit === "percent") return "%"
  if (unit === "score") return "score"
  if (unit === null || unit === "") return key.replace(/_/g, " ")
  return unit
}

export function formatDurationSeconds(s: number | null | undefined): string {
  if (s == null || Number.isNaN(s)) return "—"
  if (s < 60) return `${Math.round(s)}s`
  if (s < 3600) {
    const m = Math.floor(s / 60)
    const sec = Math.round(s % 60)
    return sec ? `${m}m ${sec}s` : `${m}m`
  }
  const h = s / 3600
  return `${h >= 10 ? h.toFixed(0) : h.toFixed(1)}h`
}

/** Interview list `duration` may be seconds (typical) or legacy minutes when small. */
export function formatInterviewListDuration(duration: number | null | undefined): string {
  if (duration == null || Number.isNaN(duration)) return "—"
  if (duration >= 90) return formatDurationSeconds(duration)
  return `${duration} min`
}
