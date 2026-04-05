"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectIsAuthenticated, selectUser } from "@/redux/features/auth/authSelectors";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { hydrateAuth } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";

export function useAuthGuard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [isHydrated, setIsHydrated] = useState(false);

  // 🔥 FIX: Hydrate auth on mount AND protect routes
  useEffect(() => {
    // 1. First, hydrate from localStorage
    dispatch(hydrateAuth());
    setIsHydrated(true);
  }, [dispatch]);

  // 2. After hydration, check auth state
  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      // Not logged in? Redirect to login
      if (!isAuthenticated) {
        router.replace(AUTH_ROUTES.LOGIN);
        return;
      }

      // Logged in but not admin? Log them out and redirect
      if (user && user.role !== "super_admin" && user.role !== "community_admin") {
        toast.error("Access Denied: Admin privileges required.");
        router.replace(AUTH_ROUTES.LOGIN);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return { isAuthenticated, user, isHydrated };
}