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
  Mail,
  Edit,
  Trash2,
  Key,
  BarChart2,
  X,
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
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      joinDate: "01/01/2025",
      role: "Học sinh",
      examsCompleted: 15,
      avgScore: 7.8,
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      joinDate: "20/01/2025",
      role: "Học sinh",
      examsCompleted: 10,
      avgScore: 6.5,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@gmail.com",
      joinDate: "05/02/2025",
      role: "Học sinh",
      examsCompleted: 8,
      avgScore: 8.0,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      joinDate: new Date().toLocaleDateString("vi-VN"),
      role: "Học sinh",
      examsCompleted: 0,
      avgScore: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    handleCancel();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
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
    alert(`Đã reset mật khẩu cho người dùng ID: ${selectedUserId}`);
  };

  // Lọc người dùng theo tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính tổng số người dùng
  const totalUsers = users.length;

  // Tính tổng số đề thi đã làm
  const totalExamsCompleted = users.reduce(
    (sum, user) => sum + (user.examsCompleted || 0),
    0
  );

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số học sinh</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng lượt làm bài</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalExamsCompleted}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm trung bình</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.length > 0
                    ? (
                        users.reduce(
                          (sum, user) => sum + (user.avgScore || 0),
                          0
                        ) / users.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </div>

          {/* Bảng danh sách người dùng */}
          <div className="bg-white shadow-sm rounded-xl mb-8 border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách Học sinh - Sinh viên
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
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
                      Hành động
                    </th>
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
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.examsCompleted}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.avgScore > 0
                            ? user.avgScore.toFixed(1)
                            : "Chưa có dữ liệu"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
                            </button>
                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="text-amber-600 hover:text-amber-800 flex items-center"
                            >
                              <Key className="h-4 w-4 mr-1" />
                              Reset MK
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
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

            {/* Biểu đồ phân bố điểm trung bình */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Phân bố điểm trung bình
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Dưới 5.0", value: 2 },
                        { name: "5.0 - 6.9", value: 5 },
                        { name: "7.0 - 8.9", value: 8 },
                        { name: "9.0 - 10", value: 3 },
                      ]}
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
                      {[0, 1, 2, 3].map((index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} học sinh`, name]}
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
                {formData.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
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
                  {formData.id ? "Cập nhật" : "Thêm người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận reset mật khẩu */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Xác nhận reset mật khẩu</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn reset mật khẩu cho người dùng này không?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmResetPassword}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
