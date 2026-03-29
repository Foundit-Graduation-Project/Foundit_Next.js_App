import { RootState } from "@/redux/store";

export const selectTransactions = (state: RootState) => state.transactions.items;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
