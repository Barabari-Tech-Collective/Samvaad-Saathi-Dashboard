"use client"

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

export function useStudentProfile(studentId: number | string | undefined) {
  const path = studentId ? `${studentBase(studentId)}/profile` : "/v2/analytics/students/_/profile"
  const query = api.useQuery<StudentProfileResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    studentProfile: query.data,
    isLoadingStudentProfile: query.isLoading,
    ...query,
  }
}

export function useStudentSummary(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const path = studentId ? `${studentBase(studentId)}/summary` : "/v2/analytics/students/_/summary"
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentSummaryResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path, params),
    params,
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    studentSummary: query.data,
    isLoadingStudentSummary: query.isLoading,
    ...query,
  }
}

export function useStudentScoreHistory(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const path = studentId ? `${studentBase(studentId)}/score-history` : "/v2/analytics/students/_/score-history"
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentScoreHistoryResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path, params),
    params,
    enabled: studentId !== undefined && studentId !== "",
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
  const path = studentId
    ? `${studentBase(studentId)}/speech-vs-knowledge-history`
    : "/v2/analytics/students/_/speech-vs-knowledge-history"
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentSpeechVsKnowledgeResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path, params),
    params,
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    speechVsKnowledgeHistory: query.data,
    isLoadingSpeechVsKnowledgeHistory: query.isLoading,
    ...query,
  }
}

export function useStudentSkillAverages(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const path = studentId ? `${studentBase(studentId)}/skill-averages` : "/v2/analytics/students/_/skill-averages"
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentSkillAveragesResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path, params),
    params,
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    skillAverages: query.data,
    isLoadingSkillAverages: query.isLoading,
    ...query,
  }
}

export function useStudentPracticeCompletion(studentId: number | string | undefined, filters?: StudentDetailDateParams) {
  const path = studentId
    ? `${studentBase(studentId)}/practice-completion`
    : "/v2/analytics/students/_/practice-completion"
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentPracticeCompletionResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path, params),
    params,
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    practiceCompletion: query.data,
    isLoadingPracticeCompletion: query.isLoading,
    ...query,
  }
}

export function useStudentInterviews(studentId: number | string | undefined, filters?: PaginationParams) {
  const path = studentId ? `${studentBase(studentId)}/interviews` : "/v2/analytics/students/_/interviews"
  const params = compactParams(filters as QueryParamInput | undefined)
  const query = api.useQuery<StudentInterviewsResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path, params),
    params,
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    studentInterviews: query.data,
    isLoadingStudentInterviews: query.isLoading,
    ...query,
  }
}

export function useStudentLatestFeedback(studentId: number | string | undefined) {
  const path = studentId ? `${studentBase(studentId)}/latest-feedback` : "/v2/analytics/students/_/latest-feedback"
  const query = api.useQuery<StudentLatestFeedbackResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: studentId !== undefined && studentId !== "",
  })
  return {
    latestFeedback: query.data,
    isLoadingLatestFeedback: query.isLoading,
    ...query,
  }
}
