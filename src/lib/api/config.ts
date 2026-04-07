import { createApiClient, createAuthInterceptor } from "react-query-ease"
import axios from "axios"
import { deleteCookie, getCookie, setCookie } from "cookies-next/client"

const COOKIE_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7,
}

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")
}

const authInterceptor = createAuthInterceptor({
  getAccessToken: () => getCookie("token") ?? null,
  getRefreshToken: () => getCookie("refresh_token") ?? null,
  refreshTokens: async ({ refreshToken }) => {
    if (!refreshToken) {
      throw new Error("No refresh token")
    }
    const response = await axios.post<{
      accessToken: string
      refreshToken: string
    }>(`${getBaseUrl()}/auth/refresh`, {
      refresh_token: refreshToken,
    })
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }
  },
  setTokens: (tokens) => {
    setCookie("token", tokens.accessToken, COOKIE_OPTIONS)
    if (tokens.refreshToken) {
      setCookie("refresh_token", tokens.refreshToken, COOKIE_OPTIONS)
    }
  },
  onRefreshFailure: () => {
    deleteCookie("token", { path: "/" })
    deleteCookie("refresh_token", { path: "/" })
    window.location.assign("/")
  },
})

export const api = createApiClient({
  baseURL: getBaseUrl(),
  configure: authInterceptor,
})
