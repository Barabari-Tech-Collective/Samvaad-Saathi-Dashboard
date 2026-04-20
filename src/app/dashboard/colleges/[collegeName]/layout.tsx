import type { Metadata } from "next"
import type { ReactNode } from "react"

type LayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{ collegeName: string }>
}>

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { collegeName } = await params
  const name = decodeURIComponent(collegeName)
  return {
    title: `College · ${name}`,
    description: "Institution analytics and student roster.",
  }
}

export default function CollegeDetailLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children
}
