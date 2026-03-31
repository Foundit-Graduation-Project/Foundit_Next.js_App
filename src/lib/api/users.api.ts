import api from "./axios";
import { ENDPOINTS } from "./endpoints";
import { ProfileFormValues, ChangePasswordFormValues } from "../validations/profile.schema";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const updateMeAPI = async (data: ProfileFormValues) => {
  const response = await api.patch(ENDPOINTS.USERS.UPDATE_ME, data);
  return response.data.data;
};

export const updateAvatarAPI = async (formData: FormData) => {
  const response = await api.patch(ENDPOINTS.USERS.UPDATE_AVATAR, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const changePasswordAPI = async (data: ChangePasswordFormValues) => {
  // Backend expects currentPassword, newPassword, confirmPassword
  const response = await api.patch(ENDPOINTS.USERS.CHANGE_PASSWORD, {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmNewPassword,
  });
  return response.data;
};

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
