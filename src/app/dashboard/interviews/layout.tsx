import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Interviews",
  description:
    "Interview metrics, difficulty breakdowns, and a searchable list of sessions.",
}

export default function InterviewsLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return children
}
