import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardKpiCardsSkeleton({ count = 6 }: Readonly<{ count?: number }>) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="@container/card">
          <CardHeader className="gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-36 @[250px]/card:h-10" />
            <div className="flex justify-end">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-3 w-full max-w-[12rem]" />
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

export function ChartAreaSkeleton({ className }: Readonly<{ className?: string }>) {
  return <Skeleton className={className ?? "h-[220px] w-full rounded-lg"} aria-hidden />
}

export function ChartBarSkeleton({ className }: Readonly<{ className?: string }>) {
  return <Skeleton className={className ?? "h-[200px] w-full rounded-lg"} aria-hidden />
}

export function DashboardRecentTableSkeleton({ rows = 5 }: Readonly<{ rows?: number }>) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading table">
      <div className="flex gap-2 border-b pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: 5 }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function DashboardRecentStudentsSkeleton({ rows = 4 }: Readonly<{ rows?: number }>) {
  return (
    <div className="grid gap-2" role="status" aria-label="Loading recent students">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function DashboardAttentionSkeleton({ rows = 3 }: Readonly<{ rows?: number }>) {
  return (
    <div className="grid gap-3" role="status" aria-label="Loading alerts">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-md border px-3 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

export function StudentsKpiCardsSkeleton({ count = 6 }: Readonly<{ count?: number }>) {
  return <DashboardKpiCardsSkeleton count={count} />
}

export function StudentsTableSkeleton({ rows = 8 }: Readonly<{ rows?: number }>) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading students table">
      <div className="flex min-w-[720px] gap-2 border-b pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex min-w-[720px] gap-2">
          {Array.from({ length: 8 }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function StudentDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6" role="status" aria-label="Loading student">
      <Skeleton className="h-9 w-40" />
      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-dashed">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
        </CardHeader>
      </Card>
    </div>
  )
}
