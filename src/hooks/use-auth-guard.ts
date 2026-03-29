"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/auth/authSelectors";
import { AUTH_ROUTES } from "@/lib/constants/routes";

export function useAuthGuard() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}
