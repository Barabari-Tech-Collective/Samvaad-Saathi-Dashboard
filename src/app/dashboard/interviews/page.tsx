"use client"

import { InterviewsDifficultyChartCard } from "./_components/interviews-difficulty-chart-card"
import { InterviewsKpiSection } from "./_components/interviews-kpi-section"
import { InterviewsQuestionAnalytics } from "./_components/interviews-question-analytics"
import { InterviewsTableCard } from "./_components/interviews-table-card"

export default function InterviewsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <InterviewsKpiSection />
      <InterviewsDifficultyChartCard />
      <InterviewsQuestionAnalytics />
      <InterviewsTableCard />
    </div>
  )
}
