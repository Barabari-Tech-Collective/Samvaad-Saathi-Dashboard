"use client"

import * as React from "react"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { useStrugglingStudents } from "@/lib/api/hooks/analytics"
import { RankingSection } from "./ranking-section"

export function StrugglingStudents() {
  const { dateFilters } = useDashboardOverviewRange()
  const [page, setPage] = React.useState(1)
  const { strugglingStudents, isLoadingStrugglingStudents } = useStrugglingStudents({ page, limit: 10, ...dateFilters })

  return (
    <RankingSection
      title="Struggling students"
      description="Students currently below expected threshold."
      rows={strugglingStudents?.items ?? []}
      loading={isLoadingStrugglingStudents}
      page={page}
      setPage={setPage}
      totalItems={strugglingStudents?.total}
    />
  )
}
