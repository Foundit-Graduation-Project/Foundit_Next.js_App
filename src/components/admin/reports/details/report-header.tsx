import React from "react";
import { ReportDetail } from "@/types/report.types";
import { Badge, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateReportStatus } from "@/redux/features/reports/reportsThunk";

export const ReportHeader = ({ report }: { report: ReportDetail }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateReportStatus({ id: report._id, status: e.target.value as any }));
  };

  return (
    <div className="mb-8">
      <Link href="/admin/reports" className="flex items-center text-sm font-bold text-blue-600 mb-6 hover:text-blue-700 transition-colors w-max">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Reports
      </Link>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">{report.title}</h1>
          <p className="text-sm font-medium text-gray-400 mt-2 tracking-wide uppercase">
            Report ID: <span className="text-gray-500 mr-4">#{report?._id?.slice(-8).toUpperCase() || 'UNKNOWN'}</span>
            Reporter Email: <span className="text-blue-500 lowercase font-bold">{report?.user?.email || 'N/A'}</span>
          </p>
        </div>
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors flex items-center shrink-0">
          <label className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wide">Status:</label>
          <p>{report.status}</p>
        </div>
      </div>
    </div>
  );
};
