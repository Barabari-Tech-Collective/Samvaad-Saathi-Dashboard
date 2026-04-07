"use client"

import { getCookie, setCookie } from "cookies-next/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { COGNITO_LOGIN_PATH } from "@/lib/api/auth-paths"

const COOKIE_OPTIONS = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7,
}

function getApiBaseUrl(): string {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
    return base.replace(/\/$/, "")
}

export default function Page() {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = React.useState(false)

    React.useEffect(() => {
        const existingToken = getCookie("token")
        const existingRefresh = getCookie("refresh_token")

        if (existingToken && existingRefresh) {
            router.replace("/dashboard")
            return
        }

        if (typeof window === "undefined") {
            return
        }

        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        const refreshToken = params.get("refresh_token")

        if (token && refreshToken) {
            setIsProcessing(true)
            setCookie("token", token, COOKIE_OPTIONS)
            setCookie("refresh_token", refreshToken, COOKIE_OPTIONS)
            window.history.replaceState({}, document.title, window.location.pathname)
            router.replace("/dashboard")
            return
        }
    }, [router])

    const loginUrl = `${getApiBaseUrl()}/${COGNITO_LOGIN_PATH}`

    if (isProcessing) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-6 px-4">
                <Skeleton className="h-[110px] w-[116px] rounded-xl" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-11 w-72 rounded-lg" />
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center px-4">
            <div
                className="mb-6 flex h-[110px] w-[116px] items-center justify-center rounded-xl bg-primary/15 text-2xl font-semibold text-primary"
                aria-hidden
            >
                SS
            </div>
            <h2 className="font-heading mb-2 text-center text-[32px] font-semibold">
                Welcome to Samvaad Saathi Dashboard!
            </h2>
            <h1 className="font-heading mb-8 text-[20px] font-semibold">Sign in</h1>
            <Link href={loginUrl}>
                <button
                    type="button"
                    className="flex h-11 w-72 cursor-pointer items-center justify-center gap-3 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md transition active:scale-95"
                >
                    Continue with Google
                </button>
            </Link>
        </div>
    )
}
