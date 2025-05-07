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
  Filter,
  Mail,
  Phone,
  Award,
  BookOpen,
  ChevronDown,
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
  const [userRole, setUserRole] = useState("Học sinh"); // Mặc định hiển thị học sinh
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      joinDate: "01/01/2025",
      role: "Học sinh",
      examsCompleted: 15,
      avgScore: 7.8,
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0912345678",
      joinDate: "15/01/2025",
      role: "Giáo viên",
      examsCreated: 5,
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      phone: "0923456789",
      joinDate: "20/01/2025",
      role: "Học sinh",
      examsCompleted: 10,
      avgScore: 6.5,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@gmail.com",
      phone: "0934567890",
      joinDate: "05/02/2025",
      role: "Học sinh",
      examsCompleted: 8,
      avgScore: 8.0,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@gmail.com",
      phone: "0945678901",
      joinDate: "10/02/2025",
      role: "Giáo viên",
      examsCreated: 8,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Học sinh",
  });

  const handleAddUser = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Học sinh",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      joinDate: new Date().toLocaleDateString("vi-VN"),
      role: formData.role,
      examsCompleted: formData.role === "Học sinh" ? 0 : undefined,
      examsCreated: formData.role === "Giáo viên" ? 0 : undefined,
      avgScore: formData.role === "Học sinh" ? 0 : undefined,
    };
    setUsers((prev) => [...prev, newUser]);
    handleCancel();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (role) => {
    setUserRole(role);
    setShowRoleFilter(false);
  };

  // Lọc người dùng theo vai trò và tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.role === userRole &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Dữ liệu cho biểu đồ tròn
  const usersByRole = users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = 0;
    }
    acc[user.role]++;
    return acc;
  }, {});

  const pieData = Object.keys(usersByRole).map((role) => ({
    name: role,
    value: usersByRole[role],
  }));

  // Tính tổng số người dùng
  const totalUsers = users.length;

  // Tính số lượng học sinh và giáo viên
  const studentCount = users.filter((user) => user.role === "Học sinh").length;
  const teacherCount = users.filter((user) => user.role === "Giáo viên").length;

  // Tính tổng số đề thi đã làm (học sinh) hoặc đã tạo (giáo viên)
  const totalExamsCompleted = users
    .filter((user) => user.role === "Học sinh")
    .reduce((sum, user) => sum + (user.examsCompleted || 0), 0);

  const totalExamsCreated = users
    .filter((user) => user.role === "Giáo viên")
    .reduce((sum, user) => sum + (user.examsCreated || 0), 0);

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
                  to="/admin/home"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
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
                  className="flex items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Người dùng</span>
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
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Người dùng
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm Người dùng
            </button>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số người dùng</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Số học sinh</p>
                <p className="text-2xl font-bold text-gray-800">
                  {studentCount}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Số giáo viên</p>
                <p className="text-2xl font-bold text-gray-800">
                  {teacherCount}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {userRole === "Học sinh"
                    ? "Tổng lượt làm bài"
                    : "Tổng đề thi đã tạo"}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {userRole === "Học sinh"
                    ? totalExamsCompleted
                    : totalExamsCreated}
                </p>
              </div>
            </div>
          </div>

          {/* Bảng danh sách người dùng */}
          <div className="bg-white shadow-sm rounded-xl mb-8 border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách {userRole}
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowRoleFilter(!showRoleFilter)}
                  className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {userRole}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {showRoleFilter && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleRoleFilter("Học sinh")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Học sinh
                      </button>
                      <button
                        onClick={() => handleRoleFilter("Giáo viên")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Giáo viên
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="px-6 py-4 text-left font-medium">ID</th>
                    <th className="px-6 py-4 text-left font-medium">Họ tên</th>
                    <th className="px-6 py-4 text-left font-medium">Email</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      {userRole === "Học sinh"
                        ? "Số đề thi đã làm"
                        : "Số đề thi đã tạo"}
                    </th>
                    {userRole === "Học sinh" && (
                      <th className="px-6 py-4 text-left font-medium">
                        Điểm trung bình
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-800">{user.id}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {userRole === "Học sinh"
                            ? user.examsCompleted
                            : user.examsCreated}
                        </td>
                        {userRole === "Học sinh" && (
                          <td className="px-6 py-4 text-gray-800">
                            {user.avgScore > 0
                              ? user.avgScore.toFixed(1)
                              : "Chưa có dữ liệu"}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={userRole === "Học sinh" ? 7 : 6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy người dùng nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Biểu đồ hoạt động người dùng */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Hoạt động người dùng
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
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
                    />
                    <Legend />
                    <Bar
                      dataKey="Số lượt đăng nhập"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                    <Bar
                      dataKey="Số đề thi đã làm"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ phân bố người dùng theo vai trò */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Phân bố người dùng theo vai trò
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} người dùng`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Form thêm người dùng */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform scale-100 transition-transform duration-300 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Thêm Người dùng mới
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="Học sinh">Học sinh</option>
                  <option value="Giáo viên">Giáo viên</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Thêm người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
