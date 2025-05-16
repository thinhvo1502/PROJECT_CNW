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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Home,
  FileText,
  Users,
  Settings,
  DollarSign,
  BarChart2,
  Search,
  Calendar,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Award,
  BookOpen,
  PlusCircle,
  Filter,
  Download,
  Share2,
} from "lucide-react";

const revenueData = [
  { name: "Tháng 1", "Thống Kê Doanh Thu": 4000 },
  { name: "Tháng 2", "Thống Kê Doanh Thu": 3000 },
  { name: "Tháng 3", "Thống Kê Doanh Thu": 5000 },
  { name: "Tháng 4", "Thống Kê Doanh Thu": 7000 },
];

const dailyAttemptsData = [
  { name: "Thứ 2", "Thống Kê Lượt Làm Bài": 20 },
  { name: "Thứ 3", "Thống Kê Lượt Làm Bài": 25 },
  { name: "Thứ 4", "Thống Kê Lượt Làm Bài": 30 },
  { name: "Thứ 5", "Thống Kê Lượt Làm Bài": 35 },
  { name: "Thứ 6", "Thống Kê Lượt Làm Bài": 40 },
  { name: "Thứ 7", "Thống Kê Lượt Làm Bài": 15 },
  { name: "CN", "Thống Kê Lượt Làm Bài": 10 },
];

const weeklyAttemptsData = [
  { name: "Tuần 1", "Thống Kê Lượt Làm Bài": 75 },
  { name: "Tuần 2", "Thống Kê Lượt Làm Bài": 90 },
  { name: "Tuần 3", "Thống Kê Lượt Làm Bài": 110 },
  { name: "Tuần 4", "Thống Kê Lượt Làm Bài": 125 },
];

const monthlyAttemptsData = [
  { name: "Tháng 1", "Thống Kê Lượt Làm Bài": 120 },
  { name: "Tháng 2", "Thống Kê Lượt Làm Bài": 150 },
  { name: "Tháng 3", "Thống Kê Lượt Làm Bài": 200 },
  { name: "Tháng 4", "Thống Kê Lượt Làm Bài": 250 },
];

// Dữ liệu phân bố người dùng
const userDistributionData = [
  { name: "Học sinh", value: 220, color: "#3b82f6" },
  { name: "Giáo viên", value: 30, color: "#10b981" },
];

// Dữ liệu phân bố đề thi theo mức độ
const examDifficultyData = [
  { name: "Dễ", value: 15, color: "#10b981" },
  { name: "Trung bình", value: 25, color: "#3b82f6" },
  { name: "Khó", value: 10, color: "#f59e0b" },
];

const AdminHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("month"); // "day", "week", "month"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [chartHover, setChartHover] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Refs for scroll animations
  const tableRef = useRef(null);
  const chartsRef = useRef(null);
  const calendarRef = useRef(null);

  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Cơ sở dữ liệu",
      topic: "Công nghệ thông tin",
      questions: 50,
      difficulty: "Trung bình",
      date: "01/01/2025",
      price: 50000,
      completions: 120,
      avgScore: 7.5,
    },
    {
      id: 2,
      name: "Cấu Trúc Dữ Liệu",
      topic: "Công nghệ thông tin",
      questions: 40,
      difficulty: "Khó",
      date: "15/02/2025",
      price: 45000,
      completions: 85,
      avgScore: 6.8,
    },
    {
      id: 3,
      name: "Lập trình hướng đối tượng",
      topic: "Kỹ thuật lập trình",
      questions: 45,
      difficulty: "Dễ",
      date: "20/02/2025",
      price: 0,
      completions: 150,
      avgScore: 8.2,
    },
  ]);

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
              } else if (entry.target === calendarRef.current) {
                entry.target.classList.add("animate-fade-in-up");
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      if (tableRef.current) observer.observe(tableRef.current);
      if (chartsRef.current) observer.observe(chartsRef.current);
      if (calendarRef.current) observer.observe(calendarRef.current);

      return () => {
        if (tableRef.current) observer.unobserve(tableRef.current);
        if (chartsRef.current) observer.unobserve(chartsRef.current);
        if (calendarRef.current) observer.unobserve(calendarRef.current);
      };
    }
  }, [isLoading]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính tổng số đề thi và tổng số câu hỏi
  const totalExams = exams.length;
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.questions, 0);

  // Tính tổng doanh thu
  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + item["Thống Kê Doanh Thu"],
    0
  );

  // Chọn dữ liệu thống kê lượt làm bài dựa trên bộ lọc thời gian
  const getAttemptsData = () => {
    switch (timeFilter) {
      case "day":
        return dailyAttemptsData;
      case "week":
        return weeklyAttemptsData;
      case "month":
      default:
        return monthlyAttemptsData;
    }
  };

  // Tính tổng lượt làm bài dựa trên bộ lọc thời gian
  const totalAttempts = getAttemptsData().reduce(
    (sum, item) => sum + item["Thống Kê Lượt Làm Bài"],
    0
  );

  // Số lượng người dùng
  const totalUsers = 250;
  const studentCount = 220;
  const teacherCount = 30;

  // Tính tổng lượt làm bài từ tất cả các đề thi
  const totalCompletions = exams.reduce(
    (sum, exam) => sum + exam.completions,
    0
  );

  // Tính điểm trung bình của tất cả các đề thi
  const averageScore =
    exams.reduce((sum, exam) => sum + exam.avgScore, 0) / exams.length;

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
                  to="/"
                  className="flex items-center rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20"
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
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
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
                Tổng quan hệ thống
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
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

              <div className="relative hidden md:block">
                <button className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200">
                  <span className="font-medium">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
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
                  <FileText className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng số đề thi</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalExams}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +2
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-medium text-green-600">+15%</span> so
                    với tháng trước
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-1000"
                  style={{ width: animateStats ? "33%" : "0%" }}
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
                  <BookOpen className="h-7 w-7 text-green-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng số câu hỏi</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalQuestions}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +15
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-medium text-green-600">+8%</span> so
                    với tháng trước
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-green-500 transition-all duration-1000"
                  style={{ width: animateStats ? "66%" : "0%" }}
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
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <DollarSign className="h-7 w-7 text-purple-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalRevenue.toLocaleString()}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +12%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-medium text-green-600">+2.5M</span> so
                    với tháng trước
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-purple-500 transition-all duration-1000"
                  style={{ width: animateStats ? "75%" : "0%" }}
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
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Users className="h-7 w-7 text-amber-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Người dùng</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalUsers}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +18
                    </p>
                  </div>
                  <div className="mt-1 flex text-xs text-gray-500">
                    <span className="mr-2">SV: {studentCount}</span>
                    <span>GV: {teacherCount}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-amber-500 transition-all duration-1000"
                  style={{ width: animateStats ? "80%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>
          {/* Biểu đồ */}
          <div
            ref={chartsRef}
            className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2 opacity-0"
          >
            {/* Biểu đồ doanh thu */}
            <div
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setChartHover("revenue")}
              onMouseLeave={() => setChartHover(null)}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Thống kê Doanh thu
                </h2>
                <div
                  className={`flex items-center text-blue-600 transition-opacity duration-300 ${
                    chartHover === "revenue" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button className="flex items-center text-sm font-medium">
                    <Download className="mr-1 h-4 w-4" />
                    Tải xuống
                  </button>
                  <button className="ml-3 flex items-center text-sm font-medium">
                    <Share2 className="mr-1 h-4 w-4" />
                    Chia sẻ
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
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
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toLocaleString()} VNĐ`,
                        "Doanh Thu",
                      ]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Thống Kê Doanh Thu"
                      fill="url(#colorRevenue)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ lượt làm bài */}
            <div
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setChartHover("attempts")}
              onMouseLeave={() => setChartHover(null)}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Thống kê Lượt làm bài
                </h2>
                <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setTimeFilter("day")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      timeFilter === "day"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setTimeFilter("week")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      timeFilter === "week"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tuần
                  </button>
                  <button
                    onClick={() => setTimeFilter("month")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      timeFilter === "month"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tháng
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getAttemptsData()}>
                    <defs>
                      <linearGradient
                        id="colorAttempts"
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
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      formatter={(value) => [`${value} lượt`, "Lượt Làm Bài"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Thống Kê Lượt Làm Bài"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAttempts)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
          © 2025 Hệ thống quản lý đề thi. Bản quyền thuộc về Trường Đại học.
        </footer>
      </div>

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

export default AdminHome;
