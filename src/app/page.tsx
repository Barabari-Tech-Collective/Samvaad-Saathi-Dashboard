"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { BlurFade } from "@/components/ui/blur-fade"
import { LightRays } from "@/components/ui/light-rays"
import { MagicCard } from "@/components/ui/magic-card"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Skeleton } from "@/components/ui/skeleton"
import { COGNITO_LOGIN_PATH } from "@/lib/api/auth-paths"
import {
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
} from "@/lib/token-cookies.utils"

function LandingShell({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <LightRays
                    className="rounded-none"
                    count={8}
                    color="oklch(0.55 0.18 264 / 0.4)"
                    blur={42}
                    speed={5}
                    length="100vh"
                />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
                {children}
            </div>
        </div>
    )
}

export default function Page() {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = React.useState(false)

    React.useEffect(() => {
        const existingToken = getAccessToken()
        const existingRefresh = getRefreshToken()

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
            setAuthTokens(token, refreshToken)
            window.history.replaceState({}, document.title, window.location.pathname)
            router.replace("/dashboard")
            return
        }
    }, [router])

    const loginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${COGNITO_LOGIN_PATH}`

    if (isProcessing) {
        return (
            <LandingShell>
                <div className="flex flex-col items-center gap-6">
                    <Skeleton className="h-[110px] w-[116px] rounded-xl" />
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-11 w-72 rounded-lg" />
                </div>
            </LandingShell>
        )
    }

    return (
        <LandingShell>
            <MagicCard className="w-full max-w-md rounded-2xl border border-border/60 bg-card/90 shadow-xl backdrop-blur-sm">
                <div className="space-y-6 p-8">
                    <BlurFade delay={0}>
                        <div className="flex justify-center">
                            <div className="relative overflow-hidden">
                                <Image
                                    src="/barabari_logo.png"
                                    alt="Barabari"
                                    width={116}
                                    height={110}
                                    className="h-full w-full object-contain p-2"
                                    priority
                                />
                            </div>
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.08}>
                        <h2 className="font-heading text-center text-[32px] font-semibold leading-tight text-foreground">
                            Welcome to Samvaad Saathi Dashboard!
                        </h2>
                    </BlurFade>

                    <BlurFade delay={0.24}>
                        <RainbowButton size="lg" className="w-full min-w-2xs">
                            <Link href={loginUrl} className="text-black">Continue with Google</Link>
                        </RainbowButton>
                    </BlurFade>
                </div>
            </MagicCard>
        </LandingShell>
    )
}
