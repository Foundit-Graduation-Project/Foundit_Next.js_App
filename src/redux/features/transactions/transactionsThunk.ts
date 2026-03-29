import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
