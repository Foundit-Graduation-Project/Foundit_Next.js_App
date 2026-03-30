import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin, logoutAdmin, updateProfile, updateAvatar, changePassword } from "./authThunk";

interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

// Next.js SSR Check for localStorage
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Extract user from payload
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Avatar
      .addCase(updateAvatar.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Extract user from payload
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;