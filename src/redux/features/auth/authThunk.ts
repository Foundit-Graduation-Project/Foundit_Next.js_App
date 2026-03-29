import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      return { user: {}, token: "fake-token" };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
