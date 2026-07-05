"use client"

import { api } from "@/lib/api/config"
import type {
  CreateJobProfileRequest,
  CreateJobProfileResponse,
  JobProfilesListResponse,
  DeleteJobProfileResponse,
  JobProfilesSummaryResponse,
  JobProfilesRecentActivityResponse,
  JobProfileUploadResponse,
  JobProfileExtractSkillsRequest,
  JobProfileExtractSkillsResponse,
  JobProfileGenerateQuestionsRequest,
  JobProfileGenerateQuestionsResponse,
  JobProfileQuestionsListResponse,
  JobProfileAddQuestionRequest,
  JobProfileAddQuestionResponse,
  JobProfileUpdateQuestionRequest,
  JobProfileUpdateQuestionResponse,
  JobProfileRegenerateQuestionResponse,
  JobProfileDeleteQuestionResponse,
  JobProfileReviewResponse,
  JobProfileSubmitResponse,
} from "./types"
import { analyticsKey } from "./query-keys"

const jobProfilesPath = "/v2/job-profiles" as const
const jobProfilesSummaryPath = "/v2/job-profiles/summary" as const

// ── GET /v2/job-profiles/summary ──────────────────────────────────────────────
export function useJobProfilesSummary() {
  const query = api.useQuery<JobProfilesSummaryResponse>({
    url: jobProfilesSummaryPath,
    method: "GET",
    key: analyticsKey(jobProfilesSummaryPath),
  })

  return {
    jobProfilesSummary: query.data,
    isLoadingJobProfilesSummary: query.isLoading,
    ...query,
  }
}

// ── GET /v2/job-profiles ──────────────────────────────────────────────────────
export function useJobProfilesList(category?: string, limit?: number) {
  const params: Record<string, any> = {}
  if (category && category !== "all") params.category = category
  if (limit) params.limit = limit

  const query = api.useQuery<JobProfilesListResponse>({
    url: jobProfilesPath,
    method: "GET",
    key: analyticsKey(jobProfilesPath, params),
    params: Object.keys(params).length > 0 ? params : undefined,
  })

  const rawItems = query.data?.items ?? []

  // Robust mapping to support both backend fields (id, title, description) and frontend camelCase schemas
  const jobProfiles = rawItems.map((item: any) => ({
    ...item,
    jobProfileId: item.jobProfileId ?? item.job_profile_id ?? item.id,
    jobName: item.jobName ?? item.job_name ?? item.title ?? "Unnamed Role",
    jobDescription: item.jobDescription ?? item.job_description ?? item.description ?? "",
    companyName: item.companyName ?? item.company_name ?? item.company ?? "General Role",
    experienceLevel: item.experienceLevel ?? item.experience_level ?? "fresher",
    category: item.category ?? null,
    employmentType: item.employmentType ?? item.employment_type ?? null,
    skills: item.skills ?? [],
    additionalContext: item.additionalContext ?? item.additional_context ?? "",
    createdBy: item.createdBy ?? item.created_by ?? null,
    createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.updated_at ?? new Date().toISOString(),
  }))

  return {
    jobProfiles,
    isLoadingJobProfiles: query.isLoading,
    ...query,
  }
}

// ── POST /v2/job-profiles ─────────────────────────────────────────────────────
export function useCreateJobProfile() {
  const mutation = api.useMutation<CreateJobProfileResponse, unknown, CreateJobProfileRequest>({
    url: jobProfilesPath,
    method: "POST",
    keyToInvalidate: analyticsKey(jobProfilesPath),
  })

  return {
    createJobProfile: mutation.mutate,
    createJobProfileAsync: mutation.mutateAsync,
    isCreatingJobProfile: mutation.isPending,
    ...mutation,
  }
}

// ── DELETE /v2/job-profiles/{id} ──────────────────────────────────────────────
export function useDeleteJobProfile() {
  const mutation = api.useMutation<DeleteJobProfileResponse, unknown, { id: number }>({
    url: ({ id }: { id: number }) => `${jobProfilesPath}/${id}`,
    method: "DELETE",
    keyToInvalidate: analyticsKey(jobProfilesPath),
  })

  return {
    deleteJobProfile: mutation.mutate,
    deleteJobProfileAsync: mutation.mutateAsync,
    isDeletingJobProfile: mutation.isPending,
    ...mutation,
  }
}

// ── POST /v2/job-profiles/extract-skills ──────────────────────────────────────
export function useExtractSkills() {
  const mutation = api.useMutation<JobProfileExtractSkillsResponse, unknown, JobProfileExtractSkillsRequest>({
    url: "/v2/job-profiles/extract-skills",
    method: "POST",
  })

  return {
    extractSkillsAsync: mutation.mutateAsync,
    isExtracting: mutation.isPending,
    ...mutation,
  }
}

// ── POST /v2/job-profiles/upload/job-description ──────────────────────────────
export function useUploadJobDescription() {
  const mutation = api.useMutation<JobProfileUploadResponse, unknown, FormData>({
    url: "/v2/job-profiles/upload/job-description",
    method: "POST",
  })

  return {
    uploadJDAsync: mutation.mutateAsync,
    isUploadingJD: mutation.isPending,
    ...mutation,
  }
}

// ── POST /v2/job-profiles/upload/knowledge-questions ──────────────────────────
export function useUploadKnowledgeQuestions() {
  const mutation = api.useMutation<JobProfileUploadResponse, unknown, FormData>({
    url: "/v2/job-profiles/upload/knowledge-questions",
    method: "POST",
  })

  return {
    uploadKnowledgeAsync: mutation.mutateAsync,
    isUploadingKnowledge: mutation.isPending,
    ...mutation,
  }
}

// ── POST /v2/job-profiles/{job_profile_id}/questions/generate ─────────────────
export function useGenerateQuestions(jobProfileId: string | null) {
  const mutation = api.useMutation<
    JobProfileGenerateQuestionsResponse,
    unknown,
    JobProfileGenerateQuestionsRequest
  >({
    url: () => `/v2/job-profiles/${jobProfileId}/questions/generate`,
    method: "POST",
    keyToInvalidate: jobProfileId ? ["/v2/job-profiles", jobProfileId, "questions"] : undefined,
  })

  return {
    generateQuestionsAsync: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    ...mutation,
  }
}

// ── GET /v2/job-profiles/{job_profile_id}/questions ───────────────────────────
export function useGetJobProfileQuestions(jobProfileId: string | null) {
  const query = api.useQuery<JobProfileQuestionsListResponse>({
    url: `/v2/job-profiles/${jobProfileId}/questions`,
    method: "GET",
    key: ["/v2/job-profiles", jobProfileId, "questions"],
    enabled: !!jobProfileId && jobProfileId !== "null",
  })

  return {
    questionsData: query.data,
    isLoadingQuestions: query.isLoading,
    ...query,
  }
}

// ── POST /v2/job-profiles/{job_profile_id}/questions ──────────────────────────
export function useAddJobProfileQuestion(jobProfileId: string | null) {
  const mutation = api.useMutation<
    JobProfileAddQuestionResponse,
    unknown,
    JobProfileAddQuestionRequest
  >({
    url: () => `/v2/job-profiles/${jobProfileId}/questions`,
    method: "POST",
    keyToInvalidate: jobProfileId ? ["/v2/job-profiles", jobProfileId, "questions"] : undefined,
  })

  return {
    addQuestionAsync: mutation.mutateAsync,
    isAddingQuestion: mutation.isPending,
    ...mutation,
  }
}

// ── PATCH /v2/job-profile-questions/{question_id} ─────────────────────────────
export function useUpdateJobProfileQuestion(jobProfileId?: string | null) {
  const mutation = api.useMutation<
    JobProfileUpdateQuestionResponse,
    unknown,
    { questionId: string; data: JobProfileUpdateQuestionRequest }
  >({
    url: ({ questionId }) => `/v2/job-profile-questions/${questionId}`,
    method: "PATCH",
    keyToInvalidate: jobProfileId ? ["/v2/job-profiles", jobProfileId, "questions"] : undefined,
  })

  return {
    updateQuestionAsync: mutation.mutateAsync,
    isUpdatingQuestion: mutation.isPending,
    ...mutation,
  }
}

// ── POST /v2/job-profile-questions/{question_id}/regenerate ───────────────────
export function useRegenerateJobProfileQuestion(jobProfileId?: string | null) {
  const mutation = api.useMutation<
    JobProfileRegenerateQuestionResponse,
    unknown,
    { questionId: string }
  >({
    url: ({ questionId }) => `/v2/job-profile-questions/${questionId}/regenerate`,
    method: "POST",
    keyToInvalidate: jobProfileId ? ["/v2/job-profiles", jobProfileId, "questions"] : undefined,
  })

  return {
    regenerateQuestionAsync: mutation.mutateAsync,
    isRegeneratingQuestion: mutation.isPending,
    ...mutation,
  }
}

// ── DELETE /v2/job-profile-questions/{question_id} ────────────────────────────
export function useDeleteJobProfileQuestion(jobProfileId?: string | null) {
  const mutation = api.useMutation<
    JobProfileDeleteQuestionResponse,
    unknown,
    { questionId: string }
  >({
    url: ({ questionId }) => `/v2/job-profile-questions/${questionId}`,
    method: "DELETE",
    keyToInvalidate: jobProfileId ? ["/v2/job-profiles", jobProfileId, "questions"] : undefined,
  })

  return {
    deleteQuestionAsync: mutation.mutateAsync,
    isDeletingQuestion: mutation.isPending,
    ...mutation,
  }
}

// ── GET /v2/job-profiles/{job_profile_id}/review ──────────────────────────────
export function useGetJobProfileReview(jobProfileId: string | null) {
  const query = api.useQuery<JobProfileReviewResponse>({
    url: `/v2/job-profiles/${jobProfileId}/review`,
    method: "GET",
    key: ["job-profile-review", jobProfileId],
    enabled: !!jobProfileId && jobProfileId !== "null",
    refetchOnWindowFocus: false,
  })

  return {
    reviewData: query.data,
    isLoadingReview: query.isLoading,
    isErrorReview: query.isError,
    errorReview: query.error,
    refetchReview: query.refetch,
  }
}

// ── POST /v2/job-profiles/{job_profile_id}/submit ─────────────────────────────
export function useSubmitJobProfile() {
  const mutation = api.useMutation<
    JobProfileSubmitResponse,
    unknown,
    { jobProfileId: string }
  >({
    url: ({ jobProfileId }) => `/v2/job-profiles/${jobProfileId}/submit`,
    method: "POST",
    keyToInvalidate: undefined,
  })

  return {
    submitProfileAsync: mutation.mutateAsync,
    isSubmittingProfile: mutation.isPending,
    ...mutation,
  }
}
