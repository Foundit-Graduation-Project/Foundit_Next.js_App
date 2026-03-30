import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Report, ReportsState, ReportStats } from "@/types/report.types";
import { fetchReports, fetchReportById, deleteReportThunk, fetchAdminStats } from "./reportsThunk";


const initialState: ReportsState = {
  items: [],
  selectedReport: null,
  stats: {
    OPEN: 0,
    REJECTED: 0,
    MATCHED: 0,
    RESOLVED: 0,
    total: 0,
  },
  filters: {
    keyword: "",
    status: "",
    type: "",
  },
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.items = action.payload;
    },
    updateStats: (state, action: PayloadAction<ReportStats>) => {
      state.stats = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setFilters: (state, action: PayloadAction<ReportsState["filters"]>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 on filter change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    updateSingleReportStatus: (state, action: PayloadAction<{ id: string, status: Report["status"] }>) => {
      const report = state.items.find(r => r._id === action.payload.id);
      if (report) {
        report.status = action.payload.status;
      }
      if (state.selectedReport && state.selectedReport._id === action.payload.id) {
        state.selectedReport.status = action.payload.status;
      }
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.pagination.total = action.payload.length || 0;
          state.pagination.totalPages = Math.ceil((action.payload.length || 0) / state.pagination.limit);
        } else {
          state.items = action.payload?.reports || [];
          const total = action.payload?.total || 0;
          state.pagination.total = total;
          state.pagination.totalPages = action.payload?.totalPages || Math.ceil(total / state.pagination.limit);
        }
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedReport = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action: any) => {
        state.loading = false;
        // Unwrap deeply nested payload if exists e.g., action.payload.report or action.payload.data.report
        const data = action.payload;
        if (data?.report) {
          state.selectedReport = data.report;
        } else if (data?.data?.report) {
          state.selectedReport = data.data.report;
        } else {
          state.selectedReport = data;
        }
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action: any) => {
        state.loading = false;
        const data = action.payload?.data || action.payload;
        if (data) {
          state.stats = {
            total: data.totalReports || 0,
            OPEN: data.pendingReview || 0,
            MATCHED: data.matchedReports || 0,
            RESOLVED: data.resolvedTotal || data.resolvedToday || 0,
            REJECTED: data.rejectedCount || 0
          };
        }
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteReportThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.selectedReport && state.selectedReport._id === action.payload) {
          state.selectedReport = null;
        }
      });
  },
});

export const { setReports, updateStats, setPage, updateSingleReportStatus, clearSelectedReport, setFilters, resetFilters } = reportsSlice.actions;
export default reportsSlice.reducer;
