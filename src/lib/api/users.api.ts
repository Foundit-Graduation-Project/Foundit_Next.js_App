import api from "./axios";
import { ENDPOINTS } from "./endpoints";
import { ProfileFormValues, ChangePasswordFormValues } from "../validations/profile.schema";

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
    confirmPassword: data.confirmPassword,
  });
  return response.data;
};

export const usersApi = {
  getUsers: () => Promise.resolve({ data: [] }),
  getUser: (id: string) => Promise.resolve({ data: {} }),
  updateUser: (id: string, data: any) => Promise.resolve({ data: {} }),
};
