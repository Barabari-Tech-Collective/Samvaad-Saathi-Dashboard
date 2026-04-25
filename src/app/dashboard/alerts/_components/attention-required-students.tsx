import Link from "next/link"
import * as React from "react"

import { SeverityBadge } from "@/components/severity-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardAttentionRequired } from "@/lib/api/hooks/analytics"

interface AttentionRequiredStudentsProps {
  filters: {
    startDate?: string
    endDate?: string
    role?: string
    difficulty?: string
  }
}

export function AttentionRequiredStudents({ filters }: AttentionRequiredStudentsProps) {
  const [attentionPage, setAttentionPage] = React.useState(1)
  
  const {
    attentionRequired,
    isLoadingAttentionRequired,
    isError: attentionError,
    error: attentionErrObj,
  } = useDashboardAttentionRequired({
    page: attentionPage,
    limit: 10,
    ...filters,
  })

  const attentionItems = attentionRequired?.items ?? []
  const attentionTotalPages = attentionRequired?.total ? Math.ceil(attentionRequired.total / 10) : 1
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Attention required students</CardTitle>
        <CardDescription>Prioritized list from dashboard attention endpoint.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto space-y-4">
        {isLoadingAttentionRequired ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : attentionError ? (
          <p className="text-sm text-destructive">
            {attentionErrObj instanceof Error
              ? attentionErrObj.message
              : "Failed to load attention-required list."}
          </p>
        ) : attentionItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students currently flagged for attention with selected filters.
          </p>
        ) : (
          <>
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Severity</th>
                  <th className="pb-2 pr-3 font-medium">Type</th>
                  <th className="pb-2 pr-3 font-medium">Student ID</th>
                  <th className="pb-2 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {attentionItems.map((item, index) => (
                  <tr key={`${item.type}-${item.user_id}-${index}`} className="border-b last:border-0">
                    <td className="py-2 pr-3">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="py-2 pr-3">{item.type.replaceAll("_", " ")}</td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      <Link
                        href={`/dashboard/students/${item.user_id}`}
                        className="hover:underline text-primary"
                      >
                        {item.user_id}
                      </Link>
                    </td>
                    <td className="py-2 text-muted-foreground">{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-end space-x-2 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAttentionPage(Math.max(1, attentionPage - 1))}
                disabled={attentionPage <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground flex items-center px-2">
                Page {attentionPage} of {Math.max(1, attentionTotalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAttentionPage(Math.min(attentionTotalPages, attentionPage + 1))}
                disabled={attentionPage >= attentionTotalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
