import React from "react";

export function EmptyState({ message = "No data found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
