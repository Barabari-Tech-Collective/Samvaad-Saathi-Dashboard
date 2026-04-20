"use client"

import { CollegeDetailKpiSection } from "./_components/college-detail-kpi-section"
import { CollegePracticeMetricsCard } from "./_components/college-practice-metrics-card"
import { CollegeScoreTrendChart } from "./_components/college-score-trend-chart"
import { CollegeStudentGrowthChart } from "./_components/college-student-growth-chart"
import { CollegeStudentsSection } from "./_components/college-students-section"
import { CollegeWeakSkillsCardRoot } from "./_components/college-weak-skills-card"
import { useCollegeNameFromRoute } from "./_components/use-college-name-from-route"

export default function CollegeDetailPage() {
  const collegeName = useCollegeNameFromRoute()

  if (!collegeName) {
    return <p className="px-4 text-sm text-destructive lg:px-6">Missing college name.</p>
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{collegeName}</h1>

      <CollegeDetailKpiSection collegeName={collegeName} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CollegeStudentGrowthChart collegeName={collegeName} />
        <CollegeScoreTrendChart collegeName={collegeName} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CollegePracticeMetricsCard
          collegeName={collegeName}
          title="Practice metrics"
          description="Practice activity distribution"
        />
        <CollegeWeakSkillsCardRoot
          collegeName={collegeName}
          title="Weak skills"
          description="Areas that need attention"
        />
      </div>

      <CollegeStudentsSection collegeName={collegeName} />
    </div>
  )
}
