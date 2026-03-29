import React from "react";

export function ErrorState({ error }: { error?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border border-destructive/20 bg-destructive/5 rounded-lg">
      <p className="text-destructive font-semibold">Something went wrong</p>
      {error && <p className="text-destructive/80 text-sm mt-1">{error}</p>}
    </div>
  );
}
