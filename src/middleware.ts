import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Placeholder middleware logic
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
