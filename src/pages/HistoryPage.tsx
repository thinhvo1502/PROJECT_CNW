import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
} from "lucide-react";
import React from "react";
interface QuizHistoryItem {
  id: number;
  quizId: number;
  quizName: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeTaken: number;
  dateTime: string;
  topic: string;
}
interface QuizHistoryStats {
  totalQuizzes: number;
  highScoreQuizzes: number;
  lowScoreQuizzes: number;
  averageScore: number;
}
const HistoryPage = () => {
  // state cho từ khóa tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");
  // state cho trang hiện tại
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  // Dữ liệu mẫu cho lịch sử làm bài
  const [historyData, setHistoryData] = useState<QuizHistoryItem[]>([
    {
      id: 1,
      quizId: 1,
      quizName: "Kiến thức cơ bản về mạng LAN",
      correctAnswers: 8,
      totalQuestions: 10,
      score: 80,
      timeTaken: 1230, // 20 phút 30 giây
      dateTime: "2023-05-15T14:30:00",
      topic: "Mạng máy tính",
    },
    {
      id: 2,
      quizId: 2,
      quizName: "Giao thức TCP/IP và mô hình OSI",
      correctAnswers: 12,
      totalQuestions: 15,
      score: 80,
      timeTaken: 2100, // 35 phút
      dateTime: "2023-05-14T10:15:00",
      topic: "Mạng máy tính",
    },
    {
      id: 3,
      quizId: 3,
      quizName: "Cấu trúc dữ liệu cây và đồ thị",
      correctAnswers: 15,
      totalQuestions: 20,
      score: 75,
      timeTaken: 2700, // 45 phút
      dateTime: "2023-05-12T16:45:00",
      topic: "Cấu trúc dữ liệu",
    },
    {
      id: 4,
      quizId: 4,
      quizName: "Lập trình hướng đối tượng với Java",
      correctAnswers: 18,
      totalQuestions: 25,
      score: 72,
      timeTaken: 3000, // 50 phút
      dateTime: "2023-05-10T09:30:00",
      topic: "Lập trình hướng đối tượng",
    },
    {
      id: 5,
      quizId: 5,
      quizName: "Cơ sở dữ liệu quan hệ và SQL",
      correctAnswers: 22,
      totalQuestions: 30,
      score: 73.33,
      timeTaken: 3600, // 60 phút
      dateTime: "2023-05-08T13:20:00",
      topic: "Cơ sở dữ liệu",
    },
    {
      id: 6,
      quizId: 6,
      quizName: "Bảo mật và mã hóa thông tin",
      correctAnswers: 12,
      totalQuestions: 35,
      score: 34.29,
      timeTaken: 3900, // 65 phút
      dateTime: "2023-05-05T15:10:00",
      topic: "An toàn thông tin",
    },
    {
      id: 7,
      quizId: 7,
      quizName: "Hệ điều hành Linux cơ bản",
      correctAnswers: 17,
      totalQuestions: 20,
      score: 85,
      timeTaken: 1800, // 30 phút
      dateTime: "2023-05-03T11:45:00",
      topic: "Hệ điều hành",
    },
    {
      id: 8,
      quizId: 8,
      quizName: "Quản lý tiến trình trong hệ điều hành",
      correctAnswers: 10,
      totalQuestions: 25,
      score: 40,
      timeTaken: 2400, // 40 phút
      dateTime: "2023-05-01T14:00:00",
      topic: "Hệ điều hành",
    },
    {
      id: 9,
      quizId: 1,
      quizName: "Kiến thức cơ bản về mạng LAN",
      correctAnswers: 9,
      totalQuestions: 10,
      score: 90,
      timeTaken: 1050, // 17 phút 30 giây
      dateTime: "2023-04-28T09:15:00",
      topic: "Mạng máy tính",
    },
    {
      id: 10,
      quizId: 2,
      quizName: "Giao thức TCP/IP và mô hình OSI",
      correctAnswers: 7,
      totalQuestions: 15,
      score: 46.67,
      timeTaken: 1800, // 30 phút
      dateTime: "2023-04-25T16:30:00",
      topic: "Mạng máy tính",
    },
    {
      id: 11,
      quizId: 3,
      quizName: "Cấu trúc dữ liệu cây và đồ thị",
      correctAnswers: 18,
      totalQuestions: 20,
      score: 90,
      timeTaken: 2400, // 40 phút
      dateTime: "2023-04-22T10:45:00",
      topic: "Cấu trúc dữ liệu",
    },
    {
      id: 12,
      quizId: 4,
      quizName: "Lập trình hướng đối tượng với Java",
      correctAnswers: 20,
      totalQuestions: 25,
      score: 80,
      timeTaken: 2700, // 45 phút
      dateTime: "2023-04-20T13:20:00",
      topic: "Lập trình hướng đối tượng",
    },
  ]);
  // tính toán thống kê
  const calculateStats = (): QuizHistoryStats => {
    const totalQuizzes = historyData.length;
    const totalScore = historyData.reduce((sum, item) => sum + item.score, 0);
    const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
    const highScoreQuizzes = historyData.filter(
      (item) => item.score >= 80
    ).length;
    const lowScoreQuizzes = historyData.filter(
      (item) => item.score < 50
    ).length;
    return {
      totalQuizzes,
      highScoreQuizzes,
      lowScoreQuizzes,
      averageScore: parseFloat(averageScore.toFixed(2)),
    };
  };
  // lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = historyData.filter(
    (item) =>
      item.quizName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  // phân trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  // xử lý chuyển trang
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // Format thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };
  // format ngày giờ
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
  // lấy thống kê
  const stats = calculateStats();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lịch sử làm bài</h1>
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Tống số bài đã làm</p>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm trung bình</p>
                <p className="text-2xl font-bold">
                  {stats.averageScore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Bài đạt trên 80 điểm</p>
                <p className="text-2xl font-bold">{stats.highScoreQuizzes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Bài thi đạt dưới 50 điểm
                </p>
                <p className="text-2xl font-bold">{stats.lowScoreQuizzes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bài thi hoặc chủ đề..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full rounde-md border border-gray-300 py-2 px-3 focus:outline-none foucs:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* bảng lịch sử làm bài */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Tên bài thi
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">
                    Chủ đề
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">
                    Điểm số
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">
                    Số câu đúng
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">
                    Thời gian
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">
                    Ngày giờ
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{item.quizName}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounde-full">
                          {item.topic}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div
                          className={`font-medium ${
                            item.score >= 80
                              ? "text-green-600"
                              : item.score >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.score.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div>
                          {item.correctAnswers}/ {item.totalQuestions}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{formatTime(item.timeTaken)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{formatDateTime(item.dateTime)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          to={`/quiz/${item.quizId}/result`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* phân trang */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm tex-gray-500">
              Hiển thị {startIndex + 1} đến{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} trong{" "}
              {filteredData.length} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover: bg-gray-100"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {/* Hiển thị các nút trang */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={i}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HistoryPage;
