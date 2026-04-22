import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🔥 FIX: For cross-origin deployments (Netlify ↔ Railway), 
  // HTTP-only cookies won't be sent across origins.
  // We rely on client-side auth instead via localStorage.
  // This middleware only ensures unprotected routes work.

  // Allow public routes
  if (pathname === "/admin-login" || 
      pathname.startsWith("/forgot-password") || 
      pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }

  // For /admin routes, let the useAuthGuard hook handle protection client-side
  // since cookies won't work across origins anyway
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
