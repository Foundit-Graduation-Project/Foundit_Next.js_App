import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAdminAPI, logoutAdminAPI } from "@/lib/api/auth.api";
import { AdminLoginFormValues } from "@/lib/validations/auth.schema";

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