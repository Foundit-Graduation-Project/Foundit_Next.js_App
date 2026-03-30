import { reportsApi } from "@/lib/api/reports.api";
import { getErrorMessage } from "@/lib/utils";
import { ReportStatus } from "@/types/report.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// fetch all reports
export const fetchReports = createAsyncThunk(
  "reports/fetchAll",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await reportsApi.getAllReports(params);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// fetch admin stats
export const fetchAdminStats = createAsyncThunk(
  "reports/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsApi.getAdminStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// update report status
export const updateReportStatus = createAsyncThunk(
  "reports/updateStatus",
  async ({ id, status }: { id: string; status: ReportStatus }, { rejectWithValue }) => {
    try {
      const response = await reportsApi.updateReportStatus(id, status);
      return response.data; 
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// fetch report by id
export const fetchReportById = createAsyncThunk(
  "reports/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await reportsApi.getReportById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);