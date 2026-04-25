import * as React from "react"
import { IconAlertCircle, IconAlertOctagon, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type SeverityLevel = "low" | "medium" | "high" | "critical" | "warning" | string

interface SeverityBadgeProps extends React.ComponentPropsWithoutRef<typeof Badge> {
  severity: SeverityLevel
}

const severityConfig: Record<
  string,
  {
    icon: React.ElementType
    className: string
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  }
> = {
  low: {
    icon: IconInfoCircle,
    className:
      "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20 border-transparent",
    variant: "outline",
  },
  medium: {
    icon: IconAlertCircle,
    className:
      "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20 border-transparent",
    variant: "outline",
  },
  warning: {
    icon: IconAlertCircle,
    className:
      "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20 border-transparent",
    variant: "outline",
  },
  high: {
    icon: IconAlertTriangle,
    variant: "destructive",
    className: "",
  },
  critical: {
    icon: IconAlertOctagon,
    variant: "destructive",
    className: "",
  },
}

export function SeverityBadge({ severity, className, ...props }: SeverityBadgeProps) {
  const normalizedSeverity = typeof severity === "string" ? severity.toLowerCase() : ""
  const config = severityConfig[normalizedSeverity] || {
    icon: IconInfoCircle,
    variant: "secondary",
    className: "",
  }
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={cn(config.className, className)} {...props}>
      <Icon />
      <span className="capitalize">{severity}</span>
    </Badge>
  )
}
