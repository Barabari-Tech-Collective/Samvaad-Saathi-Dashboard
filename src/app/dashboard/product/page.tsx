"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
  funnelData,
  reportUsage,
  practiceEffectiveness,
  retryBehavior,
  questionEffectiveness,
} from "@/lib/mock-data"

const practiceConfig = {
  preScore: { label: "Pre Score", color: "var(--chart-4)" },
  postScore: { label: "Post Score", color: "var(--primary)" },
} satisfies ChartConfig

const retryConfig = {
  users: { label: "Users", color: "var(--primary)" },
} satisfies ChartConfig

export default function ProductPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Report usage KPIs */}
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Report Open Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{reportUsage.openRate}%</CardTitle>
            <CardAction><Badge variant="outline"><IconTrendingUp /></Badge></CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">Users who open their interview report</CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Avg Time on Report</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{reportUsage.avgTimeOnReport} min</CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">Time spent reviewing feedback</CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Recommendation Click Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{reportUsage.recommendationClickRate}%</CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">Clicked at least one recommendation</CardFooter>
        </Card>
      </div>

      {/* Funnel */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Funnel</CardTitle>
            <CardDescription>Sign-up to practice conversion</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex items-end gap-3 py-4">
              {funnelData.map((step, i) => {
                const maxUsers = funnelData[0].users
                const pct = (step.users / maxUsers) * 100
                return (
                  <div key={step.stage} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-medium tabular-nums">{step.users}</span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${Math.max(pct * 2, 20)}px`,
                        backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))`,
                        opacity: 0.8,
                      }}
                    />
                    <span className="text-xs text-muted-foreground text-center leading-tight">{step.stage}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2">
        {/* Practice effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Practice Effectiveness</CardTitle>
            <CardDescription>Pre vs post scores for practice exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={practiceConfig} className="aspect-auto h-[280px] w-full">
              <BarChart data={practiceEffectiveness} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                <YAxis dataKey="exercise" type="category" tickLine={false} axisLine={false} width={120} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="preScore" fill="var(--color-preScore)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="postScore" fill="var(--color-postScore)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Retry behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retry Behavior</CardTitle>
            <CardDescription>
              Avg retries before improvement: {retryBehavior.avgRetriesBeforeImprovement} &middot; Spam retry: {retryBehavior.spamRetryPct}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={retryConfig} className="aspect-auto h-[280px] w-full">
              <BarChart data={retryBehavior.retryDistribution}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="retries" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Question effectiveness table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question Effectiveness</CardTitle>
            <CardDescription>Which questions work best?</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Question</th>
                  <th className="pb-2 pr-4 font-medium text-right">Avg Score</th>
                  <th className="pb-2 font-medium text-right">Drop-off %</th>
                </tr>
              </thead>
              <tbody>
                {questionEffectiveness.map((q) => (
                  <tr key={q.question} className="border-b last:border-0">
                    <td className="py-2 pr-4">{q.question}</td>
                    <td className="py-2 pr-4 text-right tabular-nums font-medium">{q.avgScore}</td>
                    <td className="py-2 text-right tabular-nums">
                      <span className={q.dropOffPct > 15 ? "text-red-500" : "text-muted-foreground"}>
                        {q.dropOffPct}%
                      </span>
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
