import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsAlerts } from "@/lib/api/hooks/analytics"
import { AlertCard } from "./alert-card"

interface SystemAlertsProps {
  filters: {
    startDate?: string
    endDate?: string
    role?: string
    difficulty?: string
  }
}

export function SystemAlerts({ filters }: SystemAlertsProps) {
  const { analyticsAlerts, isLoadingAnalyticsAlerts, isError: alertsError, error: alertsErrObj } =
    useAnalyticsAlerts(filters)

  const systemAlerts = analyticsAlerts?.systemAlerts ?? []
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System alerts</CardTitle>
        <CardDescription>Role/system-level risk signals and failure patterns.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {isLoadingAnalyticsAlerts ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : alertsError ? (
          <p className="text-sm text-destructive">
            {alertsErrObj instanceof Error ? alertsErrObj.message : "Failed to load alerts."}
          </p>
        ) : systemAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No system alerts found for selected filters.</p>
        ) : (
          systemAlerts.slice(0, 10).map((alert, index) => (
            <AlertCard key={`${alert.type}-${index}`} alert={alert} index={index} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
