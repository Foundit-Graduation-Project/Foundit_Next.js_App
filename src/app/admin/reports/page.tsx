"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchAdminStats } from "@/redux/features/reports/reportsThunk";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsPageView } from "@/components/admin/reports/reports-page-view";
import { DashboardStats } from "@/components/admin/reports/dashboard-stats";

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Moderation &gt; <span className="text-blue-600">Reports</span>
      </p>
      <PageHeader title="Platform Reports" description="Review and moderate user-reported content." />
      <DashboardStats />
      <ReportsPageView />
    </div>
  );
}
