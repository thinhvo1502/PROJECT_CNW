import axios from "axios";
import { getCookie } from "./cookies";

// API URL
const API_URL = "https://1faa-1-52-242-144.ngrok-free.app/api";

// Tạo instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie
    const token = getCookie("auth_token");

    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Chuyển hướng đến trang đăng nhập
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
