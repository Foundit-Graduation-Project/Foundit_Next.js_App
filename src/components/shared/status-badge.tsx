import React from "react";
import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "@/types/report.types";

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    // Report Statuses
    OPEN: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    MATCHED: "bg-purple-100 text-purple-700",
    RESOLVED: "bg-green-100 text-green-700",
    
    // Transaction Statuses
    SUCCESS: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-rose-100 text-rose-700",
  };

  const variantClass = variants[status.toUpperCase()] || "bg-gray-100 text-gray-700";

  return <Badge className={variantClass}>{status}</Badge>;
};
  