"use client"

import { useTransitionRouter } from "next-view-transitions"

import { api } from "@/lib/api/config"
import { setAuthTokens } from "@/lib/token-cookies.utils"

interface LoginRequest {
    email: string
    password: string
}

interface LoginResponse {
    userId: number
    authorizedUser: {
        token: string
        refreshToken: string
        email: string
        name: string
        createdAt: string
        isOnboarded: boolean
        degree: string
        university: string
        targetPosition: string
        yearsExperience: number
        totalAttempts: number
    }
}

export function useLogin() {
    const router = useTransitionRouter()

    const mutation = api.useMutation<LoginResponse, unknown, LoginRequest>({
        url: "/login",
        method: "POST",
        onSuccess: (data) => {
            const { token, refreshToken } = data.authorizedUser
            setAuthTokens(token, refreshToken)
            router.replace("/dashboard")
        },
    })

    return {
        login: mutation.mutate,
        loginAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        ...mutation,
    }
}
