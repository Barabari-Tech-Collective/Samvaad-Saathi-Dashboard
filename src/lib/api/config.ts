import axios from "axios"
import { createApiClient, createAuthInterceptor } from "react-query-ease"

import {
    clearAuthCookies,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "@/lib/token-cookies.utils"

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")
}

const authInterceptor = createAuthInterceptor({
  getAccessToken: () => getAccessToken() ?? null,
  getRefreshToken: () => getRefreshToken() ?? null,
  refreshTokens: async ({ refreshToken }) => {
    if (!refreshToken) {
      throw new Error("No refresh token")
    }
    const response = await axios.post<{
      accessToken: string
      refreshToken: string
    }>(`${getBaseUrl()}/api/auth/cognito/refresh`, {
      refresh_token: refreshToken,
    })
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }
  },
  setTokens: (tokens) => {
    setAccessToken(tokens.accessToken)
    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken)
    }
  },
  onRefreshFailure: () => {
    clearAuthCookies()
    window.location.assign("/")
  },
})

export const api = createApiClient({
  baseURL: getBaseUrl(),
  configure: authInterceptor,
})
