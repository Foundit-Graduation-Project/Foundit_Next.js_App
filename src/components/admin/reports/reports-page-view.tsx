"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchReports } from "@/redux/features/reports/reportsThunk";
import { ReportsTable } from "./reports-table";
import { ReportsFilters } from "./reports-filters";
import { Pagination } from "@/components/shared/pagination";

export const ReportsPageView = () => {
  const dispatch = useAppDispatch();
  const { pagination, filters } = useAppSelector((state) => state.reports);

  // Initial Data Fetching & Filter Changes
  useEffect(() => {
    // Clean filters to remove empty strings
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    dispatch(fetchReports({
      page: pagination.page,
      limit: pagination.limit,
      ...cleanFilters
    }));
  }, [dispatch, pagination.page, filters]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      {/* Breadcrumbs and Main Title */}
      <div className="max-w-[1400px] mx-auto space-y-8">
        <header>
        </header>

        {/* Filters and Search Bar Area */}
        <ReportsFilters />

        {/* The Main Data Table */}
        <ReportsTable />

        {/* Bottom Pagination */}
        <div className="flex justify-between items-center px-2">
          <p className="text-xs font-medium text-gray-400">
            Showing <span className="text-gray-900 font-bold">
              {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of <span className="text-gray-900 font-bold">{pagination.total}</span> reports
          </p>
          <Pagination />
        </div>
      </div>
    </div>
  );
};