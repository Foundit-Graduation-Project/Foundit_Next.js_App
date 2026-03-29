
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { Report, ReportStatus } from '@/types/report.types';
import { axiosInstance } from './axios';
export const reportsApi = {


/**
   * @desc    Get dashboard metrics (Total, Pending, Resolved counts)
   * @route   GET /api/v1/admin/stats
   */
  getAdminStats: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  /**
   * @desc    Fetch all reports with pagination and filtering support
   * @route   GET /api/v1/reports
   * @params  { page, limit, status, type, etc. }
   */
  getAllReports: async (params?: any): Promise<PaginatedResponse<Report[]>> => {
    const response = await axiosInstance.get('/reports', { params });
    return response.data;
  },

  /**
   * @desc    Update a report's status (Approve, Reject, or Resolve)
   * @route   PATCH /api/v1/admin/report/:id/status
   */
  updateReportStatus: async (id: string, status: ReportStatus): Promise<ApiResponse<Report>> => {
    const response = await axiosInstance.patch(`/admin/report/${id}/status`, { status });
    return response.data;
  },

  /**
   * @desc    Fetch a specific report by its ID
   * @route   GET /api/v1/reports/:id
   */
  getReportById: async (id: string): Promise<ApiResponse<Report>> => {
    const response = await axiosInstance.get(`/reports/${id}`);
    return response.data;
  }
};