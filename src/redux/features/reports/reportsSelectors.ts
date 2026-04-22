import { RootState } from "@/redux/store";

export const selectReports = (state: RootState) => state.reports.items;
export const selectReportsLoading = (state: RootState) => state.reports.loading;
