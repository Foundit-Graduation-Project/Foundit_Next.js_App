"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFilters, resetFilters } from "@/redux/features/reports/reportsSlice";

export function ReportsFilters() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.reports);
  const [searchTerm, setSearchTerm] = useState(filters.keyword || "");

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== filters.keyword) {
        dispatch(setFilters({ keyword: searchTerm }));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch, filters.keyword]);

  // Sync internal state with Redux if filters are reset externally
  useEffect(() => {
    setSearchTerm(filters.keyword || "");
  }, [filters.keyword]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ status: e.target.value as any }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ type: e.target.value as any }));
  };

  const hasActiveFilters = filters.keyword || filters.status || filters.type;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, category, or description..."
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
          <select
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="bg-gray-50 border border-transparent hover:border-gray-200 px-3 py-2.5 rounded-xl text-sm font-medium focus:bg-white transition-all outline-none min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="MATCHED">Matched</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</label>
          <select
            value={filters.type || ""}
            onChange={handleTypeChange}
            className="bg-gray-50 border border-transparent hover:border-gray-200 px-3 py-2.5 rounded-xl text-sm font-medium focus:bg-white transition-all outline-none min-w-[120px]"
          >
            <option value="">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Filter className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
