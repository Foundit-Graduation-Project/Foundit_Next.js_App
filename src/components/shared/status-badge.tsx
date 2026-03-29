import React from "react";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline">{status}</Badge>;
}
