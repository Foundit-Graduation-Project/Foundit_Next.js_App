import api from "./axios";

export interface DashboardStats {
  summary: {
    totalUsers: number;
    activeReports: number;
    resolvedCases: number;
    matchedCases: number;
    rejectedCases: number;
    totalRevenue: number;
  };
  charts: {
    reportsByCategory: {
      last7Days: { category: string; count: number }[];
      last30Days: { category: string; count: number }[];
      allTime: { category: string; count: number }[];
    };
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data.data;
};
