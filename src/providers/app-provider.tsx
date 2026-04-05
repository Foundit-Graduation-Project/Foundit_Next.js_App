"use client";

import { useEffect } from "react";
import { ReduxProvider } from "./redux-provider";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "@/redux/features/auth/authSlice";

function AppContent({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // 🔥 FIX: Hydrate auth state ONCE on mount
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AppContent>{children}</AppContent>
    </ReduxProvider>
  );
}
