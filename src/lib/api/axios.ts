import axios, { InternalAxiosRequestConfig } from "axios";

// 1. Extend Axios config to include our custom _retry flag for TypeScript
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 2. Create Base Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: true, // 🔥 CRITICAL: Allows frontend to send/receive the refreshToken cookie
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

// 4. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");

    // If backend returns 401, we haven't retried yet, and it's NOT a login/refresh attempt
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

        // Try to get a new access token using the HttpOnly cookie
        const res = await axios.get(`${baseURL}/auth/refresh-token`, {
          withCredentials: true,
        });

        const newAccessToken = res.data.data.accessToken;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh-token fails, log the user out
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/admin-login"; // 🔥 Redirect to Admin Login!
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