import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Platform KPIs, charts, and recent activity across interviews and students.",
}

export default function OverviewLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return children
}
