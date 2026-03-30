import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  type: "status" | "role";
  value: string;
}

export function UserStatusBadge({ type, value }: UserStatusBadgeProps) {
  const normValue = value?.toLowerCase() || "";

  if (type === "role") {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "uppercase text-[10px] font-bold tracking-wider px-2.5 py-0.5 whitespace-nowrap",
          normValue === "admin" || normValue === "community_admin" || normValue === "super_admin"
            ? "bg-blue-100/50 text-blue-600 hover:bg-blue-100/50" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
        )}
      >
        {normValue.replace("_", " ")}
      </Badge>
    );
  }

  // Status Badge
  const isActive = normValue === "active";
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 whitespace-nowrap border-0 rounded-full font-medium text-xs",
        isActive 
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50" 
          : "bg-red-50 text-red-600 hover:bg-red-50"
      )}
    >
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        isActive ? "bg-emerald-500" : "bg-red-500"
      )} />
      <span className="capitalize">{normValue}</span>
    </Badge>
  );
}
