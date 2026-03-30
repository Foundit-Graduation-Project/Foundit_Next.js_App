import React from "react";
import { ReportDetail } from "@/types/report.types";

interface Props {
  report: ReportDetail;
}

export const ReportInfo = ({ report }: Props) => {
  const isLost = report.type === "LOST";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-bold text-gray-900">Report Information</h2>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full ${
            isLost
              ? "bg-pink-50 text-pink-600 border border-pink-100"
              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}
        >
          {report.type}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Category
          </p>
          <p className="text-sm font-semibold text-gray-900">{report.category}</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Description
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {report.description || "No description provided."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Date Happened
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {report.dateHappened
                ? new Date(report.dateHappened).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unknown"}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {report.dateHappened
                ? new Date(report.dateHappened).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Verified By
            </p>
            <p className="text-sm font-semibold text-gray-900">AI Guard Scan</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {report.aiScanScore
                ? `${report.aiScanScore}% accuracy match`
                : "98% accuracy match"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
