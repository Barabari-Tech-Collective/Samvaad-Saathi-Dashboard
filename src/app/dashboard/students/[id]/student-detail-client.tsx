"use client"

import * as React from "react"

import { StudentInterviewsTable } from "./_components/student-interviews-table"
import { StudentLatestFeedbackCard } from "./_components/student-latest-feedback-card"
import { StudentPracticeCompletionCard } from "./_components/student-practice-completion-card"
import { StudentProfileCard } from "./_components/student-profile-card"
import { StudentScoreHistoryChart } from "./_components/student-score-history-chart"
import { StudentSkillAveragesChart } from "./_components/student-skill-averages-chart"
import { StudentSpeechVsKnowledgeChart } from "./_components/student-speech-vs-knowledge-chart"
import { StudentSummaryKpis } from "./_components/student-summary-kpis"

function parseStudentId(raw: string): number | string {
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) ? n : raw
}

export function StudentDetailClient({ studentIdParam }: Readonly<{ studentIdParam: string }>) {
    const studentId = React.useMemo(() => parseStudentId(studentIdParam), [studentIdParam])

    return (
        <div className="flex flex-col gap-6 px-4 py-4 lg:px-6">

            <StudentProfileCard studentId={studentId} />

            <section className="space-y-2">
                <h2 className="text-sm font-medium text-muted-foreground">Summary</h2>
                <StudentSummaryKpis studentId={studentId} />
            </section>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <StudentScoreHistoryChart studentId={studentId} />
                <StudentSpeechVsKnowledgeChart studentId={studentId} />
            </div>

            <StudentSkillAveragesChart studentId={studentId} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <StudentPracticeCompletionCard studentId={studentId} />
                <StudentLatestFeedbackCard studentId={studentId} />
            </div>

            <StudentInterviewsTable studentId={studentId} />
        </div>
    )
}
