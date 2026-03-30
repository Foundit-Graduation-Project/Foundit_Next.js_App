import api from "./axios";
import { 
  AdminLoginFormValues, 
  ForgotPasswordFormValues, 
  ResetPasswordFormValues 
} from "../validations/auth.schema";
import { ENDPOINTS } from "./endpoints";

export const loginAdminAPI = async (credentials: AdminLoginFormValues) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data.data; // JSend format
};

export const logoutAdminAPI = async () => {
  const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
  return response.data.data;
};

export const forgotPasswordAPI = async (data: ForgotPasswordFormValues) => {
  const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  return response.data;
};

export const resetPasswordAPI = async (token: string, data: ResetPasswordFormValues) => {
  // Field in backend MUST match what 'req.body' expects (newPassword)
  const response = await api.patch(`${ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, {
    newPassword: data.password,
    confirmNewPassword: data.confirmPassword
  });
  return response.data;
};