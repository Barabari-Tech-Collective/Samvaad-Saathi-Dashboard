"use client"

import * as React from "react"

import { StudentsTableSkeleton } from "@/components/dashboard/analytics-skeletons"

import { StudentsKpiSection } from "./_components/students-kpi-section"
import { StudentsTableCard } from "./_components/students-table-card"

function StudentsPage() {
  return (
    <>
      <StudentsKpiSection />
      <React.Suspense
        fallback={
          <div className="px-4 lg:px-6">
            <StudentsTableSkeleton rows={10} />
          </div>
        }
      >
        <StudentsTableCard />
      </React.Suspense>
    </>
  )
}

export default StudentsPage