import api from "./axios";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const usersApi = {
  getUsers: async (params?: GetUsersParams) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },
  getUser: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  createUser: async (data: any) => {
    const response = await api.post("/admin/users", data);
    return response.data;
  },
  updateUserStatus: async (id: string, status: "active" | "banned") => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },
};
