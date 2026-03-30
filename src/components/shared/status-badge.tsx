import React from "react";
import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "@/types/report.types";

export function StatusBadge({ status }: { status: ReportStatus }) {
  const variants: Record<ReportStatus, string> = {
    OPEN: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    MATCHED: "bg-purple-100 text-purple-700",
    RESOLVED: "bg-green-100 text-green-700",
  };

  const variantClass = variants[status] || "bg-gray-100 text-gray-700";

  return <Badge className={variantClass}>{status}</Badge>;
};
  