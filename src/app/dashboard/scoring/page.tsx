"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

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
  scoreDistribution,
  speechVsKnowledgeCorrelation,
  scoreTrendMonthly,
} from "@/lib/mock-data"

const distributionConfig = {
  count: { label: "Students", color: "var(--primary)" },
} satisfies ChartConfig

const trendConfig = {
  avgScore: { label: "Overall", color: "var(--primary)" },
  speechAvg: { label: "Speech", color: "var(--chart-2)" },
  knowledgeAvg: { label: "Knowledge", color: "var(--chart-4)" },
} satisfies ChartConfig

const correlationConfig = {
  knowledge: { label: "Knowledge", color: "var(--primary)" },
} satisfies ChartConfig

export default function ScoringPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Score distribution */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Distribution</CardTitle>
            <CardDescription>How scores are spread across all interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={distributionConfig} className="aspect-auto h-[280px] w-full">
              <BarChart data={scoreDistribution}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2">
        {/* Monthly trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Trend (Monthly)</CardTitle>
            <CardDescription>Overall, speech, and knowledge averages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="aspect-auto h-[280px] w-full">
              <LineChart data={scoreTrendMonthly}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[50, 85]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="avgScore" stroke="var(--color-avgScore)" strokeWidth={2} dot />
                <Line type="monotone" dataKey="speechAvg" stroke="var(--color-speechAvg)" strokeWidth={2} dot />
                <Line type="monotone" dataKey="knowledgeAvg" stroke="var(--color-knowledgeAvg)" strokeWidth={2} dot />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Speech vs Knowledge scatter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Speech vs Knowledge Correlation</CardTitle>
            <CardDescription>Each dot is a student&apos;s average scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={correlationConfig} className="aspect-auto h-[280px] w-full">
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="speech" name="Speech" tickLine={false} axisLine={false} domain={[30, 100]} />
                <YAxis type="number" dataKey="knowledge" name="Knowledge" tickLine={false} axisLine={false} domain={[30, 100]} />
                <ZAxis range={[40, 40]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Scatter data={speechVsKnowledgeCorrelation} fill="var(--color-knowledge)" fillOpacity={0.6} />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
