"use client"

import { useTransitionRouter } from "next-view-transitions"
import Image from "next/image"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LightRays } from "@/components/ui/light-rays"
import { MagicCard } from "@/components/ui/magic-card"
import { Skeleton } from "@/components/ui/skeleton"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { useLogin } from "@/lib/api/hooks/useLogin"
import { getAccessToken, getRefreshToken } from "@/lib/token-cookies.utils"
import { useEffect, useState } from "react"

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
    const router = useTransitionRouter()
    const { login, isLoading } = useLogin()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const existingToken = getAccessToken()
        const existingRefresh = getRefreshToken()

        if (existingToken && existingRefresh) {
            router.replace("/dashboard")
        }
    }, [router])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        login({ email, password })
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

                    <BlurFade delay={0.16}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        disabled={isLoading}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <IconEyeOff size={18} />
                                        ) : (
                                            <IconEye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in…" : "Sign in"}
                            </Button>
                        </form>
                    </BlurFade>
                </div>
            </MagicCard>
        </LandingShell>
    )
}
