import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardOverview } from "@/components/admin/dashboard/dashboard-overview";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader title="Welcome, Admin" description="Overview of platform performance and key metrics." />
      <DashboardOverview />
    </div>
  );
}
