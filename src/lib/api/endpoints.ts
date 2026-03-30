export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    BASE: "/users",
    ME: "/users/me",
    UPDATE_ME: "/users/update-me",
    UPDATE_AVATAR: "/users/update-avatar",
    CHANGE_PASSWORD: "/users/change-password",
  },
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
