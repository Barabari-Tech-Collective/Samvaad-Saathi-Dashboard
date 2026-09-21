"use client"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardRecentTableSkeleton } from "@/components/dashboard/analytics-skeletons"
import { useInterviewQuestionScores } from "@/lib/api/hooks/analytics"
import { cn } from "@/lib/utils"

function ExpandableText({ text }: Readonly<{ text: string }>) {
  const [expanded, setExpanded] = React.useState(false)
  const isLong = text.length > 100
  if (!isLong) return <span className="break-words">{text}</span>
  
  return (
    <div className="flex flex-col items-start gap-1">
      <span className={cn("break-words", !expanded && "line-clamp-3")}>{text}</span>
      <button 
        type="button" 
        onClick={() => setExpanded(!expanded)} 
        className="text-xs text-primary hover:underline font-semibold tracking-wide"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  )
}

function summarizeRow(item: unknown): Record<string, string> {
  if (item == null) return { value: "—" }
  if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
    return { value: String(item) }
  }
  if (Array.isArray(item)) {
    return { value: JSON.stringify(item) }
  }
  if (typeof item === "object") {
    const o = item as Record<string, unknown>
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(o)) {
      out[k] =
        v != null && typeof v === "object" ? JSON.stringify(v) : String(v ?? "—")
    }
    return out
  }
  return { value: String(item) }
}

export function InterviewQuestionScoresCard({
  interviewId,
}: Readonly<{ interviewId: number | string }>) {
  const {
    interviewQuestionScores,
    isLoadingInterviewQuestionScores,
    isError,
    error,
  } = useInterviewQuestionScores(interviewId)

  const items = interviewQuestionScores?.items ?? []
  const columns = React.useMemo(() => {
    const keys = new Set<string>()
    for (const item of items) {
      const row = summarizeRow(item)
      for (const k of Object.keys(row)) keys.add(k)
    }
    const ordered = [...keys]
    ordered.sort((a, b) => {
      if (a === "value" && b !== "value") return 1
      if (b === "value" && a !== "value") return -1
      return a.localeCompare(b)
    })
    return ordered
  }, [items])

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question scores</CardTitle>
          <CardDescription>Per-question results for this interview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load question scores"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Question scores</CardTitle>
        <CardDescription>
          Per-question results for this interview
          {interviewQuestionScores?.total != null ? (
            <span className="text-muted-foreground">
              {" "}
              · {interviewQuestionScores.total.toLocaleString()} total
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoadingInterviewQuestionScores && items.length === 0 ? (
          <DashboardRecentTableSkeleton rows={6} />
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No question scores for this interview.</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm border-collapse border border-border/60">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-left text-muted-foreground">
                <th className="p-3 font-semibold border-r border-border/60 w-12 text-center">#</th>
                {columns.map((col) => (
                  <th key={col} className="p-3 font-semibold capitalize border-r border-border/60 last:border-r-0">
                    {col.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const row = summarizeRow(item)
                return (
                  <tr key={idx} className="border-b border-border/60 last:border-b-0 hover:bg-muted/10">
                    <td className="p-3 tabular-nums font-bold text-foreground border-r border-border/60 text-center">{idx + 1}</td>
                    {columns.map((col) => (
                      <td key={col} className="max-w-[320px] p-3 align-top border-r border-border/60 last:border-r-0">
                        <ExpandableText text={row[col] ?? "—"} />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
