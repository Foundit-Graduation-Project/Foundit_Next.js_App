import React, { Suspense } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminShellContent } from "./admin-shell-content";

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b bg-white animate-pulse">
      <div className="flex h-full w-full items-center gap-4 px-4 md:px-6">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-9 bg-gray-200 rounded-xl" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </header>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminShellContent>
      <div className="flex min-h-screen w-full bg-muted/20">

        {/* Desktop sidebar — fixed on left, hidden on tablet & mobile */}
        <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 z-30">
          <AdminSidebar />
        </aside>

        {/* Main area — offset by sidebar width on desktop */}
        <div className="flex flex-1 flex-col min-w-0 w-full md:ml-64">
          <Suspense fallback={<HeaderSkeleton />}>
            <AdminHeader />
          </Suspense>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>
    </AdminShellContent>
  );
}
