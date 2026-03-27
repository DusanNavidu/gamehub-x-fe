import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth"; // ඔයාගේ auth service path එක හරියටම දෙන්න

const api = axios.create({
  baseURL: "https://game-hub-x-backend.vercel.app/api/v1", // Express backend URL
});

const PUBLIC_ENDPOINTS = ["/auth/request-otp", "/auth/verify-otp", "/auth/refresh-token", "/auth/register"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const data = await refreshTokens(refreshToken);
        
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest); // 🔴 axios වෙනුවට api පාවිච්චි කරන්න 
        
      } catch (refreshErr) {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        window.location.href = "/login"; // Logout වෙනවා
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;