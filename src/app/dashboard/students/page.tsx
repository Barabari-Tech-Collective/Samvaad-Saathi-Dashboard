"use client"

import { StudentsKpiSection } from "./_components/students-kpi-section"
import { StudentsSectionNav } from "./_components/students-section-nav"
import { StudentsTableCard } from "./_components/students-table-card"

function StudentsPage() {
    return (
        <>
            <StudentsSectionNav />
            <StudentsKpiSection />
            <StudentsTableCard />
        </>
    )
}

export default StudentsPage;