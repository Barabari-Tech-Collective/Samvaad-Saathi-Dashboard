import type { TablerIcon } from "@tabler/icons-react"
import {
  IconActivity,
  IconAward,
  IconBook,
  IconChartBar,
  IconChecks,
  IconClipboardList,
  IconPercentage,
  IconSchool,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react"

const iconClass = "size-5 shrink-0 text-muted-foreground"

/** Picks an icon from the KPI `key` string (e.g. `total_students`). */
export function KpiIcon({ kpiKey }: Readonly<{ kpiKey: string }>) {
  const k = kpiKey.toLowerCase()
  let Icon: TablerIcon = IconChartBar
  if (k.includes("student")) Icon = IconUsers
  else if (k.includes("college") || k.includes("school")) Icon = IconSchool
  else if (k.includes("interview") || k.includes("session")) Icon = IconClipboardList
  else if (k.includes("completion") || k.includes("complete")) Icon = IconChecks
  else if (k.includes("improve")) Icon = IconSparkles
  else if (k.includes("score") || k.includes("avg")) Icon = IconAward
  else if (k.includes("percent") || (k.includes("rate") && !k.includes("score"))) Icon = IconPercentage
  else if (k.includes("active") || k.includes("trend")) Icon = IconActivity
  else if (k.includes("practice") || k.includes("skill")) Icon = IconBook

  return <Icon className={iconClass} aria-hidden />
}
