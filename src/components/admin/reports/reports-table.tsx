"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModerationActions } from "./moderation-actions";
import { AppLoader } from "@/components/shared/app-loader";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const ReportsTable = () => {
  // Select data from Redux Store
  const { items, loading } = useSelector((state: RootState) => state.reports);

  // Show loader while fetching
  if (loading) return <AppLoader />;

  // Empty state handling
  if (!items || items.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">No reports matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <th className="px-6 py-4">Item Detail</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Reporter</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50/40 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-50">
                    <img
                      src={report.images?.[0]?.url || "/placeholder-item.png"}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{report.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Ref: #FT-{report._id?.slice(-4).toUpperCase() || '????'}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${report.type === "LOST"
                  ? "bg-pink-50 text-pink-600 border-pink-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}>
                  {report.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium text-gray-600">{report.category}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                    {report.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{report.user?.name}</p>
                    <p className="text-[10px] text-gray-400">{report.user?.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={report.status} />
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/reports/${report._id}`}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all group"
                >
                  <ChevronRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};