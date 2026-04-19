import type { Metadata } from "next"

import { StudentDetailClient } from "./student-detail-client"

type PageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Student ${decodeURIComponent(id)}`,
    description: "Student profile and analytics.",
  }
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { id } = await params
  return <StudentDetailClient studentIdParam={decodeURIComponent(id)} />
}
