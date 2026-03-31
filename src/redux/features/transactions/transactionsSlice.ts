import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions, fetchTransactionStats } from "./transactionsThunk";

interface TransactionsState {
  items: any[];
  stats: any | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
}

const initialState: TransactionsState = {
  items: [],
  stats: null,
  loading: false,
  error: null,
  totalCount: 0,
  totalPages: 1,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.transactions;
        state.totalCount = action.payload.totalCount;
        state.totalPages = Math.ceil(action.payload.totalCount / 10) || 1;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Stats
      .addCase(fetchTransactionStats.fulfilled, (state, action: any) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
