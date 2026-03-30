import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Report, ReportsState, ReportStats } from "@/types/report.types";
import { fetchReports } from "./reportsThunk";


const initialState: ReportsState = {
  items: [],
  stats: {
    OPEN: 0,
    REJECTED: 0,
    MATCHED: 0,
    RESOLVED: 0,
    total: 0,
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
    updateSingleReportStatus: (state, action: PayloadAction<{ id: string, status: Report["status"] }>) => {
      const report = state.items.find(r => r._id === action.payload.id);
      if (report) {
        report.status = action.payload.status;
      }
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
      });
  },
});

export const { setReports, updateStats, setPage, updateSingleReportStatus } = reportsSlice.actions;
export default reportsSlice.reducer;
