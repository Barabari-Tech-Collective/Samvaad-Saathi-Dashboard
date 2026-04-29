import { Skeleton } from "@/components/ui/skeleton"

function KpiCardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-36" />
        </div>
    )
}

function ChartCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={`rounded-xl border bg-card p-5 space-y-4 ${className ?? ""}`}>
            <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
        </div>
    )
}

function TableCardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-20 shrink-0" />
                        <Skeleton className="h-6 w-16 rounded-full shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function Loading() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar skeleton */}
            <div className="hidden md:flex w-72 shrink-0 flex-col border-r bg-sidebar p-4 gap-4">
                <div className="flex items-center gap-3 px-2 py-1">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-1 mt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                            <Skeleton className="h-5 w-5 shrink-0" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>
                <div className="mt-auto flex items-center gap-3 px-2 py-2">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 h-12 shrink-0">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>

                {/* Page content */}
                <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
                    {/* Title + date range */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-9 w-full sm:w-80 rounded-lg" />
                    </div>

                    {/* KPI cards */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <KpiCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* 2-col charts */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <ChartCardSkeleton />
                        <ChartCardSkeleton />
                    </div>

                    {/* 3-col charts */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <ChartCardSkeleton />
                        <ChartCardSkeleton />
                        <ChartCardSkeleton />
                    </div>

                    {/* Table sections */}
                    <TableCardSkeleton />
                    <TableCardSkeleton />
                </div>
            </div>
        </div>
    )
}

export default Loading