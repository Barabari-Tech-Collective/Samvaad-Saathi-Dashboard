import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const nunito = Nunito_Sans({
    subsets: ["latin"],
    variable: "--font-nunito",
});

const siteUrl = "https://master.d30wpikvvj1kc2.amplifyapp.com"

const siteTitle = "Samvaad Saathi Dashboard"
const siteDescription =
    "Interview practice analytics, student progress, and college insights — dashboards for coaches and institutions."

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteTitle,
        template: `%s · ${siteTitle}`,
    },
    description: siteDescription,
    icons: {
        icon: "/barabari_logo.ico",
        apple: "/barabari_logo.png",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: siteTitle,
        title: siteTitle,
        description: siteDescription,
        url: "/",
        images: [
            {
                url: "/barabari_logo.png",
                alt: `${siteTitle} logo`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
        images: ["/barabari_logo.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ViewTransitions>
            <html
                lang="en"
                suppressHydrationWarning
                className={cn("antialiased", nunito.variable, "font-sans")}
            >
                <body>

                    <ThemeProvider>
                        <QueryProvider>
                            <TooltipProvider>
                                {children}
                            </TooltipProvider>
                        </QueryProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ViewTransitions>
    )
}
