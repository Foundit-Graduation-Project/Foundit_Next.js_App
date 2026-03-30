import React from "react";
import { ReportDetail } from "@/types/report.types";

export const ReportImage = ({ report }: { report: ReportDetail }) => {
  const imageUrl = report.images?.[0]?.url || "/placeholder-item.png";
  return (
    <div className="w-full bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6">
      <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gray-50 relative group border border-gray-100">
        <img
          src={imageUrl}
          alt={report.title}
          className="w-full h-full object-cover filter transition-all duration-300 hover:scale-[1.02]"
        />
      </div>
    </div>
  );
};
