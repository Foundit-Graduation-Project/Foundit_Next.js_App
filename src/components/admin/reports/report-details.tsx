"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AppLoader } from "@/components/shared/app-loader";

import { ReportHeader } from "./details/report-header";
import { ReportImage } from "./details/report-image";
import { ReportInfo } from "./details/report-info";
import { ReportLocation } from "./details/report-location";
import { ReportReporter } from "./details/report-reporter";
import { ReportDangerZone } from "./details/report-danger-zone";

export function ReportDetails() {
  const { selectedReport, loading, error } = useSelector((state: RootState) => state.reports);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl my-8 mx-auto max-w-2xl border border-red-100">
        <p className="text-red-600 font-bold mb-1">Error Loading Report</p>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!selectedReport) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        Report not found.
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto pb-12 w-full">
      <ReportHeader report={selectedReport} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ReportImage report={selectedReport} />
          <ReportLocation report={selectedReport} />
        </div>

        <div className="lg:col-span-1 flex flex-col flex-1 pb-6 h-full">
          <ReportInfo report={selectedReport} />
          <ReportReporter report={selectedReport} />
          <ReportDangerZone report={selectedReport} />
        </div>
      </div>
    </div>
  );
}

