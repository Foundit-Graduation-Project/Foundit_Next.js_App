import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBroadcasts = createAsyncThunk(
  "broadcasts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
