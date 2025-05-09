"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
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

const AdminHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("month"); // "day", "week", "month"
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Cơ sở dữ liệu",
      topic: "Công nghệ thông tin",
      questions: 50,
      difficulty: "Trung bình",
      date: "01/01/2025",
      price: 50000,
    },
    {
      id: 2,
      name: "Cấu Trúc Dữ Liệu",
      topic: "Công nghệ thông tin",
      questions: 40,
      difficulty: "Khó",
      date: "15/02/2025",
      price: 45000,
    },
  ]);

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Danh mục quản lý</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Home className="mr-3 h-5 w-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-exams"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Đề thi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-users"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Người dùng</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-questions"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  <span>Câu hỏi</span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Cài đặt</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Đề thi</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số đề thi</p>
                <p className="text-2xl font-bold text-gray-800">{totalExams}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số câu hỏi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalQuestions}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalRevenue.toLocaleString()} VNĐ
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lượt làm bài</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalAttempts}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Người dùng</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                <div className="flex text-xs text-gray-500 mt-1">
                  <span className="mr-2">SV: {studentCount}</span>
                  <span>GV: {teacherCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng danh sách đề kiểm tra */}
          <div className="bg-white shadow-sm rounded-xl mb-8 border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách Đề thi
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="px-6 py-4 text-left font-medium">ID</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Tên Đề thi
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Chủ đề liên quan
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Số câu hỏi
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Mức độ</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                      <tr
                        key={exam.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-800">{exam.id}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {exam.name}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.topic}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.questions}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.difficulty}
                        </td>
                        <td className="px-6 py-4 text-gray-800">{exam.date}</td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.price.toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy đề thi nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Biểu đồ doanh thu */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Thống kê Doanh thu
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
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
                    />
                    <Legend />
                    <Bar
                      dataKey="Thống Kê Doanh Thu"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ lượt làm bài */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Thống kê Lượt làm bài
                </h2>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setTimeFilter("day")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      timeFilter === "day"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setTimeFilter("week")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      timeFilter === "week"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tuần
                  </button>
                  <button
                    onClick={() => setTimeFilter("month")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
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
                  <LineChart data={getAttemptsData()}>
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
                    <Line
                      type="monotone"
                      dataKey="Thống Kê Lượt Làm Bài"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: "#3b82f6",
                        strokeWidth: 2,
                        stroke: "white",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#3b82f6",
                        strokeWidth: 2,
                        stroke: "white",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
