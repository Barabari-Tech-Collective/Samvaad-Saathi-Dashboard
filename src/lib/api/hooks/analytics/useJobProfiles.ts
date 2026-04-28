"use client"

import { api } from "@/lib/api/config"
import type { CreateJobProfileRequest, CreateJobProfileResponse } from "./types"
import { analyticsKey } from "./query-keys"

const jobProfilesPath = "/v2/job-profiles" as const

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
