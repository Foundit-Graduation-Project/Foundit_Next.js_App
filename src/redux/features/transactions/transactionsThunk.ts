import { createAsyncThunk } from "@reduxjs/toolkit";
import { transactionsApi } from "@/lib/api/transactions.api";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransactions(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTransactionStats = createAsyncThunk(
  "transactions/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransactionStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
