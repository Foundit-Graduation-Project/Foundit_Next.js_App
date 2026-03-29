import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import uiReducer from "./features/ui/uiSlice";
import usersReducer from "./features/users/usersSlice";
import reportsReducer from "./features/reports/reportsSlice";
import communitiesReducer from "./features/communities/communitiesSlice";
import transactionsReducer from "./features/transactions/transactionsSlice";
import broadcastsReducer from "./features/broadcasts/broadcastsSlice";
import helpdeskReducer from "./features/helpdesk/helpdeskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer,
    reports: reportsReducer,
    communities: communitiesReducer,
    transactions: transactionsReducer,
    broadcasts: broadcastsReducer,
    helpdesk: helpdeskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
