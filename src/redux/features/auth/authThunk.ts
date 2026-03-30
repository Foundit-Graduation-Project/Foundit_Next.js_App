import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAdminAPI, logoutAdminAPI } from "@/lib/api/auth.api";
import { updateMeAPI, updateAvatarAPI, changePasswordAPI } from "@/lib/api/users.api";
import { AdminLoginFormValues } from "@/lib/validations/auth.schema";
import { ProfileFormValues, ChangePasswordFormValues } from "@/lib/validations/profile.schema";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials: AdminLoginFormValues, { rejectWithValue }) => {
    try {
      const data = await loginAdminAPI(credentials);
      return data; 
    } catch (error: any) {
      return rejectWithValue(error || "Login failed");
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await logoutAdminAPI();
      return null;
    } catch (error: any) {
      return rejectWithValue(error || "Logout failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: ProfileFormValues, { rejectWithValue }) => {
    try {
      const response = await updateMeAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to update profile");
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await updateAvatarAPI(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to upload avatar");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordFormValues, { rejectWithValue }) => {
    try {
      const response = await changePasswordAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to change password");
    }
  }
);