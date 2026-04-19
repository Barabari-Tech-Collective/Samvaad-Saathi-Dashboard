"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"

/** While data is fresh, subscribers reuse cache and skip duplicate fetches. */
const STALE_TIME_MS = 5 * 60 * 1000

/** Keep inactive query data in memory longer so back/forward navigation hits cache. */
const GC_TIME_MS = 30 * 60 * 1000

export function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
            gcTime: GC_TIME_MS,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
