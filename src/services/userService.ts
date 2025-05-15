import api from "../utils/api";

// Định nghĩa kiểu dữ liệu cho User
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  class?: string;
  role: "student" | "admin";
  isActive: boolean;
  purchasedExams: string[];
}

// Định nghĩa kiểu dữ liệu cho cập nhật User
export interface UpdateUserData {
  name?: string;
  email?: string;
  class?: string;
  profileImage?: string;
}

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  userId: string,
  userData: UpdateUserData
): Promise<User> => {
  console.log("userService: ", userData);
  const response = await api.put(`/auth/profile`, userData);
  console.log("reponse service: ", response.data);
  return response.data.user;
};

// Xóa người dùng (chỉ admin)
export const deleteUser = async (
  userId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Tải lên ảnh đại diện
export const uploadProfileImage = async (
  file: File
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
