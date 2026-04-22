"use client";

import React from "react";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export function AdminShellContent({ children }: { children: React.ReactNode }) {
  // This hook will:
  // 1. Check if user is authenticated
  // 2. Check if user has admin role
  // 3. Redirect to login if not authenticated or not admin
  useAuthGuard();

  return <>{children}</>;
}
