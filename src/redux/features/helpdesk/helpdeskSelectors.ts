import { RootState } from "@/redux/store";

export const selectTickets = (state: RootState) => state.helpdesk.items;
export const selectHelpdeskLoading = (state: RootState) => state.helpdesk.loading;
