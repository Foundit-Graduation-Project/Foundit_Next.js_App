import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Path: ${pathname}, Has refreshToken: ${!!refreshToken}`);
  }

  // 🔥 FIX: Allow unauthenticated users to reach login page
  if (pathname === "/admin-login" || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!refreshToken) {
      const url = new URL("/admin-login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
