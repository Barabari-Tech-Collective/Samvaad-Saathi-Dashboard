"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  CollegeFilterResponse,
  DateRangeParams,
  StudentsSearchParams,
  StudentsSummaryResponse,
  StudentsTableParams,
  StudentsTableResponse,
} from "./types"

const summaryPath = "/v2/analytics/students/summary" as const
const tablePath = "/v2/analytics/students" as const
const searchPath = "/v2/analytics/students/search" as const
const collegeFiltersPath = "/v2/analytics/students/filters/colleges" as const

export function useStudentsSummary(filters?: DateRangeParams) {
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentsSummaryResponse>({
    url: summaryPath,
    method: "GET",
    key: analyticsKey(summaryPath, params),
    params,
  })
  return {
    studentsSummary: query.data,
    isLoadingStudentsSummary: query.isLoading,
    ...query,
  }
}

export function useStudentsTable(params?: StudentsTableParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<StudentsTableResponse>({
    url: tablePath,
    method: "GET",
    key: analyticsKey(tablePath, p),
    params: p,
  })
  return {
    studentsTable: query.data,
    isLoadingStudentsTable: query.isLoading,
    ...query,
  }
}

export function useStudentsSearch(params: StudentsSearchParams) {
  const p = compactParams(params as QueryParamInput)
  const query = api.useQuery<StudentsTableResponse>({
    url: searchPath,
    method: "GET",
    key: analyticsKey(searchPath, p),
    params: p,
    enabled: params.q.length > 0,
  })
  return {
    studentsSearch: query.data,
    isLoadingStudentsSearch: query.isLoading,
    ...query,
  }
}

export function useStudentCollegeFilters() {
  const query = api.useQuery<CollegeFilterResponse>({
    url: collegeFiltersPath,
    method: "GET",
    key: analyticsKey(collegeFiltersPath),
  })
  return {
    collegeFilters: query.data,
    isLoadingCollegeFilters: query.isLoading,
    ...query,
  }
}
