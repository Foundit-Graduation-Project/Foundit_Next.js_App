import axios, { InternalAxiosRequestConfig } from "axios";

// 1. Extend Axios config to include our custom _retry flag for TypeScript
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 🔥 FIX: Read from environment variable with proper fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

// Debug logging in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("[API Config] Using base URL:", BASE_URL);
}

// 2. Create Base Instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 CRITICAL: Allows frontend to send/receive cookies
  // Add timeout for production stability
  timeout: process.env.NODE_ENV === "production" ? 30000 : 0,
});

// 3. Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Next.js Safety Check: Only access localStorage if we are in the browser!
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Response Interceptor with improved logging
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[API Response] Status:", response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");

    // Added logging for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", error.response?.status, originalRequest?.url);
    }

    // If backend returns 401, attempt refresh token flow
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        // Use the same BASE_URL to ensure consistency
        const res = await axios.get(`${BASE_URL}/auth/refresh-token`, {
          withCredentials: true,
        });

        const newAccessToken = res.data.data.accessToken;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("[API] Token refresh failed:", refreshError);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          // 🔥 FIXED: Redirect to proper auth page
          window.location.href = "/admin-login";
        }
        return Promise.reject(refreshError);
      }
    }

    // --- SMART ERROR EXTRACTION ---
    const resData = error.response?.data;
    let errorMessage = "An error occurred. Please try again.";

    if (resData) {
      // 1. Check if it's a Joi Validation Error
      if (resData.status === "fail" && Array.isArray(resData.data)) {
        errorMessage = resData.data.map((err: any) => err.message).join(" • ");
      }
      // 2. Check if it's a standard backend AppError message
      else if (resData.message) {
        errorMessage = resData.message;
      }
    }

    return Promise.reject(errorMessage);
  }
);

export default api;