import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchReports = createAsyncThunk(
  "reports/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
