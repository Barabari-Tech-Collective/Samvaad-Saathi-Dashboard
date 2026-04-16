import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { TOKEN_COOKIE_NAME } from "./lib/token-cookies.utils"


export default function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value
  const { pathname } = request.nextUrl

  if (pathname === "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
}
