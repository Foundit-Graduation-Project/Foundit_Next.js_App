
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { Report, ReportStatus } from '@/types/report.types';
import api from './axios';
export const reportsApi = {


/**
   * @desc    Get dashboard metrics (Total, Pending, Resolved counts)
   * @route   GET /api/v1/admin/stats
   */
  getAdminStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/reports/stats');
    return response.data;
  },

  /**
   * @desc    Fetch all reports with pagination and filtering support
   * @route   GET /api/v1/admin/reports
   * @params  { page, limit, status, type, etc. }
   */
  getAllReports: async (params?: any): Promise<PaginatedResponse<Report[]>> => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  /**
   * @desc    Update a report's status (Approve, Reject, or Resolve)
   * @route   PATCH /api/v1/admin/report/:id/status
   */
  updateReportStatus: async (id: string, status: ReportStatus): Promise<ApiResponse<Report>> => {
    const response = await api.patch(`/admin/report/${id}/status`, { status });
    return response.data;
  },

  /**
   * @desc    Fetch a specific report by its ID
   * @route   GET /api/v1/reports/:id
   */
  getReportById: async (id: string): Promise<ApiResponse<Report>> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  /**
   * @desc    Delete a report (Danger Zone)
   * @route   DELETE /api/v1/admin/reports/:id
   */
  deleteReportAdmin: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  }
};