export type ApiResponse<T = any> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
