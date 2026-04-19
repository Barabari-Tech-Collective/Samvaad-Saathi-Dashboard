import type { Metadata } from "next"

import { CollegesPageClient } from "./colleges-page-client"

export const metadata: Metadata = {
  title: "Colleges",
  description: "Compare institutions by enrollment, interviews, scores, and activity.",
}

export default function CollegesPage() {
  return <CollegesPageClient />
}
