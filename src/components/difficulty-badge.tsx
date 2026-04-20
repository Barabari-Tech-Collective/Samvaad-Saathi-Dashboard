import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type DifficultyBucket = "easy" | "medium" | "hard" | "unknown"

const EASY = new Set(["easy", "beginner", "novice"])
const MEDIUM = new Set(["medium", "intermediate"])
const HARD = new Set(["hard", "advanced", "expert", "difficult"])

export function normalizeDifficulty(raw: string | null | undefined): DifficultyBucket {
  if (raw == null || !String(raw).trim()) {
    return "unknown"
  }
  const key = String(raw).trim().toLowerCase()
  if (EASY.has(key)) return "easy"
  if (MEDIUM.has(key)) return "medium"
  if (HARD.has(key)) return "hard"
  for (const word of key.split(/\s+/)) {
    if (EASY.has(word)) return "easy"
    if (MEDIUM.has(word)) return "medium"
    if (HARD.has(word)) return "hard"
  }
  return "unknown"
}

export function difficultyBadgeClassName(bucket: DifficultyBucket): string {
  switch (bucket) {
    case "easy":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
    case "medium":
      return "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
    case "hard":
      return ""
    case "unknown":
      return "border-border text-muted-foreground"
  }
}

function formatDifficultyLabel(raw: string | null | undefined): string {
  if (raw == null || !String(raw).trim()) {
    return "—"
  }
  return String(raw)
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

type DifficultyBadgeProps = Omit<React.ComponentProps<typeof Badge>, "variant"> & {
  difficulty: string | null | undefined
}

export function DifficultyBadge({ difficulty, className, ...props }: Readonly<DifficultyBadgeProps>) {
  const bucket = normalizeDifficulty(difficulty)
  const variant = bucket === "hard" ? "destructive" : "outline"
  const label = formatDifficultyLabel(difficulty)

  return (
    <Badge
      variant={variant}
      className={cn("capitalize", difficultyBadgeClassName(bucket), className)}
      {...props}
    >
      {label}
    </Badge>
  )
}
