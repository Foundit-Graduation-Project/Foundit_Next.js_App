import { RootState } from "@/redux/store";

export const selectTransactions = (state: RootState) => state.transactions.items;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectTransactionsStats = (state: RootState) => state.transactions.stats;
export const selectTransactionsTotalCount = (state: RootState) => state.transactions.totalCount;
export const selectTransactionsTotalPages = (state: RootState) => state.transactions.totalPages;
export const selectTransactionsError = (state: RootState) => state.transactions.error;
