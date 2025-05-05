import { useState, useRef, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  AtSign,
  Lock,
  Edit2,
  Save,
  X,
  Camera,
  Award,
  Clock,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import React from "react";
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  birthDate: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
  totalQuizzes: number;
  averageScore: number;
  completedTopics: number;
  totalTopics: number;
}
// định nghĩa kiểu dữ liệu cho form đổi mật khẩu
interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const ProfilePage = () => {
  // Dữ liệu mẫu cho thông tin người dùng
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user123",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    username: "nguyenvana",
    phone: "0912345678",
    birthDate: "1995-05-15",
    avatar: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-01-15T08:30:00",
    lastLogin: "2023-05-20T14:45:00",
    totalQuizzes: 25,
    averageScore: 78.5,
    completedTopics: 6,
    totalTopics: 8,
  });
  // state cho chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  // state cho form chỉnh sửa
  const [editForm, setEditForm] = useState({ ...userProfile });
  // state cho form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // state cho hiển thị form đổi mật khẩu
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  // state cho thông báo
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });
  // ref cho input file avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  // xử lý khi nhấn nút chỉnh sửa
  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({ ...userProfile });
  };
  // xử lý khi nhấn nút hủy
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  // xử lý khi nhấn nút lưu
  const handleSaveProfile = () => {
    // Trong thực tế, bạn sẽ gửi dữ liệu lên server ở đây
    setUserProfile({ ...editForm });
    setIsEditing(false);
    showNotification("success", "Cập nhật thông tin thành công!");
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // xử lý khi thay đổi avatar
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Trong thực tế, bạn sẽ upload file lên server
      // Ở đây tôi chỉ tạo một URL tạm thời để hiển thị preview
      const imageUrl = URL.createObjectURL(file);
      setEditForm((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));
    }
  };
  // xử lý khi nhấn vào avatar để mở dialog chọn file
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // xử lý khi thay đổi trong form đổi mật khẩu
  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // xử lý khi nhấn nút đổi mật khẩu
  // Xử lý khi nhấn nút đổi mật khẩu
  const handleChangePassword = () => {
    console.log(2);
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification(
        "error",
        "Mật khẩu mới và xác nhận mật khẩu không khớp!"
      );
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (passwordForm.newPassword.length < 8) {
      showNotification("error", "Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    // Trong thực tế, bạn sẽ gửi yêu cầu đổi mật khẩu lên server ở đây
    // Reset form và hiển thị thông báo thành công
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
    showNotification("success", "Đổi mật khẩu thành công!");
  };
  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({
      show: true,
      type,
      message,
    });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };
  // Format ngày giờ
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  // format ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };
  // tính toán phần trăm hoàn thành hồ sơ
  const calculateProfileCompletion = () => {
    const fields = [
      userProfile.fullName,
      userProfile.email,
      userProfile.username,
      userProfile.phone,
      userProfile.birthDate,
      userProfile.avatar,
    ];
    const filledFields = fields.filter((field) => field && field !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };
  const profileCompletion = calculateProfileCompletion();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
        {/* Thông báo */}
        {notification.show && (
          <div
            className={`mb-6 p-4 rounded-md flex items-start ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : notification.type === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            ) : notification.type === "error" ? (
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p
                className={
                  notification.type === "success"
                    ? "text-green-800"
                    : notification.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
                }
              >
                {notification.message}
              </p>
            </div>
            <button
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột bên trái: thông tin tổng quan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* avatar và thông tin cơ bản */}
              <div className="p-6 flex flex-col items-center border-b">
                <div className="relative mb-4 group">
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md ${
                      isEditing ? "cursor-pointer" : ""
                    }`}
                    onClick={handleAvatarClick}
                  >
                    <img
                      src={isEditing ? editForm.avatar : userProfile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {userProfile.fullName}
                </h2>
                <p className="text-gray-600 b-4">{userProfile.username}</p>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>
              {/* Thống kê học tập */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Thống kê học tập</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Bài kiểm tra đã làm</span>
                    </div>
                    <span className="font-medium">
                      {userProfile.totalQuizzes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Award className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Điểm trung bình</span>
                    </div>
                    <span className="font-medium">
                      {userProfile.averageScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Chủ đề đã hoàn thành</span>
                    </div>
                    <span className="font-medium">
                      {userProfile.completedTopics}/{userProfile.totalTopics}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/statistics"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    Xem thống kê chi tiết
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              {/* Thông tin tài khoản */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin tài khoản
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Ngày tạo tài khoản
                      </p>
                      <p>{formatDateTime(userProfile.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Đăng nhập gần nhất
                      </p>
                      <p>{formatDateTime(userProfile.lastLogin)}</p>
                    </div>
                  </div>
                </div>
                {/* Mức độ hoàn thiện hồ sơ */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      Mức độ hoàn thiện hồ sơ
                    </p>
                    <p className="text-sm font-medium">{profileCompletion}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        profileCompletion >= 80
                          ? "bg-green-500"
                          : profileCompletion >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Cột bên trái - Thông tin chi tiết */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-row justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Thông tin cá nhân</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Lưu
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {/* Họ và tên */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{userProfile.fullName}</span>
                      </div>
                    )}
                  </div>
                  {/* username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tên đăng nhập
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={editForm.username}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AtSign className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{userProfile.username}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{userProfile.email}</span>
                    </div>
                  )}
                </div>
                {/* Số điện thoại và Ngày sinh */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{userProfile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={editForm.birthDate}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{formatDate(userProfile.birthDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Phần đổi mật khẩu */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Bảo mật tài khoản</h3>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-lue-700 transition-colors"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </button>
                )}
              </div>
              {showPasswordForm ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Mật khẩu phải có ít nhất 8 ký tự.
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-800 font-medium mb-1">
                        Bảo mật tài khoản
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Để bảo vệ tài khoản của bạn, chúng tôi khuyến nghị thay
                        đổi mật khẩu định kỳ và không chia sẻ mật khẩu với người
                        khác.
                      </p>
                      <div className="mt-2">
                        <Link
                          to="/profile/settings"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Xem thêm cài đặt bảo mật
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
