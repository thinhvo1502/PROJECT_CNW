"use client";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

const userActivityData = [
  { name: "Tháng 1", "Số lượt đăng nhập": 80, "Số đề thi đã làm": 30 },
  { name: "Tháng 2", "Số lượt đăng nhập": 100, "Số đề thi đã làm": 40 },
  { name: "Tháng 3", "Số lượt đăng nhập": 120, "Số đề thi đã làm": 55 },
  { name: "Tháng 4", "Số lượt đăng nhập": 150, "Số đề thi đã làm": 70 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

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

  // Refs for scroll animations
  const tableRef = useRef(null);
  const chartsRef = useRef(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      joinDate: "01/01/2025",
      role: "Học sinh",
      examsCompleted: 15,
      avgScore: 7.8,
      lastLogin: "15/04/2025",
      phone: "0912345678",
      address: "Hà Nội",
      status: "Hoạt động",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      joinDate: "10/01/2025",
      role: "Giáo viên",
      examsCompleted: 0,
      avgScore: 0,
      lastLogin: "14/04/2025",
      phone: "0923456789",
      address: "Hồ Chí Minh",
      status: "Hoạt động",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      joinDate: "20/01/2025",
      role: "Học sinh",
      examsCompleted: 10,
      avgScore: 6.5,
      lastLogin: "12/04/2025",
      phone: "0934567890",
      address: "Đà Nẵng",
      status: "Hoạt động",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@gmail.com",
      joinDate: "05/02/2025",
      role: "Học sinh",
      examsCompleted: 8,
      avgScore: 8.0,
      lastLogin: "10/04/2025",
      phone: "0945678901",
      address: "Cần Thơ",
      status: "Tạm khóa",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Học sinh",
    phone: "",
    address: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: formData.id || Math.floor(Math.random() * 10000),
      name: formData.name,
      email: formData.email,
      joinDate: new Date().toLocaleDateString("vi-VN"),
      role: formData.role,
      examsCompleted: 0,
      avgScore: 0,
      lastLogin: "-",
      phone: formData.phone || "-",
      address: formData.address || "-",
      status: "Hoạt động",
      avatar: "/placeholder.svg?height=40&width=40",
    };

    if (formData.id) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === formData.id ? { ...user, ...newUser } : user
        )
      );
      showNotificationMessage("Đã cập nhật người dùng thành công", "success");
    } else {
      // Add new user
      setUsers((prev) => [...prev, newUser]);
      showNotificationMessage("Đã thêm người dùng mới thành công", "success");
    }

    handleCancel();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const confirmDeleteUser = (id) => {
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = () => {
    setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
    setShowDeleteConfirm(false);
    showNotificationMessage("Đã xóa người dùng thành công", "success");
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setFormData({
        id: userToEdit.id,
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        phone: userToEdit.phone !== "-" ? userToEdit.phone : "",
        address: userToEdit.address !== "-" ? userToEdit.address : "",
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
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Tất cả" || user.role === selectedRole;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && user.status === "Hoạt động") ||
      (activeTab === "inactive" && user.status === "Tạm khóa");

    return matchesSearch && matchesRole && matchesTab;
  });

  // Tính tổng số người dùng
  const totalUsers = users.length;
  const studentCount = users.filter((user) => user.role === "Học sinh").length;
  const teacherCount = users.filter((user) => user.role === "Giáo viên").length;
  const activeUsers = users.filter(
    (user) => user.status === "Hoạt động"
  ).length;

  // Tính tổng số đề thi đã làm
  const totalExamsCompleted = users.reduce(
    (sum, user) => sum + (user.examsCompleted || 0),
    0
  );

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

              <button className="relative rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </button>

              <button
                onClick={handleAddUser}
                className="group flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <UserPlus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline">Thêm Người dùng</span>
                <span className="sm:hidden">Thêm</span>
              </button>
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
                      {studentCount}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +5%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tổng: {totalUsers} người dùng
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-1000"
                  style={{
                    width: animateStats
                      ? `${(studentCount / totalUsers) * 100}%`
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
            className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl opacity-0"
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
                      Ngày tham gia
                    </th>
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
                        key={user.id}
                        className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeIn 0.5s ease-in-out forwards",
                        }}
                      >
                        <td className="px-6 py-4 text-gray-800">{user.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                              <img
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-800">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.email}
                        </td>

                        <td className="px-6 py-4 text-gray-800">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.examsCompleted}
                        </td>
                        <td className="px-6 py-4">
                          {user.avgScore > 0 ? (
                            <span
                              className={`font-medium ${
                                user.avgScore >= 8
                                  ? "text-green-600"
                                  : user.avgScore >= 6.5
                                  ? "text-blue-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {user.avgScore.toFixed(1)}
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
                              user.status === "Hoạt động"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewUserDetails(user)}
                              className="group flex items-center rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                              <Eye className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                              Xem
                            </button>
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="group flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                            >
                              <Edit className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                              Sửa
                            </button>
                            <button
                              onClick={() => confirmDeleteUser(user.id)}
                              className="group flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                            >
                              <Trash2 className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                              Xóa
                            </button>
                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="group flex items-center rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-100"
                            >
                              <Key className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                              Cập nhật mật khẩu
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy người dùng nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-gray-500">
                  Hiển thị {filteredUsers.length} trên tổng số {users.length}{" "}
                  người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50">
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-blue-600 text-white transition-colors hover:bg-blue-700">
                    1
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50">
                    2
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Biểu đồ */}
          <div
            ref={chartsRef}
            className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2 opacity-0"
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

      {/* Confirm Delete Modal */}
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

      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center rounded-lg p-4 shadow-lg transition-all duration-300 ${
            notificationType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            {notificationType === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className="text-white">{notificationMessage}</p>
        </div>
      )}

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
