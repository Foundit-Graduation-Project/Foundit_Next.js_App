export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/admin-login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USERS: "/users",
  REPORTS: "/reports",
  COMMUNITIES: "/communities",
  TRANSACTIONS: "/transactions",
  BROADCASTS: "/broadcasts",
  HELPDESK: "/helpdesk",
} as const;
