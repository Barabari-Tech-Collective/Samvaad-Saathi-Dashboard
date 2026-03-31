"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  segmentByRole,
  segmentByCollege,
  segmentByDifficulty,
} from "@/lib/mock-data"

const roleConfig = {
  avgScore: { label: "Avg Score", color: "var(--primary)" },
  dropOffRate: { label: "Drop-off %", color: "var(--chart-4)" },
} satisfies ChartConfig

const collegeConfig = {
  avgScore: { label: "Avg Score", color: "var(--primary)" },
  improvementRate: { label: "Improvement", color: "var(--chart-2)" },
} satisfies ChartConfig

const difficultyConfig = {
  avgScore: { label: "Avg Score", color: "var(--primary)" },
  completionRate: { label: "Completion %", color: "var(--chart-2)" },
  retryRate: { label: "Retry %", color: "var(--chart-4)" },
} satisfies ChartConfig

export default function SegmentsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Role performance chart */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance by Role</CardTitle>
            <CardDescription>Average score and drop-off rate across interview roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={roleConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={segmentByRole}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="role" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dropOffRate" fill="var(--color-dropOffRate)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2">
        {/* College chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance by College</CardTitle>
            <CardDescription>Average score and improvement rate per institution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={collegeConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={segmentByCollege} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                <YAxis dataKey="college" type="category" tickLine={false} axisLine={false} width={110} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Difficulty chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance by Difficulty</CardTitle>
            <CardDescription>Score, completion, and retry rates per difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={difficultyConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={segmentByDifficulty}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="level" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retryRate" fill="var(--color-retryRate)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Role detail table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role Details</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Role</th>
                  <th className="pb-2 pr-4 font-medium text-right">Avg Score</th>
                  <th className="pb-2 pr-4 font-medium text-right">Drop-off %</th>
                  <th className="pb-2 pr-4 font-medium text-right">Avg Time (min)</th>
                  <th className="pb-2 pr-4 font-medium text-right">Improvement</th>
                  <th className="pb-2 font-medium">Common Weaknesses</th>
                </tr>
              </thead>
              <tbody>
                {segmentByRole.map((row) => (
                  <tr key={row.role} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{row.role}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.avgScore}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.dropOffRate}%</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.avgTimeSpent}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">
                      <span className={row.improvementRate >= 0 ? "text-emerald-600" : "text-red-500"}>
                        {row.improvementRate > 0 ? "+" : ""}{row.improvementRate}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {row.commonWeakness.map((w) => (
                          <Badge key={w} variant="secondary" className="text-xs">{w}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
