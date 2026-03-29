import React from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">

      {/* Desktop sidebar — fixed on left, hidden on tablet & mobile */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 z-30">
        <AdminSidebar />
      </aside>

      {/* Main area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col min-w-0 md:ml-64">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
