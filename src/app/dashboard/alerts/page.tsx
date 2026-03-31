"use client"

import { IconAlertTriangle, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { alerts, type AlertItem } from "@/lib/mock-data"

const severityIcon: Record<AlertItem["severity"], React.ReactNode> = {
  critical: <IconAlertTriangle className="size-5 text-red-500" />,
  warning: <IconAlertCircle className="size-5 text-amber-500" />,
  info: <IconInfoCircle className="size-5 text-blue-500" />,
}

const severityBadge: Record<AlertItem["severity"], string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

const studentAlerts = alerts.filter((a) => a.type === "student")
const systemAlerts = alerts.filter((a) => a.type === "system")

function AlertCard({ alert }: { alert: AlertItem }) {
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <div className="mt-0.5 shrink-0">{severityIcon[alert.severity]}</div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{alert.title}</span>
          <Badge className={`text-xs ${severityBadge[alert.severity]}`}>
            {alert.severity}
          </Badge>
          {alert.studentId && (
            <Badge variant="outline" className="text-xs">{alert.studentId}</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{alert.description}</p>
        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card>
          <CardHeader>
            <CardDescription>Critical</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-red-500">
              {alerts.filter((a) => a.severity === "critical").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Warning</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-amber-500">
              {alerts.filter((a) => a.severity === "warning").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Info</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-blue-500">
              {alerts.filter((a) => a.severity === "info").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Student alerts */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Alerts</CardTitle>
            <CardDescription>Issues requiring attention for individual students</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {studentAlerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System alerts */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Alerts</CardTitle>
            <CardDescription>Platform-wide issues and anomalies</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {systemAlerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
