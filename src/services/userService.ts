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
  learningStats: {
    totalAttempts: number;
    averageScore: number;
    topicStats: {
      learned: number;
      total: number;
    };
  };
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
  formData.append("profileImage", file);
  const response = await api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
// Cập nhật profile với ảnh đại diện
export const updateProfileWithImage = async (
  userData: UpdateUserData,
  file?: File
): Promise<User> => {
  const formData = new FormData();

  // Thêm các trường dữ liệu vào formData
  if (userData.name) formData.append("name", userData.name);
  if (userData.email) formData.append("email", userData.email);
  if (userData.class) formData.append("class", userData.class);

  // Thêm file ảnh nếu có
  if (file) {
    formData.append("profileImage", file);
  }
  console.log("formData: ", formData);
  try {
    const response = await api.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response service: ", response.data.user);
    return response.data.user;
  } catch (error) {
    console.error("Error in updateProfileWithImage:", error);
    throw error;
  }
};
