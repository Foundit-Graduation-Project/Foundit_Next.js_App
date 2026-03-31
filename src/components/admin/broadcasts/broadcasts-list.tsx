"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBroadcasts } from "@/redux/features/broadcasts/broadcastsThunk";
import { Broadcast } from "@/types/broadcast.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Users, Tag, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  ALERT: { bg: "bg-red-50", text: "text-red-900", badge: "bg-red-100 text-red-700" },
  SYSTEM: { bg: "bg-blue-50", text: "text-blue-900", badge: "bg-blue-100 text-blue-700" },
  MATCH: { bg: "bg-purple-50", text: "text-purple-900", badge: "bg-purple-100 text-purple-700" },
  MESSAGE: { bg: "bg-green-50", text: "text-green-900", badge: "bg-green-100 text-green-700" },
};

const ITEMS_PER_PAGE = 5;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

export function BroadcastsList() {
  const dispatch = useAppDispatch();
  const { items: broadcasts, loading, error } = useAppSelector((state) => state.broadcasts);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBroadcasts() as any);
  }, [dispatch]);

  const totalPages = Math.ceil(broadcasts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBroadcasts = broadcasts.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading && broadcasts.length === 0) {
    return (
      <Card className="border-gray-100 rounded-2xl overflow-hidden">
        <div className="bg-linear-to-br from-blue-50/80 to-indigo-50/50 p-6 border-b border-gray-100/50">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Broadcast History
          </h2>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-3xl overflow-hidden border border-transparent bg-linear-to-br from-indigo-200/40 via-violet-200/30 to-cyan-200/20 shadow-[0_16px_40px_rgba(49,60,98,0.22)]">
        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-3xl m-1 overflow-hidden">
          <div className="bg-linear-to-br from-blue-50/90 to-indigo-50/70 p-6 border-b border-gray-200/70">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Broadcast History
            </h2>
          </div>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Failed to load broadcasts</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl overflow-hidden border border-transparent bg-linear-to-br from-indigo-200/40 via-violet-200/30 to-cyan-200/20 shadow-[0_16px_40px_rgba(49,60,98,0.22)]">
      <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-3xl m-1 overflow-hidden">
        <div className="bg-linear-to-br from-blue-50/90 to-indigo-50/70 p-6 border-b border-gray-200/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Broadcast History
              </h2>
              <p className="text-gray-500 text-sm mt-1.5">
                Recent broadcasts sent to users
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{broadcasts.length}</p>
              <p className="text-xs text-gray-500">Total broadcasts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {broadcasts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No broadcasts sent yet</p>
            <p className="text-gray-400 text-sm mt-1">Create and send your first broadcast using the button above</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {paginatedBroadcasts.map((broadcast, index) => {
                const colors = CATEGORY_COLORS[broadcast.category] || CATEGORY_COLORS.SYSTEM;
                const formattedDate = formatDate(broadcast.sentAt);

                return (
                  <div
                    key={index}
                    className={`${colors.bg} border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`${colors.badge} px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2`}>
                            <Tag className="w-3 h-3" />
                            {broadcast.category}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold ${colors.text} leading-tight mb-1`}>
                          {broadcast.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {broadcast.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 pt-4 border-t border-gray-300/30">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{broadcast.recipientCount} users</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
