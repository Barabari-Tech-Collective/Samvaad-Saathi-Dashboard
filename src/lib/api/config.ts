import axios from "axios"
import { createApiClient, createAuthInterceptor } from "react-query-ease"

import {
    clearAuthCookies,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "@/lib/token-cookies.utils"

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
    }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/cognito/refresh`, {
      refresh_token: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
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
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  configure: authInterceptor,
})
