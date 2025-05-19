import axios from "axios";
import { getCookie } from "./cookies";

// Cập nhật API_URL để sử dụng biến môi trường
const API_URL = "http://localhost:5000/api";

// Tạo instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Đảm bảo rằng các header được thiết lập đúng
api.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie
    const token = getCookie("auth_token");

    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Đảm bảo Content-Type được thiết lập
    config.headers["Content-Type"] = "application/json";

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
