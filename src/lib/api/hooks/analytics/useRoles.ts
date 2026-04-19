"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  DateRangeParams,
  RoleDetailResponse,
  RolesPerformanceResponse,
  RolesSummaryResponse,
  RolesWeakSkillsResponse,
} from "./types"

const summaryPath = "/v2/analytics/roles/summary" as const
const performancePath = "/v2/analytics/roles/performance" as const
const weakSkillsPath = "/v2/analytics/roles/weak-skills" as const

function roleDetailPath(roleId: number | string) {
  return `/v2/analytics/roles/${encodeURIComponent(String(roleId))}`
}

export function useRolesSummary() {
  const query = api.useQuery<RolesSummaryResponse>({
    url: summaryPath,
    method: "GET",
    key: analyticsKey(summaryPath),
  })
  return {
    rolesSummary: query.data,
    isLoadingRolesSummary: query.isLoading,
    ...query,
  }
}

export function useRolesPerformance(filters?: DateRangeParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<RolesPerformanceResponse>({
    url: performancePath,
    method: "GET",
    key: analyticsKey(performancePath, params),
    params,
  })
  return {
    rolesPerformance: query.data,
    isLoadingRolesPerformance: query.isLoading,
    ...query,
  }
}

export function useRolesWeakSkills(filters?: DateRangeParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<RolesWeakSkillsResponse>({
    url: weakSkillsPath,
    method: "GET",
    key: analyticsKey(weakSkillsPath, params),
    params,
  })
  return {
    rolesWeakSkills: query.data,
    isLoadingRolesWeakSkills: query.isLoading,
    ...query,
  }
}

export function useRoleDetail(roleId: number | string | undefined) {
  const path = roleId ? roleDetailPath(roleId) : "/v2/analytics/roles/_"
  const query = api.useQuery<RoleDetailResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: roleId !== undefined && roleId !== "",
  })
  return {
    roleDetail: query.data,
    isLoadingRoleDetail: query.isLoading,
    ...query,
  }
}
