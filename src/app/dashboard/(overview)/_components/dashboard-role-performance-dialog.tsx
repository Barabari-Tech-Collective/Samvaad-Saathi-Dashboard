"use client"

import * as React from "react"
import { IconTable } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRolePerformanceSummary } from "@/lib/api/hooks/analytics"
import { useDashboardOverviewRange } from "./dashboard-overview-context"

export function DashboardRolePerformanceDialog() {
  const { dateFilters } = useDashboardOverviewRange()
  const { rolePerformanceSummary, isLoadingRolePerformanceSummary } =
    useRolePerformanceSummary(dateFilters)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" className="gap-2 shadow-sm">
          <IconTable className="size-4" />
          <span className="hidden sm:inline">View Detailed Table</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] w-full max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Role Performance Summary</DialogTitle>
          <DialogDescription>
            Detailed performance breakdown of all roles across all interviews.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6 pt-0">
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Job Role</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Total Interviews</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Avg. Overall Score</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Avg. Knowledge</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Avg. Speech</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRolePerformanceSummary ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Loading performance data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !rolePerformanceSummary?.roles?.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                      No interview data available for this time period.
                    </TableCell>
                  </TableRow>
                ) : (
                  rolePerformanceSummary.roles.map((row) => (
                    <TableRow key={row.role} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{row.role}</TableCell>
                      <TableCell className="text-right">{row.totalInterviews}</TableCell>
                      <TableCell className="text-right">
                        {typeof row.avgOverallScore === 'number' ? (
                           <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                             {row.avgOverallScore.toFixed(1)} / 100
                           </span>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {typeof row.avgKnowledgeScore === 'number' ? `${row.avgKnowledgeScore.toFixed(1)} / 100` : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {typeof row.avgSpeechScore === 'number' ? `${row.avgSpeechScore.toFixed(1)} / 100` : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
