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
  return {
    jobProfiles: query.data?.items ?? [],
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
