import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Colleges",
  description: "Compare institutions by enrollment, interviews, scores, and activity.",
}

export default function CollegesLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
  )
}
