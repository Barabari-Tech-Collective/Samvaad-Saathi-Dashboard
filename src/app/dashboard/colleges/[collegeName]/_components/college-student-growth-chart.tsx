"use client"

import { useCollegeStudentGrowth } from "@/lib/api/hooks/analytics"

import { CollegeTrendChart } from "./college-trend-chart"

export function CollegeStudentGrowthChart({
  collegeName,
}: Readonly<{ collegeName: string }>) {
  const {
    collegeStudentGrowth,
    isLoadingCollegeStudentGrowth,
    isError,
    error,
  } = useCollegeStudentGrowth(collegeName)

  return (
    <CollegeTrendChart
      title="Student growth"
      description="Enrollment or headcount trend for this institution"
      seriesLabel="Students"
      data={collegeStudentGrowth}
      isLoading={isLoadingCollegeStudentGrowth}
      isError={isError}
      error={error}
    />
  )
}
