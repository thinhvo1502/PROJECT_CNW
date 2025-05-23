import axios from "axios";
import { getCookie } from "./cookies";

// API URL
export const API_URL = "https://437f-113-161-89-176.ngrok-free.app/api";

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
    // Lấy token từ cookie HOẶC localStorage
    let token = getCookie("auth_token");

    // Dùng localStorage như backup nếu cookie không có
    if (!token) {
      token = localStorage.getItem("auth_token");
    }

    console.log(
      "Using token:",
      token ? `${token.substring(0, 15)}...` : "Not found"
    );

    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // KHÔNG THÊM cache-control headers vì sẽ gây lỗi CORS
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

    console.error("API Error:", error.response?.status, error.response?.data);

    // Nếu lỗi 401 (Unauthorized) và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("Unauthorized access, redirecting to login");
      // Chuyển hướng đến trang đăng nhập
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
