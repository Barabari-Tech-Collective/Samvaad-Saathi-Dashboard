"use client"

import type { QueryKey } from "@tanstack/react-query"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  PaginationParams,
  StudentDetailDateParams,
  StudentInterviewsResponse,
  StudentLatestFeedbackResponse,
  StudentPracticeCompletionResponse,
  StudentProfileResponse,
  StudentScoreHistoryResponse,
  StudentSkillAveragesResponse,
  StudentSpeechVsKnowledgeResponse,
  StudentSummaryResponse,
} from "./types"

function studentBase(studentId: number | string) {
  return `/v2/analytics/students/${encodeURIComponent(String(studentId))}`
}

/** Stable query key when `studentId` is missing — not an API path. */
function studentDetailIdleKey(studentId: number | string | undefined, segment: string): QueryKey {
  return ["analytics", "students", String(studentId ?? "none"), segment] as const
}

function studentDetailQueryEnabled(
  studentId: number | string | undefined,
): studentId is number | string {
  return studentId !== undefined && studentId !== ""
}

export function useStudentProfile(studentId: number | string | undefined) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/profile` : undefined
  const query = api.useQuery<StudentProfileResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path) : studentDetailIdleKey(studentId, "profile"),
    enabled,
  })
  return {
    studentProfile: query.data,
    isLoadingStudentProfile: query.isLoading,
    ...query,
  }
}

export function useStudentSummary(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/summary` : undefined
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentSummaryResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path, params) : studentDetailIdleKey(studentId, "summary"),
    params,
    enabled,
  })
  return {
    studentSummary: query.data,
    isLoadingStudentSummary: query.isLoading,
    ...query,
  }
}

export function useStudentScoreHistory(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/score-history` : undefined
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentScoreHistoryResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path, params) : studentDetailIdleKey(studentId, "score-history"),
    params,
    enabled,
  })
  return {
    scoreHistory: query.data,
    isLoadingScoreHistory: query.isLoading,
    ...query,
  }
}

export function useStudentSpeechVsKnowledgeHistory(
  studentId: number | string | undefined,
  filters?: StudentDetailDateParams,
) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/speech-vs-knowledge-history` : undefined
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentSpeechVsKnowledgeResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path, params) : studentDetailIdleKey(studentId, "speech-vs-knowledge-history"),
    params,
    enabled,
  })
  return {
    speechVsKnowledgeHistory: query.data,
    isLoadingSpeechVsKnowledgeHistory: query.isLoading,
    ...query,
  }
}

export function useStudentSkillAverages(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/skill-averages` : undefined
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentSkillAveragesResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path, params) : studentDetailIdleKey(studentId, "skill-averages"),
    params,
    enabled,
  })
  return {
    skillAverages: query.data,
    isLoadingSkillAverages: query.isLoading,
    ...query,
  }
}

export function useStudentPracticeCompletion(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/practice-completion` : undefined
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentPracticeCompletionResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path, params) : studentDetailIdleKey(studentId, "practice-completion"),
    params,
    enabled,
  })
  return {
    practiceCompletion: query.data,
    isLoadingPracticeCompletion: query.isLoading,
    ...query,
  }
}

export function useStudentInterviews(studentId: number | string | undefined, filters?: PaginationParams) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/interviews` : undefined
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentInterviewsResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path, params) : studentDetailIdleKey(studentId, "interviews"),
    params,
    enabled,
  })
  return {
    studentInterviews: query.data,
    isLoadingStudentInterviews: query.isLoading,
    ...query,
  }
}

export function useStudentLatestFeedback(studentId: number | string | undefined) {
  const enabled = studentDetailQueryEnabled(studentId)
  const path = enabled ? `${studentBase(studentId)}/latest-feedback` : undefined
  const query = api.useQuery<StudentLatestFeedbackResponse>({
    url: path,
    method: "GET",
    key: path ? analyticsKey(path) : studentDetailIdleKey(studentId, "latest-feedback"),
    enabled,
  })
  return {
    latestFeedback: query.data,
    isLoadingLatestFeedback: query.isLoading,
    ...query,
  }
}
