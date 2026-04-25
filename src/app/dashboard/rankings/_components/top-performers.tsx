"use client"

import * as React from "react"
import { useDashboardOverviewRange } from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { useTopPerformers } from "@/lib/api/hooks/analytics"
import { RankingSection } from "./ranking-section"

export function TopPerformers() {
  const { dateFilters } = useDashboardOverviewRange()
  const [page, setPage] = React.useState(1)
  const { topPerformers, isLoadingTopPerformers } = useTopPerformers({ page, limit: 10, ...dateFilters })

  return (
    <RankingSection
      title="Top performers"
      description="Highest-performing students by average score."
      rows={topPerformers?.items ?? []}
      loading={isLoadingTopPerformers}
      page={page}
      setPage={setPage}
      totalItems={topPerformers?.total}
    />
  )
}
