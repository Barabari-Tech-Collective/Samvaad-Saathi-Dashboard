"use client"

import { api } from "@/lib/api/config"

export type AuthUser = {
  id: string
  email: string
  name?: string
  avatar?: string | null
}

export function useAuth() {
  const query = api.useQuery<AuthUser>({
    url: "/me",
    method: "GET",
    key: ["me", "auth"],
  })

  return {
    user: query.data ?? null,
    isLoadingUser: query.isLoading,
    ...query,
  }
}
