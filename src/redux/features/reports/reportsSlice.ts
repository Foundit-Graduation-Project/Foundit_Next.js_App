import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Report, ReportsState,ReportStats } from "@/types/report.types";


const initialState:ReportsState = { 
  items:[],
  stats: {
    OPEN: 0,
    REJECTED: 0,
    MATCHED: 0,
    RESOLVED: 0,
    total: 0,
  },
  pagination:{ total: 0, page: 1, limit: 10},
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports: (state, action:PayloadAction<Report[]>) => {
      state.items = action.payload;
    },
    updateStats: (state, action: PayloadAction<ReportStats>) => {
      state.stats = action.payload;
    },
    updateSingleReportStatus: (state, action: PayloadAction<{id: string, status: Report["status"]}>) => {
      const report = state.items.find(r => r.id === action.payload.id);
      if (report) {
        report.status = action.payload.status;
      }
    },
  },
});

export const { setReports,updateStats,updateSingleReportStatus } = reportsSlice.actions;
export default reportsSlice.reducer;
