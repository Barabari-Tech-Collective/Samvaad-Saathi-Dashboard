"use client"

import * as React from "react"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { useMostImprovedStudents } from "@/lib/api/hooks/analytics"
import { RankingSection } from "./ranking-section"

export function MostImproved() {
  const { dateFilters } = useDashboardOverviewRange()
  const [page, setPage] = React.useState(1)
  const { mostImprovedStudents, isLoadingMostImprovedStudents } = useMostImprovedStudents({
    page,
    limit: 10,
    ...dateFilters,
  })

  return (
    <RankingSection
      title="Most improved"
      description="Largest positive change in performance."
      rows={mostImprovedStudents?.items ?? []}
      loading={isLoadingMostImprovedStudents}
      page={page}
      setPage={setPage}
      totalItems={mostImprovedStudents?.total}
    />
  )
}
