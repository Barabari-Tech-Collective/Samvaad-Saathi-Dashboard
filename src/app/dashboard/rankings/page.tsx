"use client"

import * as React from "react"

import { DashboardDateRangeTabs } from "@/app/dashboard/(overview)/_components/dashboard-date-range-tabs"
import {
  DashboardOverviewProvider,
} from "@/app/dashboard/(overview)/_components/dashboard-overview-context"
import { RankingsSummary } from "./_components/rankings-summary"
import { TopPerformers } from "./_components/top-performers"
import { StrugglingStudents } from "./_components/struggling-students"
import { MostImproved } from "./_components/most-improved"

function RankingsPageContent() {
  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 p-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Rankings</h1>
          <p className="text-sm text-muted-foreground">
            Top performers, struggling students, and improvement rankings.
          </p>
        </div>
        <DashboardDateRangeTabs className="w-full sm:w-auto sm:min-w-[20rem]" />
      </div>

      <RankingsSummary />
      <TopPerformers />
      <StrugglingStudents />
      <MostImproved />
    </div>
  )
}

export default function RankingsPage() {
  return (
    <DashboardOverviewProvider>
      <RankingsPageContent />
    </DashboardOverviewProvider>
  )
}
