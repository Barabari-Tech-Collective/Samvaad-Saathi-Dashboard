"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  DateRangeParams,
  RoleDetailResponse,
  RoleDetailRow,
  RolesPerformanceResponse,
  RolesSummaryResponse
} from "./types"

function toNullableNumber(val: unknown): number | null {
  if (typeof val === "number" && !Number.isNaN(val)) return val
  if (typeof val === "string" && val.trim() !== "") {
    const parsed = Number(val)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

function toRoleDetailRow(
  item: unknown,
  defaultRole = ""
): RoleDetailRow | null {
  if (typeof item !== "object" || item === null) return null

  const record = item as Record<string, unknown>
  const roleName =
    typeof record.role === "string" && record.role.trim() !== ""
      ? record.role
      : typeof record.name === "string" && record.name.trim() !== ""
        ? record.name
        : defaultRole

  return {
    role: roleName,
    interviews: toNullableNumber(record.interviews),
    total_students: toNullableNumber(record.total_students),
    avg_score: toNullableNumber(record.avg_score),
    avg_knowledge_score: toNullableNumber(record.avg_knowledge_score),
    drop_off_rate: toNullableNumber(record.drop_off_rate),
    avg_time_spent_seconds: toNullableNumber(record.avg_time_spent_seconds),
    common_weaknesses: Array.isArray(record.common_weaknesses)
      ? record.common_weaknesses.filter((w): w is string => typeof w === "string")
      : [],
  }
}

/**
 * Normalizes any role-detail API response shape (array, standard object with items,
 * or direct single object) into a strict `RoleDetailResponse`.
 */
export function normalizeRoleDetailResponse(
  raw: unknown,
  defaultRole = ""
): RoleDetailResponse {
  if (!raw || typeof raw !== "object") {
    return { tableType: "role_detail", items: [] }
  }

  // Contract variation 1: Direct array of items [ { ... } ]
  if (Array.isArray(raw)) {
    const items = raw
      .map((item) => toRoleDetailRow(item, defaultRole))
      .filter((item): item is RoleDetailRow => item !== null)
    return { tableType: "role_detail", items }
  }

  const record = raw as Record<string, unknown>

  // Contract variation 2: Standard response with items array { tableType?: "role_detail", items: [ ... ] }
  if (Array.isArray(record.items)) {
    const items = record.items
      .map((item) => toRoleDetailRow(item, defaultRole))
      .filter((item): item is RoleDetailRow => item !== null)
    return {
      tableType:
        typeof record.tableType === "string" ? record.tableType : "role_detail",
      items,
    }
  }

  // Contract variation 3: Direct single object response { role: "...", interviews: 10, ... }
  const singleRow = toRoleDetailRow(raw, defaultRole)
  if (singleRow) {
    return {
      tableType: "role_detail",
      items: [singleRow],
    }
  }

  return { tableType: "role_detail", items: [] }
}

const summaryPath = "/v2/analytics/roles/summary" as const
const performancePath = "/v2/analytics/roles/performance" as const


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


export function useRoleDetail(roleId: number | string | undefined) {
  const path = roleId ? roleDetailPath(roleId) : "/v2/analytics/roles/_"
  const defaultRole = roleId ? String(roleId) : ""
  const query = api.useQuery<RoleDetailResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: roleId !== undefined && roleId !== "",
    select: (raw) => normalizeRoleDetailResponse(raw, defaultRole),
  })
  return {
    roleDetail: query.data,
    isLoadingRoleDetail: query.isLoading,
    ...query,
  }
}
