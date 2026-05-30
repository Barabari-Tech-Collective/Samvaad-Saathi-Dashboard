"use client"

import { api } from "@/lib/api/config"
import type {
  CreateJobProfileRequest,
  CreateJobProfileResponse,
  JobProfilesListResponse,
  DeleteJobProfileResponse,
} from "./types"
import { analyticsKey } from "./query-keys"

const jobProfilesPath = "/v2/job-profiles" as const

// ── GET /v2/job-profiles ──────────────────────────────────────────────────────
export function useJobProfilesList() {
  const query = api.useQuery<JobProfilesListResponse>({
    url: jobProfilesPath,
    method: "GET",
    key: analyticsKey(jobProfilesPath),
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
