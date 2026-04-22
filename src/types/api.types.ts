// JSend Standard Statuses
export type JSendStatus = "success" | "fail" | "error";

// The base response we get from every backend API
export type ApiResponse<T = any> = {
  status: JSendStatus;
  data?: T; // Holds the actual data (user, reports, etc.)
  message?: string; // Usually present on 'error' or 'fail'
  code?: number | string; // Optional error code
};

// Standard structure for our paginated queries (like getReports or getUsers)
export type PaginatedResponse<T> = ApiResponse<{
  [key: string]: any; // Dynamic key (e.g., 'users' or 'reports')
  totalCount?: number;
  total?: number;
  hasMore?: boolean;
  currentPage?: number;
}>;