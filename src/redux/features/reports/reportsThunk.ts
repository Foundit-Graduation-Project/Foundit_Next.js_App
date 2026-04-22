import { reportsApi } from "@/lib/api/reports.api";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { ReportStatus, FetchReportsPayload } from "@/types/report.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// fetch all reports
export const fetchReports = createAsyncThunk<FetchReportsPayload, any, { rejectValue: string }>("reports/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      console.log("[REDUX THUNK] Fetching reports with params:", params);
      const response = await reportsApi.getAllReports(params);
      console.log("[REDUX THUNK] Raw API Response:", response);
      
      // response.data is where the actual reports and total are (due to JSend structure)
      return response.data as FetchReportsPayload;
    } catch (error) {
      console.error("[REDUX THUNK] Error fetching reports:", error);
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

// delete report admin
export const deleteReportThunk = createAsyncThunk(
  "reports/deleteAdmin",
  async (id: string, { rejectWithValue }) => {
    try {
      await reportsApi.deleteReportAdmin(id);
      return id; // Return the id so we can filter it from local state
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);