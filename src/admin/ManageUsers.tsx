"use client";

import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import api from "../utils/api";
import { getCookie } from "../utils/cookies";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Home,
  FileText,
  Users,
  Settings,
  UserPlus,
  Search,
  Mail,
  Edit,
  Trash2,
  Key,
  BarChart2,
  X,
  Menu,
  Bell,
  User,
  AlertTriangle,
  ChevronDown,
  Eye,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
// Thêm vào đầu file, sau các import
const API_BASE_URL = "https://437f-113-161-89-176.ngrok-free.app";
const userActivityData = [
  { name: "Tháng 1", "Số lượt đăng nhập": 80, "Số đề thi đã làm": 30 },
  { name: "Tháng 2", "Số lượt đăng nhập": 100, "Số đề thi đã làm": 40 },
  { name: "Tháng 3", "Số lượt đăng nhập": 120, "Số đề thi đã làm": 55 },
  { name: "Tháng 4", "Số lượt đăng nhập": 150, "Số đề thi đã làm": 70 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const PAGE_SIZE = 10;
const ManageUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // success, error
  const [selectedRole, setSelectedRole] = useState("Tất cả");
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);
  const [chartHover, setChartHover] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingAction, setLoadingAction] = useState("");
  // Refs for scroll animations
  const tableRef = useRef(null);
  const chartsRef = useRef(null);
  const mapRoleToAPIValue = (displayRole) => {
    switch (displayRole) {
      case "Học sinh":
        return "user";
      case "Giáo viên":
        return "teacher";
      case "Quản trị viên":
        return "admin";
      default:
        return displayRole.toLowerCase(); // Fallback
    }
  };
  // Thêm hàm mapping hiển thị role
  const displayRoleLabel = (apiRole) => {
    switch (apiRole) {
      case "user":
        return "Học sinh";
      case "teacher":
        return "Giáo viên";
      case "admin":
        return "Quản trị viên";
      default:
        return apiRole;
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    phone: "",
    address: "",
    password: "", // Thêm trường password
    confirmPassword: "", // Thêm trường xác nhận mật khẩu
  });

  // Fetch users from API
  // Sửa lại hàm fetchUsers để hoạt động đúng
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      console.log("Bắt đầu tải dữ liệu người dùng...");

      // Kết hợp kiểm tra token từ cả localStorage và cookie
      const localToken = localStorage.getItem("auth_token");
      const cookieToken = getCookie("auth_token");
      const token = localToken || cookieToken;

      if (!token) {
        console.error(
          "Không tìm thấy token - chuyển hướng đến trang đăng nhập"
        );
        showNotificationMessage(
          "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          "error"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime();
      const apiUrl = `${API_BASE_URL}/api/users?_t=${timestamp}`;

      console.log("Gửi yêu cầu đến:", apiUrl);
      console.log("Sử dụng token:", token.substring(0, 10) + "...");

      // Gửi request API - LOẠI BỎ CÁC HEADER GÂY LỖI CORS
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("Nhận được phản hồi API:", response.status);
      console.log("Dữ liệu phản hồi:", response.data);

      // Xử lý response như trước đây
      if (Array.isArray(response.data)) {
        console.log(`Đã tải ${response.data.length} người dùng (dạng mảng)`);
        setUsers(response.data);
      } else if (response.data && typeof response.data === "object") {
        const userData = response.data.data || [];
        console.log(`Đã tải ${userData.length} người dùng (dạng đối tượng)`);
        setUsers(userData);
      } else {
        console.warn("Cấu trúc phản hồi không như mong đợi:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
      // Log và xử lý lỗi như trước
      setUsers([]);
      showNotificationMessage(`Lỗi tải dữ liệu: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };
  // Trong phần useEffect fetchUsers
  useEffect(() => {
    fetchUsers(); // Đảm bảo gọi hàm này
  }, []);
  // Đặt đoạn code này sau phần khai báo statistics với useMemo

  // Các biến tính toán từ state nên đặt bên ngoài useEffect
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Trigger stats animation after loading
      setTimeout(() => {
        setAnimateStats(true);
      }, 300);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target === tableRef.current) {
                entry.target.classList.add("animate-fade-in-up");
              } else if (entry.target === chartsRef.current) {
                entry.target.classList.add("animate-fade-in-up");
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      if (tableRef.current) observer.observe(tableRef.current);
      if (chartsRef.current) observer.observe(chartsRef.current);

      return () => {
        if (tableRef.current) observer.unobserve(tableRef.current);
        if (chartsRef.current) observer.unobserve(chartsRef.current);
      };
    }
  }, [isLoading]);

  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      role: "Học sinh",
      phone: "",
      address: "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (formData.password && formData.password !== formData.confirmPassword) {
      showNotificationMessage(
        "Mật khẩu và xác nhận mật khẩu không khớp",
        "error"
      );
      return;
    }

    setIsLoading(true);
    setLoadingAction("update");

    try {
      if (formData.id) {
        // Tìm thông tin user hiện tại
        const currentUser = users.find(
          (user) => user.id === formData.id || user._id === formData.id
        );

        if (!currentUser) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }

        // Chuẩn bị dữ liệu cập nhật (KHÔNG BAO GỒM PASSWORD)
        const updatedUserData = {
          name: formData.name || currentUser.name,
          email: formData.email || currentUser.email,
          role: mapRoleToAPIValue(formData.role) || currentUser.role,
          // Chỉ gửi các trường không rỗng hoặc undefined
          ...(formData.phone && formData.phone.trim() !== ""
            ? { phone: formData.phone }
            : {}),
          ...(formData.address && formData.address.trim() !== ""
            ? { address: formData.address }
            : {}),
        };

        // QUAN TRỌNG: KHÔNG thêm password vào updatedUserData

        // Log dữ liệu để kiểm tra trước khi gửi
        console.log(
          "Dữ liệu gửi đi (đã định dạng):",
          JSON.stringify(updatedUserData, null, 2)
        );

        // API request cho thông tin người dùng
        const apiUrl = `${API_BASE_URL}/api/users/${formData.id}`;
        console.log("Gửi yêu cầu PUT đến:", apiUrl);
        console.log("Dữ liệu cập nhật:", updatedUserData);

        const response = await axios.put(apiUrl, updatedUserData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API update response:", response.data);

        // Nếu người dùng đã nhập password mới, gửi riêng yêu cầu cập nhật mật khẩu
        if (formData.password && formData.password.trim() !== "") {
          try {
            // Có thể cần URL endpoint riêng cho việc cập nhật mật khẩu
            const passwordUpdateUrl = `${API_BASE_URL}/api/users/${formData.id}/change-password`;

            await axios.post(
              passwordUpdateUrl,
              { password: formData.password },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                  "Content-Type": "application/json",
                },
              }
            );

            showNotificationMessage(
              "Đã cập nhật mật khẩu thành công",
              "success"
            );
          } catch (passwordError) {
            console.error("Error updating password:", passwordError);
            showNotificationMessage(
              `Cập nhật thông tin thành công nhưng không thể cập nhật mật khẩu: ${
                passwordError.response?.data?.message || passwordError.message
              }`,
              "error"
            );
          }
        }

        // Cập nhật UI sau khi thành công
        setUsers((prev) =>
          prev.map((user) =>
            user.id === formData.id || user._id === formData.id
              ? {
                  ...user,
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone || "-",
                  address: formData.address || "-",
                  role: formData.role,
                }
              : user
          )
        );
        // Tự động làm mới dữ liệu sau khi cập nhật
        await fetchUsers();
        // Đóng form
        handleCancel();
        // Hiển thị thông báo thành công
        showNotificationMessage(
          "Đã cập nhật thông tin người dùng thành công",
          "success"
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);

      // Log chi tiết hơn về lỗi
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        // Hiển thị chi tiết lỗi xác thực nếu có
        if (error.response.data && error.response.data.errors) {
          console.error("Validation errors:", error.response.data.errors);

          // Log mỗi lỗi riêng lẻ để dễ đọc
          error.response.data.errors.forEach((err, index) => {
            if (typeof err === "object") {
              console.error(
                `Lỗi ${index + 1}:`,
                err.field || "",
                err.message || ""
              );
            } else {
              console.error(`Lỗi ${index + 1}:`, err);
            }
          });

          // Tạo thông báo lỗi từ mảng lỗi
          const errorMessages = error.response.data.errors
            .map((err) => {
              if (typeof err === "object") {
                return `${err.field || ""}: ${err.message || ""}`;
              }
              return err;
            })
            .join("; ");

          showNotificationMessage(`Lỗi xác thực: ${errorMessages}`, "error");
        } else {
          showNotificationMessage(
            `Lỗi khi cập nhật: ${
              error.response.data.message ||
              error.response.data ||
              error.message
            }`,
            "error"
          );
        }
      } else {
        showNotificationMessage(`Lỗi khi cập nhật: ${error.message}`, "error");
      }
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const confirmDeleteUser = (id) => {
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    setLoadingAction("delete");
    try {
      // Sử dụng URL API dựa trên ID người dùng cần xóa
      const apiUrl = `${API_BASE_URL}/api/users/${userToDelete}`;
      console.log("Gửi yêu cầu DELETE đến:", apiUrl);

      // Sử dụng custom URL thay vì api.delete
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      // Tự động làm mới dữ liệu sau khi xóa
      await fetchUsers();
      setShowDeleteConfirm(false);
      // Cập nhật UI bằng cách loại bỏ người dùng đã xóa
      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== userToDelete && user._id !== userToDelete
        )
      );

      // Hiển thị thông báo thành công
      showNotificationMessage("Đã xóa người dùng thành công", "success");
    } catch (error) {
      console.error("Error deleting user:", error);

      // Log chi tiết hơn về lỗi
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        showNotificationMessage(
          `Lỗi khi xóa: ${
            error.response.data.message || error.response.data || error.message
          }`,
          "error"
        );
      } else {
        showNotificationMessage(`Lỗi khi xóa: ${error.message}`, "error");
      }
    } finally {
      setIsLoading(false);
      setLoadingAction("");
      setShowDeleteConfirm(false);
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id || user._id === id);
    if (userToEdit) {
      setFormData({
        id: userToEdit._id || userToEdit.id,
        name: userToEdit.name,
        email: userToEdit.email,
        role: displayRoleLabel(userToEdit.role), // Chuyển đổi role từ API sang hiển thị
        phone: userToEdit.phone !== "-" ? userToEdit.phone : "",
        address: userToEdit.address !== "-" ? userToEdit.address : "",
        password: "",
        confirmPassword: "",
      });
      setShowForm(true);
    }
  };

  const handleResetPassword = (id) => {
    setSelectedUserId(id);
    setShowResetPasswordModal(true);
  };

  const confirmResetPassword = () => {
    // Xử lý reset mật khẩu ở đây
    setShowResetPasswordModal(false);
    setSelectedUserId(null);
    showNotificationMessage(
      `Đã reset mật khẩu cho người dùng ID: ${selectedUserId}`,
      "success"
    );
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setShowRoleFilter(false);
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Lọc người dùng theo tìm kiếm, vai trò và tab
  // Lọc người dùng theo tìm kiếm, vai trò và tab
  const filteredUsers = useMemo(() => {
    return paginatedUsers.filter((user) => {
      const searchId = String(user.id || user._id || "").toLowerCase();
      const matchesSearch =
        searchId.includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        selectedRole === "Tất cả" || user.role === selectedRole;
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && user.isActive) ||
        (activeTab === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesTab;
    });
  }, [paginatedUsers, searchTerm, selectedRole, activeTab]);

  // Tính tổng số người dùng
  const totalUsers = users.length;
  const studentCount = users.filter(
    (user) => user.role === "user" || user.role === "Học sinh"
  ).length;
  const teacherCount = users.filter(
    (user) => user.role === "teacher" || user.role === "Giáo viên"
  ).length;
  const activeUsers = users.filter((user) => user.isActive === true).length;

  // Tính tổng số đề thi đã làm
  const totalExamsCompleted = users.reduce(
    (sum, user) => sum + (user.examsCompleted || 0),
    0
  );
  const statistics = useMemo(() => {
    // Tính tổng số người dùng
    const totalUsers = users.length;

    const studentCount = users.filter(
      (user) => user.role === "user" || user.role === "Học sinh"
    ).length;

    const teacherCount = users.filter(
      (user) => user.role === "teacher" || user.role === "Giáo viên"
    ).length;

    const activeUsers = users.filter((user) => user.isActive === true).length;

    // Tính phần trăm
    const studentPercentage =
      totalUsers > 0 ? Math.round((studentCount / totalUsers) * 100) : 0;
    const activePercentage =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    // Tính tổng số đề thi đã làm
    const totalExamsCompleted = users.reduce(
      (sum, user) => sum + (user.learningStats?.totalAttempts || 0),
      0
    );

    // Tính điểm trung bình
    const usersWithScores = users.filter(
      (user) => user.learningStats?.averageScore > 0
    );
    const averageScore =
      usersWithScores.length > 0
        ? (
            users.reduce(
              (sum, user) => sum + (user.learningStats?.averageScore || 0),
              0
            ) / usersWithScores.length
          ).toFixed(1)
        : "0.0";

    return {
      totalUsers,
      studentCount,
      teacherCount,
      activeUsers,
      totalExamsCompleted,
      averageScore,
      studentPercentage,
      activePercentage,
    };
  }, [users]); // Chỉ tính lại khi users thay đổi
  // Dữ liệu cho biểu đồ tròn phân bố điểm
  const scoreDistribution = [
    {
      name: "Dưới 5.0",
      value: users.filter((user) => user.avgScore > 0 && user.avgScore < 5)
        .length,
    },
    {
      name: "5.0 - 6.9",
      value: users.filter((user) => user.avgScore >= 5 && user.avgScore < 7)
        .length,
    },
    {
      name: "7.0 - 8.9",
      value: users.filter((user) => user.avgScore >= 7 && user.avgScore < 9)
        .length,
    },
    {
      name: "9.0 - 10",
      value: users.filter((user) => user.avgScore >= 9 && user.avgScore <= 10)
        .length,
    },
  ];

  // Dữ liệu cho biểu đồ đường tăng trưởng người dùng
  const userGrowthData = [
    { name: "T1", "Người dùng mới": 10, "Tổng người dùng": 10 },
    { name: "T2", "Người dùng mới": 15, "Tổng người dùng": 25 },
    { name: "T3", "Người dùng mới": 20, "Tổng người dùng": 45 },
    { name: "T4", "Người dùng mới": 25, "Tổng người dùng": 70 },
    { name: "T5", "Người dùng mới": 30, "Tổng người dùng": 100 },
    { name: "T6", "Người dùng mới": 35, "Tổng người dùng": 135 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-blue-600">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Quản trị hệ thống</h1>
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 flex items-center space-x-3 rounded-lg bg-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-700">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-sm text-white/70">Quản trị viên</p>
            </div>
          </div>

          <nav className="mt-8 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              Quản lý
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/admin/home"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <Home className="mr-3 h-5 w-5" />
                  <span>Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-exams"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Đề thi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-users"
                  className="flex items-center rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20"
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Người dùng</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-questions"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  <span>Câu hỏi</span>
                </Link>
              </li>
            </ul>

            <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-white/50">
              Hệ thống
            </p>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="#"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Cài đặt</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="mt-auto rounded-lg bg-white/10 p-4">
            <p className="text-sm font-medium">Cần trợ giúp?</p>
            <p className="mt-1 text-xs text-white/70">
              Liên hệ bộ phận hỗ trợ kỹ thuật
            </p>
            <button className="mt-3 w-full rounded-lg bg-white py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-white/80 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                Quản lý Người dùng
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Users className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng số học sinh</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {statistics.studentCount}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      {`${statistics.studentPercentage}%`}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tổng: {statistics.totalUsers} người dùng
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-1000"
                  style={{
                    width: animateStats
                      ? `${statistics.studentPercentage}%`
                      : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <FileText className="h-7 w-7 text-green-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng lượt làm bài</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalExamsCompleted}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +12%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Trung bình:{" "}
                    {(totalExamsCompleted / studentCount).toFixed(1)} lượt/học
                    sinh
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-green-500 transition-all duration-1000"
                  style={{ width: animateStats ? "65%" : "0%" }}
                ></div>
              </div>
            </div>

            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <BarChart className="h-7 w-7 text-amber-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Điểm trung bình</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {users.length > 0
                        ? (
                            users.reduce(
                              (sum, user) => sum + (user.avgScore || 0),
                              0
                            ) / users.filter((user) => user.avgScore > 0).length
                          ).toFixed(1)
                        : "0.0"}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +0.5
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Thang điểm: 10.0</p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-amber-500 transition-all duration-1000"
                  style={{ width: animateStats ? "78%" : "0%" }}
                ></div>
              </div>
            </div>

            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <CheckCircle className="h-7 w-7 text-purple-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Người dùng hoạt động</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {activeUsers}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +8%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {((activeUsers / totalUsers) * 100).toFixed(0)}% tổng người
                    dùng
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-purple-500 transition-all duration-1000"
                  style={{
                    width: animateStats
                      ? `${(activeUsers / totalUsers) * 100}%`
                      : "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bảng danh sách người dùng */}
          <div
            ref={tableRef}
            className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách Người dùng
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-sm text-gray-600">
                    <th className="px-6 py-4 text-left font-medium">ID</th>
                    <th className="px-6 py-4 text-left font-medium">Họ tên</th>
                    <th className="px-6 py-4 text-left font-medium">Email</th>

                    <th className="px-6 py-4 text-left font-medium">
                      Số đề thi đã làm
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Điểm trung bình
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.id || user._id}
                        className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeIn 0.5s ease-in-out forwards",
                        }}
                      >
                        <td className="px-6 py-4 text-gray-800">
                          {user.id || user._id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                              <img
                                src={
                                  user.profileImage?.url || "/placeholder.svg"
                                }
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-800">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.phone || ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.email}
                        </td>

                        <td className="px-6 py-4 text-gray-800">
                          {user.learningStats?.totalAttempts ?? 0}
                        </td>
                        <td className="px-6 py-4">
                          {user.learningStats?.averageScore > 0 ? (
                            <span
                              className={`font-medium ${
                                user.learningStats.averageScore >= 8
                                  ? "text-green-600"
                                  : user.learningStats.averageScore >= 6.5
                                  ? "text-blue-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {user.learningStats.averageScore.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Chưa có dữ liệu
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Hoạt động" : "Tạm khóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                              onClick={() => handleViewUserDetails(user)}
                              title="Xem"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Xem</span>
                            </button>
                            <button
                              className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                              onClick={() =>
                                handleEditUser(user.id || user._id)
                              }
                              title="Sửa thông tin và mật khẩu"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Sửa</span>
                            </button>
                            <button
                              className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                              onClick={() =>
                                confirmDeleteUser(user.id || user._id)
                              }
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Xóa</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy người dùng nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-gray-500">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    &lt;&lt;
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    &lt;
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`flex h-8 w-8 items-center justify-center rounded-md border px-2 text-sm font-medium transition-all ${
                        currentPage === i + 1
                          ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    &gt;
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Biểu đồ */}
          <div
            ref={chartsRef}
            className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2 "
          >
            {/* Biểu đồ hoạt động người dùng */}
            <div
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setChartHover("activity")}
              onMouseLeave={() => setChartHover(null)}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Hoạt động người dùng
                </h2>
                <div
                  className={`flex items-center text-blue-600 transition-opacity duration-300 ${
                    chartHover === "activity" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-sm font-medium">Xem chi tiết</span>
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
                    <defs>
                      <linearGradient
                        id="colorLogin"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorExams"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Số lượt đăng nhập"
                      fill="url(#colorLogin)"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="Số đề thi đã làm"
                      fill="url(#colorExams)"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ phân bố điểm trung bình */}
            <div
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setChartHover("scores")}
              onMouseLeave={() => setChartHover(null)}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Phân bố điểm trung bình
                </h2>
                <div
                  className={`flex items-center text-blue-600 transition-opacity duration-300 ${
                    chartHover === "scores" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-sm font-medium">Xem chi tiết</span>
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={1500}
                      animationBegin={300}
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} học sinh`, name]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
          © 2025 Hệ thống quản lý đề thi. Bản quyền thuộc về Trường Đại học.
        </footer>
      </div>

      {/* Form thêm người dùng */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="m-4 w-full max-w-md animate-fade-in rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h2>
              <button
                onClick={handleCancel}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Nhập số điện thoại (không bắt buộc)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Nhập địa chỉ (không bắt buộc)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="Học sinh">Học sinh</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới {formData.id ? "(không bắt buộc)" : "(bắt buộc)"}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder={
                      formData.id
                        ? "Để trống nếu không đổi mật khẩu"
                        : "Nhập mật khẩu"
                    }
                    required={!formData.id}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu{" "}
                  {formData.id ? "(không bắt buộc)" : "(bắt buộc)"}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Xác nhận mật khẩu"
                    required={!formData.id || formData.password.length > 0}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {formData.id ? "Cập nhật" : "Thêm người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Xác nhận xóa người dùng */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md animate-fade-in rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
              Xác nhận xóa người dùng
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn xóa người dùng này không? Hành động này
              không thể hoàn tác.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chi tiết người dùng */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-3xl animate-fade-in rounded-2xl bg-white p-0 shadow-2xl">
            <div className="relative h-40 rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-800">
              <button
                onClick={() => setShowUserDetails(false)}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute -bottom-16 left-8 h-32 w-32 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
                <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
                  <User className="h-16 w-16" />
                </div>
              </div>
            </div>

            <div className="mt-20 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedUser.name}
                  </h2>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(selectedUser.id)}
                    className="flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <Edit className="mr-1.5 h-4 w-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDetails(false);
                      handleResetPassword(selectedUser.id);
                    }}
                    className="flex items-center rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-100"
                  >
                    <Key className="mr-1.5 h-4 w-4" />
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-medium uppercase text-gray-500">
                      Thông tin cá nhân
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Địa chỉ</p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-medium uppercase text-gray-500">
                      Thông tin tài khoản
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Ngày tham gia</p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Đăng nhập gần nhất
                          </p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.lastLogin}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-medium uppercase text-gray-500">
                      Thống kê học tập
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Số đề thi đã làm
                          </p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.examsCompleted}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BarChart className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Điểm trung bình
                          </p>
                          <p
                            className={`font-medium ${
                              selectedUser.avgScore >= 8
                                ? "text-green-600"
                                : selectedUser.avgScore >= 6.5
                                ? "text-blue-600"
                                : selectedUser.avgScore > 0
                                ? "text-orange-600"
                                : "text-gray-400"
                            }`}
                          >
                            {selectedUser.avgScore > 0
                              ? selectedUser.avgScore.toFixed(1)
                              : "Chưa có dữ liệu"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phản hồi</p>
                          <p className="font-medium text-gray-800">
                            0 phản hồi
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-medium uppercase text-gray-500">
                      Trạng thái tài khoản
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`mr-3 h-3 w-3 rounded-full ${
                            selectedUser.status === "Hoạt động"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <p className="font-medium text-gray-800">
                          {selectedUser.status}
                        </p>
                      </div>
                      <button
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                          selectedUser.status === "Hoạt động"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {selectedUser.status === "Hoạt động"
                          ? "Khóa tài khoản"
                          : "Mở khóa"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-blue-50 p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800">
                          Gửi tin nhắn
                        </h3>
                        <p className="mt-1 text-sm text-blue-600">
                          Gửi email hoặc thông báo trực tiếp đến người dùng này
                        </p>
                        <button className="mt-3 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                          Gửi tin nhắn
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t pt-6">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="rounded-lg bg-gray-100 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận reset mật khẩu */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md animate-fade-in rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Key className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
              Xác nhận reset mật khẩu
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn reset mật khẩu cho người dùng này không? Mật
              khẩu mới sẽ được gửi qua email.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmResetPassword}
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center rounded-lg p-4 shadow-xl transition-all duration-500 animate-slide-up ${
            notificationType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white animate-pulse">
            {notificationType === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className="text-white">{notificationMessage}</p>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-4 text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Thêm hiệu ứng mới vào CSS */}
      <style>
        {`
    /* ... các animation hiện có ... */
    
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-up {
      animation: slide-up 0.5s ease-out forwards;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .animate-pulse {
      animation: pulse 1.5s infinite;
    }
  `}
      </style>
    </div>
  );
};

export default ManageUsers;
