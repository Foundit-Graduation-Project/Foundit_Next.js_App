import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin, logoutAdmin, updateProfile, updateAvatar, changePassword } from "./authThunk";

interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean; // 🔥 NEW: Track hydration state
}

// 🔥 FIX: Lazy initialization for SSR safety
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("[Auth] Error parsing user from storage:", e);
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  user: null, // 🔥 CHANGED: Start with null for SSR
  isLoading: false,
  error: null,
  isHydrated: false, // 🔥 NEW: Track hydration
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔥 NEW: Hydrate from localStorage when component mounts
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const user = getUserFromStorage();
        const token = localStorage.getItem("accessToken");
        if (user && token) {
          state.user = user;
        }
      }
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isHydrated = true; // 🔥 Mark hydrated on successful login
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
        state.isHydrated = true;
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
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
        state.user = action.payload.user;
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

export const { hydrateAuth } = authSlice.actions;
export default authSlice.reducer;