"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useRoleDetail, useRolesPerformance } from "@/lib/api/hooks/analytics"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"

const EMPTY = "__none__"

export function RoleDetail() {
  const { dateFilters } = useDashboardOverviewRange()
  const { rolesPerformance } = useRolesPerformance(dateFilters)
  const roleRows = rolesPerformance?.items ?? []

  const [selectedRole, setSelectedRole] = React.useState<string>(EMPTY)
  const { roleDetail, isLoadingRoleDetail } = useRoleDetail(
    selectedRole === EMPTY ? undefined : selectedRole,
  )

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role detail</CardTitle>
          <CardDescription>Drill into one role with role detail endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-w-sm space-y-1">
            <Label>Select role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY}>None</SelectItem>
                {roleRows.map((row) => (
                  <SelectItem key={row.role} value={row.role}>
                    {row.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedRole === EMPTY ? (
            <p className="text-sm text-muted-foreground">Choose a role to load detail data.</p>
          ) : isLoadingRoleDetail ? (
            <Skeleton className="h-40 w-full rounded-md" />
          ) : (
            <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
              {JSON.stringify(roleDetail?.items ?? [], null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
