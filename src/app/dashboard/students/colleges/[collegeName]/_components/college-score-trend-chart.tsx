"use client"

import { useCollegeScoreTrend } from "@/lib/api/hooks/analytics"

import { CollegeTrendChart } from "./college-trend-chart"

export function CollegeScoreTrendChart({
  collegeName,
}: Readonly<{ collegeName: string }>) {
  const {
    collegeScoreTrend,
    isLoadingCollegeScoreTrend,
    isError,
    error,
  } = useCollegeScoreTrend(collegeName)

  return (
    <CollegeTrendChart
      title="Score trend"
      description="Average score over time"
      seriesLabel="Score"
      data={collegeScoreTrend}
      isLoading={isLoadingCollegeScoreTrend}
      isError={isError}
      error={error}
    />
  )
}
