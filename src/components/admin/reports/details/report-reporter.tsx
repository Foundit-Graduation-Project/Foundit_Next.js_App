import React from "react";
import { ReportDetail } from "@/types/report.types";

interface Props {
  report: ReportDetail;
}

export const ReportReporter = ({ report }: Props) => {
  const user = report.user;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Reporter Info</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0) || "?"
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{user?.name || "Unknown User"}</p>
            <p className="text-[10px] text-gray-500">{user?.email || "No email"}</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-xs rounded-lg transition-colors border border-gray-200">
          View Profile
        </button>
      </div>
    </div>
  );
};
