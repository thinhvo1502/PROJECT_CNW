import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { LineChart, Line } from "recharts";

const revenueData = [
  { name: "Tháng 1", "Thống Kê Doanh Thu": 4000 },
  { name: "Tháng 2", "Thống Kê Doanh Thu": 3000 },
  { name: "Tháng 3", "Thống Kê Doanh Thu": 5000 },
  { name: "Tháng 4", "Thống Kê Doanh Thu": 7000 },
];

const attemptsData = [
  { name: "Tháng 1", "Thống Kê Lượt Làm Bài": 120 },
  { name: "Tháng 2", "Thống Kê Lượt Làm Bài": 150 },
  { name: "Tháng 3", "Thống Kê Lượt Làm Bài": 200 },
  { name: "Tháng 4", "Thống Kê Lượt Làm Bài": 250 },
];

const AdminHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Cơ sở dữ liệu",
      questions: 50,
      author: "4801104001",
      date: "01/01/2025",
    },
    {
      id: 2,
      name: "Cấu Trúc Dữ Liệu",
      questions: 40,
      author: "4801104129",
      date: "15/02/2025",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    questions: "",
    author: "",
  });

  const handleAddExam = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: "", questions: "", author: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExam = {
      id: Math.floor(Math.random() * 10000), // Tạo ID ngẫu nhiên
      name: formData.name,
      questions: Number(formData.questions), // Chuyển đổi sang số
      author: formData.author,
      date: new Date().toLocaleDateString("vi-VN"), // Ngày hiện tại
    };
    setExams((prev) => [...prev, newExam]); // Cập nhật danh sách
    handleCancel(); // Đóng form
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold mb-6">Quản lý Đề thi</h1>

      {/* Bảng danh sách đề kiểm tra */}
      <div className="bg-white shadow-md rounded mb-8">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Danh sách Đề thi</h2>
          <button
            onClick={handleAddExam}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm Đề thi
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tên Đề thi</th>
              <th className="p-3 text-left">Số câu hỏi</th>
              <th className="p-3 text-left">Tác giả</th>
              <th className="p-3 text-left">Ngày tạo</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b">
                <td className="p-3">{exam.id}</td>
                <td className="p-3">{exam.name}</td>
                <td className="p-3">{exam.questions}</td>
                <td className="p-3">{exam.author}</td>
                <td className="p-3">{exam.date}</td>
                <td className="p-3">
                  <button className="text-blue-500 hover:underline">Sửa</button>
                  <button className="text-red-500 hover:underline ml-4">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Thống kê Doanh thu</h2>
          <BarChart width={500} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} VNĐ`} />
            <Legend />
            <Bar dataKey="Thống Kê Doanh Thu" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Biểu đồ lượt làm bài */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Thống kê Lượt làm bài</h2>
          <LineChart width={500} height={300} data={attemptsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} lượt`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Thống Kê Lượt Làm Bài"
              stroke="#82ca9d"
            />
          </LineChart>
        </div>
      </div>

      {/* Form thêm đề thi */}
      {showForm && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-90 flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white p-6 rounded shadow-md w-96 transform scale-95 transition-transform duration-300">
            <h2 className="text-lg font-semibold mb-4">Thêm Đề thi</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tên Đề thi
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Số lượng câu hỏi
                </label>
                <input
                  type="number"
                  name="questions"
                  value={formData.questions}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tác giả
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Thêm Đề thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
