"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  AnalyticsSearchParams,
  BenchmarkingResponse,
  DateRangeParams,
  DifficultyMetricsResponse,
  DropoffFunnelResponse,
  ForecastingParams,
  ForecastingResponse,
  PaginationParams,
  PredictiveAlertsResponse,
  QuestionsAnalyticsResponse,
} from "./types"

const searchPath = "/v2/analytics/search" as const
const difficultyMetricsPath = "/v2/analytics/difficulty/metrics" as const
const questionsAnalyticsPath = "/v2/analytics/questions/analytics" as const
const dropoffFunnelPath = "/v2/analytics/dropoffs/funnel" as const
const predictiveAlertsPath = "/v2/analytics/insights/predictive-alerts" as const
const benchmarkingPath = "/v2/analytics/insights/benchmarking" as const
const forecastingPath = "/v2/analytics/insights/forecasting" as const

export function useAnalyticsSearch(params: AnalyticsSearchParams) {
  const p = compactParams(params as QueryParamInput)
  const query = api.useQuery<Record<string, unknown>>({
    url: searchPath,
    method: "GET",
    key: analyticsKey(searchPath, p),
    params: p,
    enabled: params.q.length > 0,
  })
  return {
    analyticsSearch: query.data,
    isLoadingAnalyticsSearch: query.isLoading,
    ...query,
  }
}

export function useDifficultyMetrics(filters?: DateRangeParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<DifficultyMetricsResponse>({
    url: difficultyMetricsPath,
    method: "GET",
    key: analyticsKey(difficultyMetricsPath, params),
    params,
  })
  return {
    difficultyMetrics: query.data,
    isLoadingDifficultyMetrics: query.isLoading,
    ...query,
  }
}

export function useQuestionsAnalytics(params?: PaginationParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<QuestionsAnalyticsResponse>({
    url: questionsAnalyticsPath,
    method: "GET",
    key: analyticsKey(questionsAnalyticsPath, p),
    params: p,
  })
  return {
    questionsAnalytics: query.data,
    isLoadingQuestionsAnalytics: query.isLoading,
    ...query,
  }
}

export function useDropoffFunnel(filters?: DateRangeParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<DropoffFunnelResponse>({
    url: dropoffFunnelPath,
    method: "GET",
    key: analyticsKey(dropoffFunnelPath, params),
    params,
  })
  return {
    dropoffFunnel: query.data,
    isLoadingDropoffFunnel: query.isLoading,
    ...query,
  }
}

export function usePredictiveAlerts() {
  const query = api.useQuery<PredictiveAlertsResponse>({
    url: predictiveAlertsPath,
    method: "GET",
    key: analyticsKey(predictiveAlertsPath),
  })
  return {
    predictiveAlerts: query.data,
    isLoadingPredictiveAlerts: query.isLoading,
    ...query,
  }
}

export function useBenchmarking() {
  const query = api.useQuery<BenchmarkingResponse>({
    url: benchmarkingPath,
    method: "GET",
    key: analyticsKey(benchmarkingPath),
  })
  return {
    benchmarking: query.data,
    isLoadingBenchmarking: query.isLoading,
    ...query,
  }
}

export function useForecasting(params?: ForecastingParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<ForecastingResponse>({
    url: forecastingPath,
    method: "GET",
    key: analyticsKey(forecastingPath, p),
    params: p,
  })
  return {
    forecasting: query.data,
    isLoadingForecasting: query.isLoading,
    ...query,
  }
}
