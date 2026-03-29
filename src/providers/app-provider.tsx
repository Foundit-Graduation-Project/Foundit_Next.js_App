"use client";

import { ReduxProvider } from "./redux-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}
