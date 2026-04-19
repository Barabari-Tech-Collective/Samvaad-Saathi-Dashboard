"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  AttentionRequiredResponse,
  DashboardAttentionParams,
  DashboardDateRoleFilter,
  DashboardRecentParams,
  DashboardTopParams,
  HistogramResponse,
  KpiResponse,
  LineAreaChartResponse,
  RecentInterviewsResponse,
  RecentStudentsResponse,
  TopCollegesTableResponse,
  TopRolesTableResponse,
} from "./types"

const overviewPath = "/v2/analytics/dashboard/overview" as const
const interviewsPerDayPath = "/v2/analytics/dashboard/interviews-per-day" as const
const activeUsersTrendPath = "/v2/analytics/dashboard/active-users-trend" as const
const topRolesPath = "/v2/analytics/dashboard/top-roles" as const
const topCollegesPath = "/v2/analytics/dashboard/top-colleges" as const
const scoreDistributionPath = "/v2/analytics/dashboard/score-distribution" as const
const recentInterviewsPath = "/v2/analytics/dashboard/recent-interviews" as const
const recentStudentsPath = "/v2/analytics/dashboard/recent-students" as const
const attentionRequiredPath = "/v2/analytics/dashboard/attention-required" as const

export function useDashboardOverview(filters?: DashboardDateRoleFilter) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<KpiResponse>({
    url: overviewPath,
    method: "GET",
    key: analyticsKey(overviewPath, params),
    params,
  })
  return {
    overview: query.data,
    isLoadingOverview: query.isLoading,
    ...query,
  }
}

export function useDashboardInterviewsPerDay(filters?: DashboardDateRoleFilter) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<LineAreaChartResponse>({
    url: interviewsPerDayPath,
    method: "GET",
    key: analyticsKey(interviewsPerDayPath, params),
    params,
  })
  return {
    interviewsPerDay: query.data,
    isLoadingInterviewsPerDay: query.isLoading,
    ...query,
  }
}

export function useDashboardActiveUsersTrend(filters?: DashboardDateRoleFilter) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<LineAreaChartResponse>({
    url: activeUsersTrendPath,
    method: "GET",
    key: analyticsKey(activeUsersTrendPath, params),
    params,
  })
  return {
    activeUsersTrend: query.data,
    isLoadingActiveUsersTrend: query.isLoading,
    ...query,
  }
}

export function useDashboardTopRoles(filters?: DashboardTopParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<TopRolesTableResponse>({
    url: topRolesPath,
    method: "GET",
    key: analyticsKey(topRolesPath, params),
    params,
  })
  return {
    topRoles: query.data,
    isLoadingTopRoles: query.isLoading,
    ...query,
  }
}

export function useDashboardTopColleges(filters?: DashboardTopParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<TopCollegesTableResponse>({
    url: topCollegesPath,
    method: "GET",
    key: analyticsKey(topCollegesPath, params),
    params,
  })
  return {
    topColleges: query.data,
    isLoadingTopColleges: query.isLoading,
    ...query,
  }
}

export function useDashboardScoreDistribution(filters?: DashboardDateRoleFilter) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<HistogramResponse>({
    url: scoreDistributionPath,
    method: "GET",
    key: analyticsKey(scoreDistributionPath, params),
    params,
  })
  return {
    scoreDistribution: query.data,
    isLoadingScoreDistribution: query.isLoading,
    ...query,
  }
}

export function useDashboardRecentInterviews(filters?: DashboardRecentParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<RecentInterviewsResponse>({
    url: recentInterviewsPath,
    method: "GET",
    key: analyticsKey(recentInterviewsPath, params),
    params,
  })
  return {
    recentInterviews: query.data,
    isLoadingRecentInterviews: query.isLoading,
    ...query,
  }
}

export function useDashboardRecentStudents(filters?: DashboardRecentParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<RecentStudentsResponse>({
    url: recentStudentsPath,
    method: "GET",
    key: analyticsKey(recentStudentsPath, params),
    params,
  })
  return {
    recentStudents: query.data,
    isLoadingRecentStudents: query.isLoading,
    ...query,
  }
}

export function useDashboardAttentionRequired(filters?: DashboardAttentionParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<AttentionRequiredResponse>({
    url: attentionRequiredPath,
    method: "GET",
    key: analyticsKey(attentionRequiredPath, params),
    params,
  })
  return {
    attentionRequired: query.data,
    isLoadingAttentionRequired: query.isLoading,
    ...query,
  }
}
