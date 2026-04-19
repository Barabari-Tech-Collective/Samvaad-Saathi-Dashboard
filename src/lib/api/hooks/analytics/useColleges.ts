"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  CollegesSummaryResponse,
  CollegesTableResponse,
  KpiResponse,
  LineAreaChartResponse,
  PaginationParams,
} from "./types"

const summaryPath = "/v2/analytics/colleges/summary" as const
const tablePath = "/v2/analytics/colleges" as const

function collegeBase(collegeName: string) {
  return `/v2/analytics/colleges/${encodeURIComponent(collegeName)}`
}

export function useCollegesSummary() {
  const query = api.useQuery<CollegesSummaryResponse>({
    url: summaryPath,
    method: "GET",
    key: analyticsKey(summaryPath),
  })
  return {
    collegesSummary: query.data,
    isLoadingCollegesSummary: query.isLoading,
    ...query,
  }
}

export function useCollegesTable(params?: PaginationParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<CollegesTableResponse>({
    url: tablePath,
    method: "GET",
    key: analyticsKey(tablePath, p),
    params: p,
  })
  return {
    collegesTable: query.data,
    isLoadingCollegesTable: query.isLoading,
    ...query,
  }
}

export function useCollegeDetailSummary(collegeName: string | undefined) {
  const path = collegeName ? `${collegeBase(collegeName)}/summary` : "/v2/analytics/colleges/_/summary"
  const query = api.useQuery<KpiResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: !!collegeName && collegeName.length > 0,
  })
  return {
    collegeDetailSummary: query.data,
    isLoadingCollegeDetailSummary: query.isLoading,
    ...query,
  }
}

export function useCollegeStudentGrowth(collegeName: string | undefined) {
  const path = collegeName ? `${collegeBase(collegeName)}/student-growth` : "/v2/analytics/colleges/_/student-growth"
  const query = api.useQuery<LineAreaChartResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: !!collegeName && collegeName.length > 0,
  })
  return {
    collegeStudentGrowth: query.data,
    isLoadingCollegeStudentGrowth: query.isLoading,
    ...query,
  }
}

export function useCollegeScoreTrend(collegeName: string | undefined) {
  const path = collegeName ? `${collegeBase(collegeName)}/score-trend` : "/v2/analytics/colleges/_/score-trend"
  const query = api.useQuery<LineAreaChartResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: !!collegeName && collegeName.length > 0,
  })
  return {
    collegeScoreTrend: query.data,
    isLoadingCollegeScoreTrend: query.isLoading,
    ...query,
  }
}

export function useCollegePracticeMetrics(collegeName: string | undefined) {
  const path = collegeName ? `${collegeBase(collegeName)}/practice-metrics` : "/v2/analytics/colleges/_/practice-metrics"
  const query = api.useQuery<Record<string, unknown>>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: !!collegeName && collegeName.length > 0,
  })
  return {
    collegePracticeMetrics: query.data,
    isLoadingCollegePracticeMetrics: query.isLoading,
    ...query,
  }
}

export function useCollegeWeakSkills(collegeName: string | undefined) {
  const path = collegeName ? `${collegeBase(collegeName)}/weak-skills` : "/v2/analytics/colleges/_/weak-skills"
  const query = api.useQuery<Record<string, unknown>>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: !!collegeName && collegeName.length > 0,
  })
  return {
    collegeWeakSkills: query.data,
    isLoadingCollegeWeakSkills: query.isLoading,
    ...query,
  }
}

export function useCollegeStudents(collegeName: string | undefined, params?: PaginationParams) {
  const path = collegeName ? `${collegeBase(collegeName)}/students` : "/v2/analytics/colleges/_/students"
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<Record<string, unknown>>({
    url: path,
    method: "GET",
    key: analyticsKey(path, p),
    params: p,
    enabled: !!collegeName && collegeName.length > 0,
  })
  return {
    collegeStudents: query.data,
    isLoadingCollegeStudents: query.isLoading,
    ...query,
  }
}
