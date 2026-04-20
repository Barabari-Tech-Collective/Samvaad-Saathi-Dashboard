"use client"

import { useParams } from "next/navigation"

export function useCollegeNameFromRoute(): string | undefined {
  const params = useParams()
  const raw = params?.collegeName
  const segment = Array.isArray(raw) ? raw[0] : raw
  if (typeof segment !== "string" || segment.length === 0) return undefined
  try {
    return decodeURIComponent(segment).trim() || undefined
  } catch {
    return undefined
  }
}
