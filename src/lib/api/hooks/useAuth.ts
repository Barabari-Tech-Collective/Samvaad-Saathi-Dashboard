"use client"

import { api } from "@/lib/api/config"

/** Raw JSON from `GET /me`. */
export type MeApiResponse = Readonly<{
  userId: number
  authorizedUser?: Readonly<{
    token?: string
    refreshToken?: string | null
    email?: string | null
    name?: string | null
    createdAt?: string
    isOnboarded?: boolean
    degree?: string | null
    university?: string | null
    targetPosition?: string | null
    yearsExperience?: number | null
    totalAttempts?: number | null
    avatar?: string | null
    profileImageUrl?: string | null
  }> | null
}>

/** Normalized user for UI (nav, etc.). */
export type AuthUser = Readonly<{
  id?: string
  email?: string | null
  name?: string | null
  avatar?: string | null
}>

export function mapMeResponseToAuthUser(data: MeApiResponse): AuthUser {
  const u = data.authorizedUser
  const avatar = u?.avatar?.trim() || u?.profileImageUrl?.trim() || null
  return {
    id: data.userId != null ? String(data.userId) : undefined,
    email: u?.email ?? null,
    name: u?.name ?? null,
    avatar,
  }
}

export function useAuth() {
  const query = api.useQuery<MeApiResponse>({
    url: "/me",
    method: "GET",
    key: ["me", "auth"],
  })

  const user = query.data ? mapMeResponseToAuthUser(query.data) : null

  return {
    ...query,
    data: user,
    user,
    isLoadingUser: query.isLoading,
  }
}
