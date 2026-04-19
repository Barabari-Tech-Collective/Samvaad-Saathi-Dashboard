"use client"

import { api } from "@/lib/api/config"

import { analyticsKey } from "./query-keys"
import { compactParams, type QueryParamInput } from "./params"
import type {
  InterviewDetailSummaryResponse,
  InterviewQuestionScoresResponse,
  InterviewQuestionTypeBreakdownResponse,
  InterviewSpeechTimelineResponse,
  InterviewsSummaryResponse,
  InterviewsTableParams,
  InterviewsTableResponse,
} from "./types"

const summaryPath = "/v2/analytics/interviews/summary" as const
const tablePath = "/v2/analytics/interviews" as const

function interviewBase(interviewId: number | string) {
  return `/v2/analytics/interviews/${encodeURIComponent(String(interviewId))}`
}

export function useInterviewsSummary() {
  const query = api.useQuery<InterviewsSummaryResponse>({
    url: summaryPath,
    method: "GET",
    key: analyticsKey(summaryPath),
  })
  return {
    interviewsSummary: query.data,
    isLoadingInterviewsSummary: query.isLoading,
    ...query,
  }
}

export function useInterviewsTable(params?: InterviewsTableParams) {
  const p = compactParams(params as QueryParamInput | undefined)
  const query = api.useQuery<InterviewsTableResponse>({
    url: tablePath,
    method: "GET",
    key: analyticsKey(tablePath, p),
    params: p,
  })
  return {
    interviewsTable: query.data,
    isLoadingInterviewsTable: query.isLoading,
    ...query,
  }
}

export function useInterviewDetailSummary(interviewId: number | string | undefined) {
  const path = interviewId ? `${interviewBase(interviewId)}/summary` : "/v2/analytics/interviews/_/summary"
  const query = api.useQuery<InterviewDetailSummaryResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: interviewId !== undefined && interviewId !== "",
  })
  return {
    interviewDetailSummary: query.data,
    isLoadingInterviewDetailSummary: query.isLoading,
    ...query,
  }
}

export function useInterviewQuestionScores(interviewId: number | string | undefined) {
  const path = interviewId ? `${interviewBase(interviewId)}/question-scores` : "/v2/analytics/interviews/_/question-scores"
  const query = api.useQuery<InterviewQuestionScoresResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: interviewId !== undefined && interviewId !== "",
  })
  return {
    interviewQuestionScores: query.data,
    isLoadingInterviewQuestionScores: query.isLoading,
    ...query,
  }
}

export function useInterviewSpeechMetricsTimeline(interviewId: number | string | undefined) {
  const path = interviewId
    ? `${interviewBase(interviewId)}/speech-metrics-timeline`
    : "/v2/analytics/interviews/_/speech-metrics-timeline"
  const query = api.useQuery<InterviewSpeechTimelineResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: interviewId !== undefined && interviewId !== "",
  })
  return {
    interviewSpeechMetricsTimeline: query.data,
    isLoadingInterviewSpeechMetricsTimeline: query.isLoading,
    ...query,
  }
}

export function useInterviewQuestionTypeBreakdown(interviewId: number | string | undefined) {
  const path = interviewId
    ? `${interviewBase(interviewId)}/question-type-breakdown`
    : "/v2/analytics/interviews/_/question-type-breakdown"
  const query = api.useQuery<InterviewQuestionTypeBreakdownResponse>({
    url: path,
    method: "GET",
    key: analyticsKey(path),
    enabled: interviewId !== undefined && interviewId !== "",
  })
  return {
    interviewQuestionTypeBreakdown: query.data,
    isLoadingInterviewQuestionTypeBreakdown: query.isLoading,
    ...query,
  }
}
