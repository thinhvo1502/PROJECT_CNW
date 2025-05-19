// context quản lý trạng thái đăng nhập/ đăng xuất
import React from "react";
import { setCookie, getCookie, deleteCookie } from "../utils/cookies";
import api from "../utils/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import axios from "axios";
import { updateUser, type UpdateUserData } from "../services/userService";
// Định nghĩa kiểu dữ liệu cho User
interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  class?: string;
  role: "student" | "admin";
  isActive: boolean;
  learningStats: {
    totalAttempts: number;
    averageScore: number;
    topicStats: {
      learned: number;
      total: number;
    };
  };
  // purchasedExams: string[];
}
// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  updateUserProfile: (
    userId: string,
    userData: UpdateUserData
  ) => Promise<User>;
  deleteUserAccount: (userId: string) => Promise<void>;
  examId: string | null;
  setExamId: (id: string | null) => void;
}
// Định nghĩa kiểu dữ liệu cho dữ liệu đăng ký
interface RegisterData {
  name: string;
  email: string;
  password: string;
  class?: string;
  profileImage?: string;
  confirmPassword: string;
}
// tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// API URL

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [examId, setExamId] = useState<string | null>(null);

  const API_URL = "http://localhost:5000/api";
  // Kiểm tra xem người dùng đã đăng nhập chưa khi component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setIsLoading(true);

        // Lấy token từ cookie
        const storedToken = getCookie("auth_token");

        // Lấy thông tin người dùng từ localStorage
        const storedUser = localStorage.getItem("user");

        if (!storedToken) {
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
        // Nếu có thông tin người dùng trong localStorage, sử dụng nó trước
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
        // console.log("auth: ", user);
        // // Gọi API để lấy thông tin người dùng mới nhất
        // Cấu hình headers
        console.log("tokens load", storedToken);
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        };

        // Gọi API để lấy thông tin người dùng
        console.log("token trước res", storedToken);
        const response = await api.get("/auth/me");
        console.log("responsez: ", response);
        // Cập nhật state và localStorage
        setUser(response.data.data.user);
        setToken(storedToken);
        setIsAuthenticated(true);
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      } catch (err) {
        console.error("Error checking authentication:", err);
        // Xóa token và thông tin người dùng không hợp lệ
        deleteCookie("auth_token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Đăng nhập
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // Gọi API đăng nhập
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      // Lưu token vào cookie và thông tin người dùng vào localStorage
      setCookie("auth_token", response.data.data.token, 7);
      console.log("auth: cookie", getCookie("auth_token"));
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      // Cập nhật state
      console.log("authcontext: user", response.data.data.user);
      setUser(response.data.data.user);
      setToken(response.data.data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      // Xử lý lỗi
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Đăng nhập thất bại");
      } else {
        setError("Không thể kết nối đến máy chủ");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // đăng ký
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      // gọi API đăng ký
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log(response);
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);

      // Cập nhật state
      setUser(response.data);
      setToken(response.data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      // Xử lý lỗi
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Đăng ký thất bại");
      } else {
        setError("Không thể kết nối đến máy chủ");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    // Xóa token từ localStorage
    localStorage.removeItem("token");

    // Cập nhật state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };
  // Xóa thông báo lỗi
  const clearError = () => {
    setError(null);
  };
  // đổi mật khẩu

  // Đổi mật khẩu
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      // Cấu hình headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Gọi API đổi mật khẩu
      await axios.put(
        `${API_URL}/auth/password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        config
      );
    } catch (err: any) {
      // Xử lý lỗi
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Đổi mật khẩu thất bại");
        throw new Error("Mật khẩu cũ không đúng");
      } else {
        setError("Không thể kết nối đến máy chủ");
        throw new Error("Không thể kết nối đến máy chủ");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Hàm để tải lại thông tin người dùng
  const refreshUserInfo = async () => {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };

      const response = await axios.get(`${API_URL}/auth/me`, config);

      setUser(response.data.user);
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error refreshing user info:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // Cập nhật thông tin người dùng
  const updateUserProfile = async (
    userId: string,
    userData: UpdateUserData
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("userId là: ", userId);
      // Gọi API cập nhật thông tin người dùng
      const updatedUser = await updateUser(userId, userData);
      console.log("về auth sau update");
      // Cập nhật state và localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err: any) {
      // Xử lý lỗi
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Cập nhật thông tin thất bại");
        throw new Error(err.response.data.message);
      } else {
        setError("Không thể kết nối đến máy chủ");
        throw new Error("Không thể kết nối đến máy chủ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa tài khoản người dùng
  const deleteUserAccount = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Gọi API xóa tài khoản
      await api.delete(`/users/${userId}`);

      // Đăng xuất sau khi xóa tài khoản
      logout();
    } catch (err: any) {
      // Xử lý lỗi
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Xóa tài khoản thất bại");
        throw new Error(err.response.data.message);
      } else {
        setError("Không thể kết nối đến máy chủ");
        throw new Error("Không thể kết nối đến máy chủ");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Giá trị context
  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
      changePassword,
      refreshUserInfo,
      updateUserProfile,
      deleteUserAccount,
      examId,
      setExamId,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
      changePassword,
      refreshUserInfo,
      updateUserProfile,
      deleteUserAccount,
      examId,
      setExamId,
    ]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
// hook sử dụng authcontext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
