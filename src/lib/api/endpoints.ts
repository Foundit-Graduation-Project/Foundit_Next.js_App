export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: "/users",
  REPORTS: "/admin/reports",
  COMMUNITIES: "/admin/communities",
  TRANSACTIONS: "/admin/transactions",
  BROADCASTS: "/admin/broadcasts",
  HELPDESK: "/admin/helpdesk",
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    MESSAGES: "/chat/messages",
  },
  SUPPORT: {
    TICKET: "/support/ticket",
  },
} as const;
