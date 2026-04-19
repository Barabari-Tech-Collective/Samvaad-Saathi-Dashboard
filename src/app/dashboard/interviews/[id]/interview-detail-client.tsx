"use client"

import * as React from "react"
import { InterviewDetailKpis } from "./_components/interview-detail-kpis"
import { InterviewQuestionScoresCard } from "./_components/interview-question-scores-card"
import { InterviewQuestionTypeChart } from "./_components/interview-question-type-chart"
import { InterviewSpeechTimelineChart } from "./_components/interview-speech-timeline-chart"

function parseInterviewId(raw: string): number | string {
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) ? n : raw
}

export function InterviewDetailClient({
    interviewIdParam,
}: Readonly<{ interviewIdParam: string }>) {
    const interviewId = React.useMemo(() => parseInterviewId(interviewIdParam), [interviewIdParam])

    return (
        <div className="flex flex-col gap-6 px-4 py-4 lg:px-6">

            <section className="space-y-2">
                <h2 className="text-sm font-medium text-muted-foreground">Summary</h2>
                <InterviewDetailKpis interviewId={interviewId} />
            </section>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InterviewQuestionTypeChart interviewId={interviewId} />
                <InterviewSpeechTimelineChart interviewId={interviewId} />
            </div>

            <InterviewQuestionScoresCard interviewId={interviewId} />
        </div>
    )
}
