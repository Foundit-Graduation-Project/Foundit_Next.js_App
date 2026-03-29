import { RootState } from "@/redux/store";

export const selectIsSidebarOpen = (state: RootState) => state.ui.isSidebarOpen;
export const selectTheme = (state: RootState) => state.ui.theme;
