"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
// Ensure you have these selectors exported in authSelectors.ts
import { selectIsAuthenticated, selectUser } from "@/redux/features/auth/authSelectors";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import toast from "react-hot-toast";

export function useAuthGuard() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 🔥 FIX: Mark as hydrated after mount
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // 🔥 FIX: Only run auth checks AFTER hydration is complete
    if (!isHydrated) return;

    // 1. Not logged in at all? Kick to login.
    if (!isAuthenticated) {
      router.replace(AUTH_ROUTES.LOGIN);
      return;
    }

    // 2. Logged in, but NOT an admin? Kick to login and show error.
    if (user && user.role !== "super_admin" && user.role !== "community_admin") {
      toast.error("Access Denied: Admin privileges required.");
      router.replace(AUTH_ROUTES.LOGIN);
    }
  }, [isHydrated, isAuthenticated, user, router]);

  return { isAuthenticated, user, isHydrated };
}