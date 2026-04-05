import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");

  // Logic: If trying to access /admin and NO refresh token exists, move to login
  console.log("Middleware: refreshToken cookie:", !!refreshToken, "path:", pathname);
  if (!refreshToken && pathname.startsWith("/admin")) {
    const url = new URL("/admin-login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
