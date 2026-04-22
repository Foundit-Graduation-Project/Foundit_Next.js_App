"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchReportById } from "@/redux/features/reports/reportsThunk";
import { clearSelectedReport } from "@/redux/features/reports/reportsSlice";
import { ReportDetails } from "@/components/admin/reports/report-details";
import { useParams } from "next/navigation";

export default function ReportDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
       dispatch(fetchReportById(id));
    }
    return () => {
      dispatch(clearSelectedReport());
    };
  }, [dispatch, id]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 pt-6">
      <ReportDetails />
    </div>
  );
}
