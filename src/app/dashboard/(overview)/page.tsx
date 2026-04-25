"use client"

import { DashboardActiveUsersChart } from "./_components/dashboard-active-users-chart"
import { DashboardAttentionRequired } from "./_components/dashboard-attention-required"
import { DashboardDateRangeTabs } from "./_components/dashboard-date-range-tabs"
import { DashboardInterviewsPerDayChart } from "./_components/dashboard-interviews-per-day-chart"
import { DashboardKpiSection } from "./_components/dashboard-kpi-section"
import { DashboardOverviewProvider } from "./_components/dashboard-overview-context"
import { DashboardRecentInterviews } from "./_components/dashboard-recent-interviews"
import { DashboardRecentStudents } from "./_components/dashboard-recent-students"
import { DashboardScoreDistributionChart } from "./_components/dashboard-score-distribution-chart"
import { DashboardTopCollegesChart } from "./_components/dashboard-top-colleges-chart"
import { DashboardTopRolesChart } from "./_components/dashboard-top-roles-chart"
import { DashboardPredictiveAlerts } from "./_components/dashboard-predictive-alerts"
import { DashboardBenchmarking } from "./_components/dashboard-benchmarking"
import { DashboardDropoffFunnel } from "./_components/dashboard-dropoff-funnel"
import { DashboardForecasting } from "./_components/dashboard-forecasting"
import { DashboardQuestionsAnalytics } from "./_components/dashboard-questions-analytics"

export default function DashboardPage() {
  return (
    <DashboardOverviewProvider>
      <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
          <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
        </div>

        <div className="px-4 lg:px-6">
          <DashboardKpiSection />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 px-4 lg:grid-cols-2 lg:px-6">
          <DashboardInterviewsPerDayChart />
          <DashboardActiveUsersChart />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 px-4 lg:grid-cols-3 lg:px-6">
          <DashboardTopRolesChart />
          <DashboardTopCollegesChart />
          <DashboardScoreDistributionChart />
        </div>

        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <DashboardRecentInterviews />
          <DashboardRecentStudents />
          <DashboardAttentionRequired />
          
            <DashboardPredictiveAlerts />
            <DashboardBenchmarking />
         
          
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            <DashboardDropoffFunnel />
            <DashboardForecasting />
          </div>
          
          <DashboardQuestionsAnalytics />
        </div>
      </div>
    </DashboardOverviewProvider>
  )
}
