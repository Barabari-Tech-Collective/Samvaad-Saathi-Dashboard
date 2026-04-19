import type { Metadata } from "next"
import { InterviewDetailClient } from "./interview-detail-client"


type PageProps = Readonly<{
    params: Promise<{ id: string }>
}>

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    return {
        title: `Interview ${decodeURIComponent(id)}`,
        description: "Interview analytics and scores.",
    }
}

export default async function InterviewDetailPage({ params }: PageProps) {
    const { id } = await params
    return <InterviewDetailClient interviewIdParam={decodeURIComponent(id)} />
}
