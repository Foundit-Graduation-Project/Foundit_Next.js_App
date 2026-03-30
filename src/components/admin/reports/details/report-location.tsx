"use client";
import React from "react";
import { ReportDetail } from "@/types/report.types";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const MapView = dynamic<{ position: [number, number] }>(() => import("./map-view").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100">
      <p className="text-sm text-gray-500 font-medium">Loading Map...</p>
    </div>
  ),
});

interface Props {
  report: ReportDetail;
}

export const ReportLocation = ({ report }: Props) => {
  const coords = report.location?.coordinates || [0, 0];
  // Note: GeoJSON stores mostly [longitude, latitude], Leaflet needs [latitude, longitude]
  // Ensure we flip them if needed. Usually Mongoose Point is [lng, lat].
  const isGeoJSON = report.location?.type === "Point";
  const position: [number, number] = isGeoJSON && coords.length >= 2
    ? [coords[1], coords[0]]
    : [coords[0] || 0, coords[1] || 0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Location Details</h2>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold tracking-wider uppercase">
          <MapPin className="w-3 h-3" />
          Coordinates Attached
        </div>
      </div>
      
      {/* Map Area */}
      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-100 relative z-0">
        <MapView position={position} />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          {report.locationName || "Location point associated with this report."}
        </p>
      </div>
    </div>
  );
};
