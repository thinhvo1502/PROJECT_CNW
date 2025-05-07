"use client";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Home,
  FileText,
  Users,
  Settings,
  PlusCircle,
  Search,
  Upload,
  FileUp,
  X,
  Edit,
  Trash2,
} from "lucide-react";

const attemptsData = [
  { name: "Tháng 1", "Thống Kê Lượt Làm Bài": 120 },
  { name: "Tháng 2", "Thống Kê Lượt Làm Bài": 150 },
  { name: "Tháng 3", "Thống Kê Lượt Làm Bài": 200 },
  { name: "Tháng 4", "Thống Kê Lượt Làm Bài": 250 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const ManageExams = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Cơ sở dữ liệu",
      topic: "Công nghệ thông tin",
      questions: 50,
      author: "4801104001",
      date: "01/01/2025",
      price: 50000,
      avgScore: 7.5,
    },
    {
      id: 2,
      name: "Cấu Trúc Dữ Liệu",
      topic: "Công nghệ thông tin",
      questions: 40,
      author: "4801104129",
      date: "15/02/2025",
      price: 45000,
      avgScore: 6.8,
    },
    {
      id: 3,
      name: "Lập trình hướng đối tượng",
      topic: "Lập trình",
      questions: 45,
      author: "4801104002",
      date: "20/02/2025",
      price: 0,
      avgScore: 8.2,
    },
    {
      id: 4,
      name: "Mạng máy tính",
      topic: "Mạng",
      questions: 60,
      author: "4801104003",
      date: "05/03/2025",
      price: 60000,
      avgScore: 7.0,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    questions: "",
    author: "",
    price: "0",
    isPaid: false,
    examContent: "",
    file: null,
  });

  const handleAddExam = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      topic: "",
      questions: "",
      author: "",
      price: "0",
      isPaid: false,
      examContent: "",
      file: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isPaid") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        price: checked ? prev.price : "0",
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
        fileName: e.target.files[0]?.name || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExam = {
      id: Math.floor(Math.random() * 10000),
      name: formData.name,
      topic: formData.topic,
      questions: Number(formData.questions),
      author: formData.author,
      date: new Date().toLocaleDateString("vi-VN"),
      price: formData.isPaid ? Number(formData.price) : 0,
      avgScore: 0,
    };
    setExams((prev) => [...prev, newExam]);
    handleCancel();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteExam = (id) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  const handleEditExam = (id) => {
    const examToEdit = exams.find((exam) => exam.id === id);
    if (examToEdit) {
      setFormData({
        name: examToEdit.name,
        topic: examToEdit.topic,
        questions: examToEdit.questions.toString(),
        author: examToEdit.author,
        price: examToEdit.price.toString(),
        isPaid: examToEdit.price > 0,
        examContent: "",
        file: null,
      });
      setShowForm(true);
    }
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dữ liệu cho biểu đồ tròn
  const examsByTopic = exams.reduce((acc, exam) => {
    if (!acc[exam.topic]) {
      acc[exam.topic] = 0;
    }
    acc[exam.topic]++;
    return acc;
  }, {});

  const pieData = Object.keys(examsByTopic).map((topic, index) => ({
    name: topic,
    value: examsByTopic[topic],
  }));

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
                  className="flex items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
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
                placeholder="Tìm kiếm đề thi..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={handleAddExam}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm Đề thi
            </button>
          </div>
        </header>

        <main className="p-6">
          {/* Bảng danh sách đề kiểm tra */}
          <div className="bg-white shadow-sm rounded-xl mb-8 border border-gray-100">
            <div className="p-6 border-b">
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
                    <th className="px-6 py-4 text-left font-medium">Tác giả</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Thành tiền
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
                          {exam.author}
                        </td>
                        <td className="px-6 py-4 text-gray-800">{exam.date}</td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.price > 0
                            ? `${exam.price.toLocaleString()} VNĐ`
                            : "Miễn phí"}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.avgScore > 0
                            ? exam.avgScore.toFixed(1)
                            : "Chưa có dữ liệu"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditExam(exam.id)}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteExam(exam.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
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
                        Không tìm thấy đề thi nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Biểu đồ lượt làm bài */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Thống kê Lượt làm bài
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attemptsData}>
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

            {/* Biểu đồ phân bố đề thi theo chủ đề */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Phân bố đề thi theo chủ đề
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
                      formatter={(value, name) => [`${value} đề thi`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Form thêm đề thi */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300 overflow-y-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl m-4 transform scale-100 transition-transform duration-300 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
              <h2 className="text-xl font-bold text-gray-800">
                Thêm Đề thi mới
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Đề thi
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập tên đề thi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập chủ đề"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng câu hỏi
                  </label>
                  <input
                    type="number"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập số lượng câu hỏi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập mã số tác giả"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="isPaid"
                      name="isPaid"
                      checked={formData.isPaid}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isPaid"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Đề thi có phí
                    </label>
                  </div>
                  {formData.isPaid && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá tiền (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập giá tiền"
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung đề thi
                  </label>
                  <textarea
                    name="examContent"
                    value={formData.examContent}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                    placeholder="Nhập nội dung đề thi hoặc tải file lên"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tải file đề thi
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click để tải file
                          </span>{" "}
                          hoặc kéo thả file vào đây
                        </p>
                        <p className="text-xs text-gray-500">
                          Hỗ trợ PDF, DOCX, TXT (Tối đa 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="file"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  {formData.fileName && (
                    <p className="mt-2 text-sm text-gray-600">
                      File đã chọn: {formData.fileName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Import đề thi
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm đề thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExams;
