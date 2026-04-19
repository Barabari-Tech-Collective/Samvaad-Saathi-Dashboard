"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type { PaginationParams, RankingsSummaryResponse, RankingsTableResponse } from "./types"

const summaryPath = "/v2/analytics/rankings/summary" as const
const topPerformersPath = "/v2/analytics/rankings/top-performers" as const
const strugglingPath = "/v2/analytics/rankings/struggling" as const
const mostImprovedPath = "/v2/analytics/rankings/most-improved" as const

export function useRankingsSummary() {
  const query = api.useQuery<RankingsSummaryResponse>({
    url: summaryPath,
    method: "GET",
    key: analyticsKey(summaryPath),
  })
  return {
    rankingsSummary: query.data,
    isLoadingRankingsSummary: query.isLoading,
    ...query,
  }
}

export function useTopPerformers(params?: PaginationParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<RankingsTableResponse>({
    url: topPerformersPath,
    method: "GET",
    key: analyticsKey(topPerformersPath, p),
    params: p,
  })
  return {
    topPerformers: query.data,
    isLoadingTopPerformers: query.isLoading,
    ...query,
  }
}

export function useStrugglingStudents(params?: PaginationParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<RankingsTableResponse>({
    url: strugglingPath,
    method: "GET",
    key: analyticsKey(strugglingPath, p),
    params: p,
  })
  return {
    strugglingStudents: query.data,
    isLoadingStrugglingStudents: query.isLoading,
    ...query,
  }
}

export function useMostImprovedStudents(params?: PaginationParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<RankingsTableResponse>({
    url: mostImprovedPath,
    method: "GET",
    key: analyticsKey(mostImprovedPath, p),
    params: p,
  })
  return {
    mostImprovedStudents: query.data,
    isLoadingMostImprovedStudents: query.isLoading,
    ...query,
  }
}
