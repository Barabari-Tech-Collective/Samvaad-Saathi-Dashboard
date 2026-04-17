import type { Metadata } from "next"
import type { ReactNode } from "react"

import { StudentsSectionNav } from "@/components/dashboard/students-section-nav"

export const metadata: Metadata = {
  description: "Browse students, drill into profiles, and compare colleges.",
}

export default function StudentsLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <StudentsSectionNav />
      {children}
    </div>
  )
}
