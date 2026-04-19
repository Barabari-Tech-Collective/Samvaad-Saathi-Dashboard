import { deleteCookie, getCookie, setCookie } from "cookies-next/client"


export const TOKEN_COOKIE_NAME = "SSA_Tk" as const
export const REFRESH_TOKEN_COOKIE_NAME = "SSA_RTk" as const

export const AUTH_COOKIE_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7,
} as const


export function getAccessToken(): string | undefined {
  const value = getCookie(TOKEN_COOKIE_NAME)
  return typeof value === "string" ? value : undefined
}

export function getRefreshToken(): string | undefined {
  const value = getCookie(REFRESH_TOKEN_COOKIE_NAME)
  return typeof value === "string" ? value : undefined
}

export function setAccessToken(token: string): void {
  setCookie(TOKEN_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)
}

export function setRefreshToken(token: string): void {
  setCookie(REFRESH_TOKEN_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}

export function clearAuthCookies(): void {
  deleteCookie(TOKEN_COOKIE_NAME, { path: "/" })
  deleteCookie(REFRESH_TOKEN_COOKIE_NAME, { path: "/" })
}
